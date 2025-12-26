import { NextResponse } from "next/server";
import { generateStoryTurn } from "@/lib/storyEngine";

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

    const { story, suggestions } = await generateStoryTurn(messages);

    return NextResponse.json({ story, suggestions });
  } catch (err) {
    console.error("/api/chat ERROR", err);
    return NextResponse.json(
      { error: "Internal Error" },
      { status: 500 }
    );
  }
}
