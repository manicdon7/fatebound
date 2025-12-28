import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { type, data, workflowId } = await req.json();

    // This is where you will eventually call Tesseract or OpenRouter
    let processedResult = "";

    console.log("Step API called with:", { type, data, workflowId });

    if (type === 'ocr') {
      processedResult = `Sample OCR text extracted from file: ${data}`;
    } else if (type === 'summarize') {
      processedResult = "This is a summary of the document content.";
    } else {
      processedResult = `Result from ${type} step.`;
    }

    return NextResponse.json({ 
      success: true, 
      result: processedResult 
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}