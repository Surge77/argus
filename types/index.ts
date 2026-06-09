/**
 * Canonical, chain-agnostic types.
 *
 * Every chain adapter maps its provider's raw response into these shapes before the data
 * reaches a route handler or the UI. Components and hooks only ever see these types, so a
 * provider swap stays contained to `lib/adapters/`.
 */

export type Chain = "ethereum" | "solana" | "bitcoin";

export type TransactionType =
  | "send"
  | "receive"
  | "swap"
  | "contract_interaction"
  | "unknown";

export type TransactionStatus = "confirmed" | "pending" | "failed";

export interface NativeBalance {
  /** Smallest unit (wei / lamports / satoshis) as a decimal string to avoid bigint JSON loss. */
  raw: string;
  /** Human-readable amount in the native unit (ETH / SOL / BTC). */
  formatted: string;
  usdValue: number | null;
}

export interface TokenHolding {
  symbol: string;
  name: string;
  logoUrl: string | null;
  balance: string;
  /** Null when the token is not on the pricing allowlist. */
  usdValue: number | null;
  priceChange24h: number | null;
  contractAddress: string | null;
}

export interface WalletOverview {
  address: string;
  chain: Chain;
  nativeBalance: NativeBalance;
  tokens: TokenHolding[];
  /** ISO 8601, or null for a wallet with no activity. */
  lastActivity: string | null;
}

export interface Transaction {
  hash: string;
  chain: Chain;
  type: TransactionType;
  value: string;
  usdValue: number | null;
  fee: string;
  timestamp: string;
  status: TransactionStatus;
  counterparty: string | null;
}

export type ChartPeriod = "7d" | "30d" | "90d" | "1y";

export interface ChartPoint {
  /** ISO 8601 timestamp. */
  t: string;
  usd: number;
}

/** Standard success envelope for all route handlers. */
export interface ApiSuccess<T> {
  data: T;
  cached: boolean;
  timestamp: string;
}

/** Standard error envelope for all route handlers. */
export interface ApiError {
  error: string;
  code: string;
  retryAfter?: number;
}
