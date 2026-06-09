import { getJson } from "@/lib/http";
import { env } from "@/lib/env";
import type { ChartPoint } from "@/types";

const BASE = "https://api.coingecko.com/api/v3";

function headers(): HeadersInit | undefined {
  const key = env.coingeckoApiKey;
  return key ? { "x-cg-demo-api-key": key } : undefined;
}

export interface PriceInfo {
  usd: number;
  change24h: number;
}

type SimplePriceResponse = Record<
  string,
  { usd?: number; usd_24h_change?: number }
>;

/** Spot USD price + 24h change for one or more CoinGecko ids. */
export async function getPrices(ids: string[]): Promise<Record<string, PriceInfo>> {
  if (ids.length === 0) return {};
  const url = `${BASE}/simple/price?ids=${ids.join(",")}&vs_currencies=usd&include_24hr_change=true`;
  const raw = await getJson<SimplePriceResponse>(url, { headers: headers() });
  const out: Record<string, PriceInfo> = {};
  for (const [id, entry] of Object.entries(raw)) {
    if (typeof entry.usd === "number") {
      out[id] = { usd: entry.usd, change24h: entry.usd_24h_change ?? 0 };
    }
  }
  return out;
}

type MarketChartResponse = { prices: [number, number][] };

/** Native-asset price series for a period (days). */
export async function getMarketChart(
  coingeckoId: string,
  days: number,
): Promise<ChartPoint[]> {
  const url = `${BASE}/coins/${coingeckoId}/market_chart?vs_currency=usd&days=${days}`;
  const raw = await getJson<MarketChartResponse>(url, { headers: headers() });
  return raw.prices.map(([ms, usd]) => ({ t: new Date(ms).toISOString(), usd }));
}
