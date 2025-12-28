import { callOpenRouter } from '@/lib/openrouter';

const classificationPrompt = (text) => `
Classify the following document into one of these categories: Invoice, Receipt, Contract, Report, Other.

Document Text:
"""
${text.substring(0, 4000)}...
"""

Category:`;

const summarizationPrompt = (text) => `
Summarize the key points of the following document in 3-4 bullet points.

Document Text:
"""
${text.substring(0, 8000)}...
"""

Summary:`;

export async function classifyDocument(text) {
  const prompt = classificationPrompt(text);
  const response = await callOpenRouter([{ role: 'user', content: prompt }]);
  return response.trim();
}

export async function summarizeDocument(text) {
  const prompt = summarizationPrompt(text);
  const response = await callOpenRouter([{ role: 'user', content: prompt }]);
  return response.trim();
}
