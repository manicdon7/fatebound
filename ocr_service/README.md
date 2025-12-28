# OCR Service

A standalone FastAPI service to perform OCR on images using Tesseract.

## Setup

1.  **Install Tesseract OCR Engine**

    You must have Google's Tesseract OCR engine installed on your system. 

    - **macOS**: `brew install tesseract`
    - **Ubuntu**: `sudo apt update && sudo apt install tesseract-ocr`

2.  **Create a Virtual Environment**

    ```bash
    python3 -m venv venv
    source venv/bin/activate
    ```

3.  **Install Dependencies**

    ```bash
    pip install -r requirements.txt
    ```

## Running the Service

Start the service with Uvicorn:

```bash
uvicorn main:app --reload --port 8001
```

The service will be available at `http://localhost:8001`.
