import type { Chain, ChartPeriod } from "@/types";

/** Cache TTLs in seconds. Tuned to chain block times vs. provider quotas. */
export const CACHE_TTL = {
  overview: 60,
  transactions: 300,
  chart: 300,
  prices: 30,
} as const;

/** Per-IP rate limit: requests allowed per sliding window. */
export const RATE_LIMIT = { requests: 60, windowSeconds: 60 } as const;

/** Outbound request timeout (ms). */
export const FETCH_TIMEOUT_MS = 10_000;

export const TX_PAGE_SIZE = 25;

/** Native asset metadata per chain. */
export const NATIVE_ASSET: Record<
  Chain,
  { symbol: string; decimals: number; coingeckoId: string }
> = {
  ethereum: { symbol: "ETH", decimals: 18, coingeckoId: "ethereum" },
  solana: { symbol: "SOL", decimals: 9, coingeckoId: "solana" },
  bitcoin: { symbol: "BTC", decimals: 8, coingeckoId: "bitcoin" },
};

/** CoinGecko market_chart day spans per period. */
export const PERIOD_DAYS: Record<ChartPeriod, number> = {
  "7d": 7,
  "30d": 30,
  "90d": 90,
  "1y": 365,
};

/**
 * Curated pricing allowlist: ERC-20 contract (lowercased) → CoinGecko id. Tokens outside
 * this map are shown with balance but no USD value (explicit "—"), per the pricing strategy.
 */
export const ETH_TOKEN_PRICE_IDS: Record<string, string> = {
  "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48": "usd-coin", // USDC
  "0xdac17f958d2ee523a2206206994597c13d831ec7": "tether", // USDT
  "0x6b175474e89094c44da98b954eedeac495271d0f": "dai", // DAI
  "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2": "weth", // WETH
  "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599": "wrapped-bitcoin", // WBTC
};

/** Symbols treated as stablecoins for the stablecoin-share metric. */
export const STABLECOIN_SYMBOLS = new Set<string>([
  "USDC",
  "USDT",
  "DAI",
  "BUSD",
  "TUSD",
  "USDP",
  "FRAX",
  "USDE",
  "PYUSD",
]);

/** Outbound host allowlist (SSRF defence). */
export const ALLOWED_HOSTS = new Set<string>([
  "eth-mainnet.g.alchemy.com",
  "ethereum-rpc.publicnode.com",
  "api.etherscan.io",
  "mainnet.helius-rpc.com",
  "api.helius.xyz",
  "blockstream.info",
  "mempool.space",
  "api.coingecko.com",
]);
