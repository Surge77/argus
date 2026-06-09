import { Redis } from "@upstash/redis";

import { env } from "@/lib/env";

let client: Redis | null = null;

function redis(): Redis {
  if (!client) {
    client = new Redis({ url: env.upstashUrl, token: env.upstashToken });
  }
  return client;
}

export interface Cached<T> {
  value: T;
  hit: boolean;
}

/**
 * Read-through cache. On hit returns the stored value; on miss runs `loader`, stores the
 * result with `ttlSeconds`, and returns it. Cache/transport failures degrade to a direct
 * loader call rather than failing the request.
 */
export async function cached<T>(
  key: string,
  ttlSeconds: number,
  loader: () => Promise<T>,
): Promise<Cached<T>> {
  try {
    const stored = await redis().get<T>(key);
    if (stored !== null && stored !== undefined) {
      return { value: stored, hit: true };
    }
  } catch {
    // Cache unavailable — fall through to loader.
  }

  const value = await loader();

  try {
    await redis().set(key, value, { ex: ttlSeconds });
  } catch {
    // Best-effort write; ignore failures.
  }

  return { value, hit: false };
}
