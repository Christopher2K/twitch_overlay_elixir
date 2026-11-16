export type CaptionPayload = {
  partial: string;
  finalized: string[];
};

function csrfToken() {
  const token = document
    .querySelector('meta[name="csrf-token"]')
    ?.getAttribute("content");

  if (!token) throw new Error("The CSRF token is missing. Reload this page.");
  return token;
}

async function post(path: string, body?: object, keepalive = false) {
  const response = await fetch(path, {
    method: "POST",
    credentials: "same-origin",
    keepalive,
    headers: {
      Accept: "text/html",
      "Content-Type": "application/json",
      "x-csrf-token": csrfToken(),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const data = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;
    throw new Error(data?.error ?? "The caption request failed.");
  }

  if (!response.headers.get("content-type")?.includes("application/json")) {
    throw new Error("Your admin session may have expired. Reload this page.");
  }

  return response;
}

export async function getTemporarySonioxKey() {
  const response = await post("/admin/captions/temporary-key");
  return (await response.json()) as { api_key: string; expires_at: string };
}

export async function publishCaption(payload: CaptionPayload) {
  await post("/admin/captions/publish", payload);
}

export async function clearPublishedCaptions(keepalive = false) {
  await post("/admin/captions/publish", { action: "clear" }, keepalive);
}
