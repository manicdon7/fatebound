export async function callOpenRouter(messages) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = process.env.OPENROUTER_MODEL || "z-ai/glm-4.5-air:free";

  if (!apiKey) {
    throw new Error("Missing OPENROUTER_API_KEY in environment variables");
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30_000);

  const url = "https://openrouter.ai/api/v1/chat/completions";

  const makeRequest = async () => {
    return fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_ORIGIN || "http://localhost:3000",
        "X-Title": "Fatebound",
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: 800,
        temperature: 0.85,
      }),
      signal: controller.signal,
    });
  };

  const retryableStatus = (status) => status === 429 || (status >= 500 && status <= 599);

  let res;
  try {
    for (let attempt = 0; attempt < 3; attempt += 1) {
      res = await makeRequest();
      if (res.ok) break;
      if (!retryableStatus(res.status) || attempt === 2) break;
      const backoffMs = 250 * Math.pow(2, attempt);
      await new Promise((r) => setTimeout(r, backoffMs));
    }
  } finally {
    clearTimeout(timeoutId);
  }

  if (!res.ok) {
    const errorText = await res.text().catch(() => "");
    const err = new Error("OpenRouter API error");
    err.status = res.status;
    err.details = errorText;
    throw err;
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "";
}