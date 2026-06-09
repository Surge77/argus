import { describe, expect, it } from "vitest";

import {
  allocationByValue,
  summarizePortfolio,
  summarizeTransactions,
} from "@/lib/analytics";
import type { TokenHolding, Transaction, WalletOverview } from "@/types";

function token(p: Partial<TokenHolding>): TokenHolding {
  return {
    symbol: "X",
    name: "X",
    logoUrl: null,
    balance: "1",
    usdValue: null,
    priceChange24h: null,
    contractAddress: null,
    ...p,
  };
}

function overview(p: Partial<WalletOverview>): WalletOverview {
  return {
    address: "0x",
    chain: "ethereum",
    nativeBalance: { raw: "0", formatted: "1", usdValue: 2000 },
    tokens: [],
    lastActivity: null,
    ...p,
  };
}

function tx(p: Partial<Transaction>): Transaction {
  return {
    hash: "h",
    chain: "ethereum",
    type: "receive",
    value: "1",
    usdValue: null,
    fee: "0.01",
    timestamp: "2024-01-01T00:00:00.000Z",
    status: "confirmed",
    counterparty: null,
    ...p,
  };
}

describe("summarizePortfolio", () => {
  it("sums native and priced tokens, counts coverage and stablecoins", () => {
    const s = summarizePortfolio(
      overview({
        tokens: [
          token({ symbol: "USDC", usdValue: 500 }),
          token({ symbol: "RND", usdValue: 100 }),
          token({ symbol: "NOPRICE", usdValue: null }),
        ],
      }),
    );
    expect(s.totalUsd).toBe(2600);
    expect(s.tokenCount).toBe(3);
    expect(s.pricedCount).toBe(2);
    expect(s.stablecoinUsd).toBe(500);
  });
});

describe("summarizeTransactions", () => {
  it("computes in/out counts, net flow, fees, and last active", () => {
    const s = summarizeTransactions([
      tx({ type: "receive", value: "3", fee: "0.01", timestamp: "2024-02-01T00:00:00.000Z" }),
      tx({ type: "send", value: "1", fee: "0.02", timestamp: "2024-01-15T00:00:00.000Z" }),
    ]);
    expect(s).toMatchObject({ inCount: 1, outCount: 1, netFlow: 2 });
    expect(s.totalFees).toBeCloseTo(0.03);
    expect(s.lastActive).toBe("2024-02-01T00:00:00.000Z");
  });

  it("handles an empty sample", () => {
    expect(summarizeTransactions([])).toMatchObject({
      inCount: 0,
      outCount: 0,
      netFlow: 0,
      totalFees: 0,
      lastActive: null,
    });
  });
});

describe("allocationByValue", () => {
  it("sorts by value and groups the tail into Other", () => {
    const slices = allocationByValue(
      overview({
        nativeBalance: { raw: "0", formatted: "1", usdValue: 1000 },
        tokens: [
          token({ symbol: "A", usdValue: 900 }),
          token({ symbol: "B", usdValue: 800 }),
          token({ symbol: "C", usdValue: 700 }),
          token({ symbol: "D", usdValue: 600 }),
          token({ symbol: "E", usdValue: 50 }),
          token({ symbol: "F", usdValue: 25 }),
        ],
      }),
      5,
    );
    expect(slices[0]).toEqual({ label: "ETH", value: 1000 });
    expect(slices.at(-1)).toEqual({ label: "Other", value: 75 });
    expect(slices).toHaveLength(6);
  });

  it("excludes unpriced and zero-value entries", () => {
    const slices = allocationByValue(
      overview({
        nativeBalance: { raw: "0", formatted: "0", usdValue: 0 },
        tokens: [token({ symbol: "A", usdValue: 100 }), token({ symbol: "B", usdValue: null })],
      }),
    );
    expect(slices).toEqual([{ label: "A", value: 100 }]);
  });
});
