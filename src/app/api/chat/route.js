import { NextResponse } from "next/server";
import { callOpenRouter } from "@/lib/openrouter";
import { SYSTEM_PROMPT } from "@/lib/storyPrompt";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const body = await req.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid messages format" },
        { status: 400 }
      );
    }

    // Prepare messages for OpenRouter
    const openRouterMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    ];

    const aiResponse = await callOpenRouter(openRouterMessages);

    // Parse response into story & suggestions
    let story = "";
    let suggestions = [];

    if (aiResponse) {
      const storyMatch = aiResponse.match(
        /STORY:[\s\S]*?(SUGGESTIONS:|$)/i
      );

      if (storyMatch) {
        story = storyMatch[0]
          .replace(/STORY:/i, "")
          .replace(/SUGGESTIONS:/i, "")
          .trim();
      }

      const suggestionMatch = aiResponse.match(/SUGGESTIONS:[\s\S]*$/i);

      if (suggestionMatch) {
        suggestions = suggestionMatch[0]
          .replace(/SUGGESTIONS:/i, "")
          .split("\n")
          .map((s) => s.replace(/^\d+\.\s*/, "").trim())
          .filter(Boolean);
      }
    }

    return NextResponse.json({ story, suggestions });
  } catch (err) {
    console.error("/api/chat ERROR", err);
    return NextResponse.json(
      { error: "Internal Error" },
      { status: 500 }
    );
  }
}
