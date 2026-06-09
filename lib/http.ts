import { ALLOWED_HOSTS, FETCH_TIMEOUT_MS } from "@/lib/constants";

export class UpstreamError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "UpstreamError";
  }
}

/**
 * Fetch wrapper with an SSRF host allowlist and a hard timeout. Every outbound call from a
 * route handler must go through this — never raw `fetch` to a user-influenced URL.
 */
export async function safeFetch(
  url: string,
  init?: RequestInit,
): Promise<Response> {
  const parsed = new URL(url);
  if (parsed.protocol !== "https:") {
    throw new UpstreamError(`Refusing non-HTTPS request to ${parsed.protocol}`);
  }
  if (!ALLOWED_HOSTS.has(parsed.hostname)) {
    throw new UpstreamError(`Host not in allowlist: ${parsed.hostname}`);
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, { ...init, signal: controller.signal });
    if (!res.ok) {
      throw new UpstreamError(`Upstream ${parsed.hostname} returned ${res.status}`, res.status);
    }
    return res;
  } catch (err) {
    if (err instanceof UpstreamError) throw err;
    if (err instanceof Error && err.name === "AbortError") {
      throw new UpstreamError(`Upstream ${parsed.hostname} timed out`);
    }
    throw new UpstreamError(`Upstream ${parsed.hostname} request failed`);
  } finally {
    clearTimeout(timer);
  }
}

/** JSON GET via safeFetch. */
export async function getJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await safeFetch(url, { ...init, method: init?.method ?? "GET" });
  return (await res.json()) as T;
}

/** JSON-RPC POST via safeFetch. */
export async function rpcCall<T>(
  url: string,
  method: string,
  params: unknown,
): Promise<T> {
  const res = await safeFetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
  });
  const body = (await res.json()) as { result?: T; error?: { message: string } };
  if (body.error) throw new UpstreamError(`RPC ${method} failed: ${body.error.message}`);
  return body.result as T;
}
