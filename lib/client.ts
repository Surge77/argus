import type { ApiError, ApiSuccess } from "@/types";

/**
 * Client-side fetch for the app's own API. Unwraps the success envelope or throws the
 * error message. Used by the TanStack Query hooks.
 */
export async function fetchApi<T>(path: string): Promise<T> {
  const res = await fetch(path);
  const body = (await res.json()) as ApiSuccess<T> | ApiError;
  if (!res.ok || "error" in body) {
    const message = "error" in body ? body.error : `Request failed (${res.status})`;
    throw new Error(message);
  }
  return body.data;
}
