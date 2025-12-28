import { promises as fs } from 'fs';
import path from 'path';

// Ensure this matches your FastAPI server address
const OCR_SERVICE_URL = process.env.OCR_SERVICE_URL || 'http://127.0.0.1:8000/ocr';

export async function performOCR(filepath) {
  try {
    // 1. Read the local file as a Buffer
    const fileBuffer = await fs.readFile(filepath);
    const filename = path.basename(filepath);

    // 2. Determine MIME type (Basic check)
    const ext = path.extname(filename).toLowerCase();
    const contentType = ext === '.pdf' ? 'application/pdf' : 'image/jpeg';

    // 3. Construct FormData
    const formData = new FormData();
    // Wrap the buffer in a Blob so fetch treats it as a file upload
    const fileBlob = new Blob([fileBuffer], { type: contentType });
    
    // 'file' must match the parameter name in your FastAPI endpoint: 
    // e.g., async def perform_ocr(file: UploadFile = File(...))
    formData.append('file', fileBlob, filename);

    // 4. Execute the request
    const response = await fetch(OCR_SERVICE_URL, {
      method: 'POST',
      body: formData,
      // NOTE: Do NOT set Content-Type header. Fetch does this automatically.
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`OCR service (FastAPI) failed [${response.status}]: ${errorBody}`);
    }

    const result = await response.json();
    
    // Return the text field from your FastAPI response
    return result.text;

  } catch (error) {
    console.error('OCR API Communication Error:', error.message);
    throw new Error(`Failed to extract text: ${error.message}`);
  }
}