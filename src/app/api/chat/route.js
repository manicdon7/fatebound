import { generateStoryTurn } from "@/lib/storyEngine";
import {
  checkRateLimit,
  getClientIp,
  getRequestId,
  jsonError,
  jsonOk,
  validateChatMessages,
} from "@/lib/apiUtils";

export const runtime = "nodejs";

export async function POST(req) {
  const requestId = getRequestId(req);
  const ip = getClientIp(req);

  const rl = checkRateLimit({ key: `chat:${ip}`, limit: 30, windowMs: 60_000 });
  if (!rl.ok) {
    return jsonError(
      {
        code: "RATE_LIMITED",
        message: "Too many requests. Please wait and try again.",
        requestId,
      },
      429,
      {
        headers: {
          "X-Request-Id": requestId,
          "Retry-After": String(Math.max(1, Math.ceil((rl.resetAt - Date.now()) / 1000))),
        },
      }
    );
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return jsonError(
      { code: "BAD_JSON", message: "Invalid JSON body", requestId },
      400,
      { headers: { "X-Request-Id": requestId } }
    );
  }

  const { messages } = body || {};
  const validation = validateChatMessages(messages);
  if (!validation.ok) {
    return jsonError(
      {
        code: "INVALID_REQUEST",
        message: validation.error,
        requestId,
      },
      400,
      { headers: { "X-Request-Id": requestId } }
    );
  }

  try {
    const { story, suggestions } = await generateStoryTurn(messages);
    return jsonOk(
      { story, suggestions },
      {
        headers: {
          "X-Request-Id": requestId,
          "X-RateLimit-Remaining": String(rl.remaining),
        },
      }
    );
  } catch (err) {
    const status = typeof err?.status === "number" ? err.status : 500;

    if (status === 401 || status === 403) {
      return jsonError(
        {
          code: "AI_AUTH_ERROR",
          message: "AI provider authentication failed. Check server configuration.",
          requestId,
        },
        500,
        { headers: { "X-Request-Id": requestId } }
      );
    }

    if (status === 429) {
      return jsonError(
        {
          code: "AI_RATE_LIMITED",
          message: "AI provider is rate limiting requests. Please try again.",
          requestId,
        },
        503,
        { headers: { "X-Request-Id": requestId } }
      );
    }

    if (status >= 400 && status <= 499) {
      return jsonError(
        {
          code: "AI_BAD_REQUEST",
          message: "AI provider rejected the request.",
          requestId,
        },
        502,
        { headers: { "X-Request-Id": requestId } }
      );
    }

    return jsonError(
      {
        code: "INTERNAL_ERROR",
        message: "Internal Error",
        requestId,
      },
      500,
      { headers: { "X-Request-Id": requestId } }
    );
  }
}
