/** Locale-aware USD formatting. */
export function formatCurrency(
  value: number,
  options: { locale?: string; maximumFractionDigits?: number } = {},
): string {
  const { locale = "en-US", maximumFractionDigits = 2 } = options;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits,
  }).format(value);
}

/** Locale-aware percentage with a sign, e.g. "+2.34%". */
export function formatPercent(value: number, locale = "en-US"): string {
  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
  return `${value > 0 ? "+" : ""}${formatted}%`;
}

const TRUNCATE_HEAD = 6;
const TRUNCATE_TAIL = 4;

/**
 * Shorten an address for display: `0x1234…abcd`. Addresses that are already short enough
 * are returned unchanged.
 */
export function truncateAddress(
  address: string,
  head = TRUNCATE_HEAD,
  tail = TRUNCATE_TAIL,
): string {
  if (address.length <= head + tail + 1) return address;
  return `${address.slice(0, head)}…${address.slice(-tail)}`;
}

/**
 * Truncate an address for logs: first 8 + last 4, never the full value (privacy).
 * Distinct from `truncateAddress` so the log format can't drift from the UI format.
 */
export function truncateForLog(address: string): string {
  if (address.length <= 12) return address;
  return `${address.slice(0, 8)}…${address.slice(-4)}`;
}
