import { createWorker } from 'tesseract.js';

export async function performOCR(filepath) {
  const worker = await createWorker();
  try {
    const { data: { text } } = await worker.recognize(filepath);
    return text;
  } catch (error) {
    console.error('OCR Error:', error);
    throw new Error('OCR processing failed.');
  } finally {
    await worker.terminate();
  }
}
