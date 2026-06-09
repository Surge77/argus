import { truncateForLog } from "@/lib/utils";

type Level = "debug" | "info" | "warn" | "error";

interface LogFields {
  message: string;
  address?: string;
  chain?: string;
  cache_hit?: boolean;
  duration_ms?: number;
  [key: string]: unknown;
}

/** Structured JSON log to stdout. Wallet addresses are always truncated (privacy). */
export function log(level: Level, fields: LogFields): void {
  const { address, ...rest } = fields;
  const payload = {
    level,
    ...rest,
    ...(address ? { address: truncateForLog(address) } : {}),
    timestamp: new Date().toISOString(),
  };
  console[level === "debug" ? "log" : level](JSON.stringify(payload));
}
