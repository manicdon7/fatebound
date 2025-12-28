import { NextResponse } from 'next/server';
import { performOCR } from '@/services/ocr';
import { classifyDocument, summarizeDocument } from '@/services/llm';

const services = {
  ocr: performOCR,
  classify: classifyDocument,
  summarize: summarizeDocument,
};

export async function POST(req) {
  try {
    const { filepath, steps } = await req.json();

    if (!filepath || !Array.isArray(steps) || steps.length === 0) {
      return NextResponse.json({ error: 'Invalid workflow definition.' }, { status: 400 });
    }

    let currentData = filepath; // Initial data is the file path for OCR
    const results = [];

    for (const step of steps) {
      const service = services[step.type];
      if (!service) {
        throw new Error(`Unknown service type: ${step.type}`);
      }

      // The first step is always OCR, which takes a filepath.
      // Subsequent steps take the text output from the previous step.
      currentData = await service(currentData);
      results.push({ step: step.type, result: currentData });
    }

    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error('Workflow execution error:', error);
    return NextResponse.json({ error: 'Workflow execution failed.' }, { status: 500 });
  }
}
