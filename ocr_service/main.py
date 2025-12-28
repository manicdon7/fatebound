import io
import cv2
import numpy as np
import easyocr
import concurrent.futures
import os
import asyncio
import httpx
import json
from fastapi import FastAPI, File, UploadFile, HTTPException
from pdf2image import convert_from_bytes
from typing import List, Dict, Any

app = FastAPI(title="Universal Document OCR + AI Structured Extraction")

# ==================== CONFIG ====================
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
if not OPENROUTER_API_KEY:
    raise ValueError("Please set OPENROUTER_API_KEY")

OPENROUTER_MODEL = os.getenv("OPENROUTER_MODEL", "xiaomi/mimo-v2-flash:free")

OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
APP_ORIGIN = os.getenv("NEXT_PUBLIC_APP_ORIGIN", "http://localhost:3000")

# OCR Reader - Synchronous
READER = easyocr.Reader(['en', 'ta'], gpu=False)

# ==================== PREPROCESSING ====================
def analyze_image_quality(img: np.ndarray) -> Dict:
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    blur_score = float(cv2.Laplacian(gray, cv2.CV_64F).var())
    brightness = float(np.mean(gray))
    contrast = float(np.std(gray))
    return {
        "blur_score": round(blur_score, 2),
        "brightness": round(brightness, 2),
        "contrast": round(contrast, 2),
        "is_blurry": blur_score < 100,
        "is_dark": brightness < 80,
        "is_low_contrast": contrast < 40,
    }

