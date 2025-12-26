import { callOpenRouter } from "@/lib/openrouter";
import { SYSTEM_PROMPT } from "@/lib/storyPrompt";
import { parseStoryResponse } from "@/lib/storyParser";

export async function generateStoryTurn(messages) {
  const openRouterMessages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...messages.map((m) => ({ role: m.role, content: m.content })),
  ];

  const raw = await callOpenRouter(openRouterMessages);
  return parseStoryResponse(raw);
}
