export async function callOpenRouter(messages) {
  const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error("Missing NEXT_PUBLIC_OPENROUTER_API_KEY in environment variables");
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30_000);

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_ORIGIN || "http://localhost:3000",
      "X-Title": "Fatebound",
    },
    body: JSON.stringify({
      model: "openai/gpt-oss-20b:free",
      messages,
      max_tokens: 800,
      temperature: 0.85,
    }),
    signal: controller.signal,
  }).finally(() => clearTimeout(timeoutId));

  if (!res.ok) {
    const errorText = await res.text();
    console.error("OpenRouter error:", errorText);
    throw new Error("OpenRouter API error: " + errorText);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "";
}