def adaptive_preprocess_image(image_bytes: bytes) -> np.ndarray:
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    quality = analyze_image_quality(img)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    gamma = 0.7 if quality["is_dark"] else 1.5 if quality["brightness"] > 180 else 1.2
    gamma_table = np.array([((i / 255.0) ** gamma) * 255 for i in np.arange(256)]).astype("uint8")
    gray = cv2.LUT(gray, gamma_table)
    
    clip = 8.0 if quality["is_low_contrast"] else 4.0
    clahe = cv2.createCLAHE(clipLimit=clip, tileGridSize=(8, 8))
    gray = clahe.apply(gray)
    
    gray = cv2.bilateralFilter(gray, 15, 80, 80)
    kernel = np.array([[-1,-1,-1], [-1,20,-1], [-1,-1,-1]]) * 0.1
    gray = cv2.filter2D(gray, -1, kernel)
    
    scale = 5 if quality["is_blurry"] else 4
    h, w = gray.shape
    upscaled = cv2.resize(gray, (w * scale, h * scale), interpolation=cv2.INTER_LANCZOS4)
    
    if quality["is_low_contrast"]:
        adaptive = cv2.adaptiveThreshold(upscaled, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 15, 3)
        _, otsu = cv2.threshold(upscaled, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        binary = cv2.bitwise_or(adaptive, otsu)
    else:
        _, binary = cv2.threshold(upscaled, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    
    kernel = np.ones((3,3), np.uint8)
    binary = cv2.morphologyEx(binary, cv2.MORPH_CLOSE, kernel, iterations=3)
    binary = cv2.morphologyEx(binary, cv2.MORPH_OPEN, kernel, iterations=1)
    binary = cv2.dilate(binary, np.ones((2,2), np.uint8), iterations=2)
    
    return binary

def extract_text_safely(results) -> List[str]:
    texts = []
    for item in results:
        if isinstance(item, str):
            text = item.strip()
        elif isinstance(item, (list, tuple)) and len(item) >= 2:
            text = item[1].strip()
        else:
            continue
        if text and len(text) > 1:
            texts.append(text)
    return texts

# THIS MUST BE SYNC (def, not async def)
def perform_ocr(image_bytes: bytes) -> str:
    img = adaptive_preprocess_image(image_bytes)
    results = READER.readtext(
        img,
        paragraph=True,
        min_size=6,
        text_threshold=0.3,
        low_text=0.1,
        mag_ratio=3.0,
    )
    lines = extract_text_safely(results)
    if len(lines) < 10:
        results = READER.readtext(img, paragraph=True, text_threshold=0.7, mag_ratio=1.5)
        lines = extract_text_safely(results)
    return "\n".join(lines)

# ==================== OPENROUTER (ASYNC) ====================
async def call_openrouter(messages: List[Dict]) -> str:
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": APP_ORIGIN,
        "X-Title": "Fatebound",
    }
    payload = {
        "model": OPENROUTER_MODEL,
        "messages": messages,
        "max_tokens": 2000,
        "temperature": 0.3,
    }
    
    async with httpx.AsyncClient(timeout=60.0) as client:
        for attempt in range(3):
            try:
                resp = await client.post(OPENROUTER_URL, headers=headers, json=payload)
                if resp.status_code == 200:
                    return resp.json()["choices"][0]["message"]["content"].strip()
                await asyncio.sleep(0.5 * (2 ** attempt))
            except:
                await asyncio.sleep(1 * (2 ** attempt))
    raise Exception("OpenRouter unreachable")

# ==================== AI CLEAN + STRUCTURE ====================
async def clean_and_structure(raw_text: str) -> Dict[str, Any]:
    clean_prompt = f"""
Correct all OCR errors. Fix spelling, broken words, formatting. Preserve structure and meaning.

\"\"\"{raw_text}\"\"\"

Output only the clean full text:
"""
    clean_text = await call_openrouter([{"role": "user", "content": clean_prompt}])

    structure_prompt = f"""
Analyze this document and output ONLY valid JSON:
{{
  "document_type": "detected type (e.g., Resume, Voter ID, Invoice, Aadhaar, Bank Statement, Letter, General Document)",
  "extracted_data": {{ structured key-value data }}
}}

Document:
\"\"\"{clean_text}\"\"\"
"""
    response = await call_openrouter([
        {"role": "system", "content": "Output only valid JSON. No explanation."},
        {"role": "user", "content": structure_prompt}
    ])

    try:
        start = response.find("{")
        end = response.rfind("}") + 1
        return json.loads(response[start:end])
    except:
        return {
            "document_type": "Parse Failed",
            "extracted_data": {"clean_text": clean_text, "error": "JSON parse failed"}
        }

# ==================== MAIN ENDPOINT ====================
@app.post("/ocr")
@app.post("/ocr")
async def ocr_endpoint(file: UploadFile = File(...)):  # ← Renamed to avoid conflict
    contents = await file.read()
    raw_texts = []
    quality_info = None

    try:
        pages_as_bytes = []
        if "pdf" in file.content_type.lower():
            images = convert_from_bytes(contents, dpi=400)
            with concurrent.futures.ThreadPoolExecutor() as exec:
                futures = []
                for im in images:
                    def convert_one(img=im):
                        buf = io.BytesIO()
                        img.save(buf, format="JPEG", quality=98)
                        return buf.getvalue()
                    futures.append(exec.submit(convert_one))
                pages_as_bytes = [f.result() for f in concurrent.futures.as_completed(futures)]
        else:
            pages_as_bytes = [contents]

        for i, page_bytes in enumerate(pages_as_bytes):
            if quality_info is None:
                nparr = np.frombuffer(page_bytes, np.uint8)
                img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
                quality_info = analyze_image_quality(img)
            
            # Now safely calls the sync perform_ocr function
            text = perform_ocr(page_bytes)  # ← This now works correctly
            raw_texts.append(f"--- Page {i+1} ---\n{text}")

        raw_full_text = "\n\n".join(raw_texts)
        structured = await clean_and_structure(raw_full_text)

        return {
            "success": True,
            "image_quality": quality_info,
            "raw_ocr_text": raw_full_text,
            "clean_text": structured.get("extracted_data", {}).get("clean_text", raw_full_text),
            "structured_data": structured
        }

    except Exception as e:
        import traceback
        raise HTTPException(status_code=500, detail=f"Error: {traceback.format_exc()}")