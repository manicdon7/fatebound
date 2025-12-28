export function jsonOk(data, init = {}) {
  return Response.json(data, {
    status: 200,
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });
}

export function jsonError(
  { code, message, requestId, details },
  status = 500,
  init = {}
) {
  return Response.json(
    {
      error: {
        code,
        message,
        requestId,
        ...(details ? { details } : {}),
      },
    },
    {
      status,
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init.headers || {}),
      },
    }
  );
}

export function getRequestId(req) {
  const existing = req.headers.get("x-request-id");
  if (existing) return existing;
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function getClientIp(req) {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const realIp = req.headers.get("x-real-ip");
  return realIp || "unknown";
}

const rateBuckets = new Map();

export function checkRateLimit({ key, limit, windowMs }) {
  const now = Date.now();
  const bucket = rateBuckets.get(key);

  if (!bucket) {
    rateBuckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1, resetAt: now + windowMs };
  }

  if (now > bucket.resetAt) {
    rateBuckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1, resetAt: now + windowMs };
  }

  if (bucket.count >= limit) {
    return { ok: false, remaining: 0, resetAt: bucket.resetAt };
  }

  bucket.count += 1;
  return { ok: true, remaining: limit - bucket.count, resetAt: bucket.resetAt };
}

export function validateChatMessages(messages) {
  if (!Array.isArray(messages)) {
    return { ok: false, error: "messages must be an array" };
  }

  if (messages.length < 1) {
    return { ok: false, error: "messages must not be empty" };
  }

  if (messages.length > 50) {
    return { ok: false, error: "messages exceeds max length (50)" };
  }

  for (let i = 0; i < messages.length; i += 1) {
    const m = messages[i];
    const roleOk = m && (m.role === "user" || m.role === "assistant");
    if (!roleOk) {
      return { ok: false, error: `messages[${i}].role must be 'user' or 'assistant'` };
    }
    if (typeof m.content !== "string") {
      return { ok: false, error: `messages[${i}].content must be a string` };
    }
    const trimmed = m.content.trim();
    if (!trimmed) {
      return { ok: false, error: `messages[${i}].content must not be empty` };
    }
    if (trimmed.length > 4000) {
      return { ok: false, error: `messages[${i}].content exceeds max length (4000)` };
    }
  }

  return { ok: true };
}
