import { describe, expect, it } from "vitest";

import {
  transformBitcoinOverview,
  transformBitcoinTransactions,
} from "@/lib/adapters/bitcoin";
import {
  transformEthereumOverview,
  transformEthereumTokens,
  transformEthereumTransfers,
} from "@/lib/adapters/ethereum";
import {
  transformSolanaTokens,
  transformSolanaTransactions,
} from "@/lib/adapters/solana";

const ETH = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";
const BTC = "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa";
const SOL = "So11111111111111111111111111111111111111112";

describe("ethereum adapter", () => {
  it("prices allowlisted tokens and leaves others null", () => {
    const tokens = transformEthereumTokens(
      [
        {
          contractAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC
          rawBalanceHex: "0x" + (1_000_000n).toString(16), // 1 USDC (6 decimals)
          metadata: { symbol: "USDC", name: "USD Coin", decimals: 6, logo: null },
        },
        {
          contractAddress: "0x1111111111111111111111111111111111111111",
          rawBalanceHex: "0x" + (5n * 10n ** 18n).toString(16),
          metadata: { symbol: "RND", name: "Random", decimals: 18, logo: null },
        },
      ],
      { "usd-coin": { usd: 1, change24h: 0.1 } },
    );
    expect(tokens[0]).toMatchObject({ symbol: "USDC", balance: "1", usdValue: 1 });
    expect(tokens[1]).toMatchObject({ symbol: "RND", usdValue: null });
  });

  it("drops zero balances", () => {
    const tokens = transformEthereumTokens(
      [
        {
          contractAddress: "0x2222222222222222222222222222222222222222",
          rawBalanceHex: "0x0",
          metadata: { symbol: "Z", name: "Zero", decimals: 18, logo: null },
        },
      ],
      {},
    );
    expect(tokens).toHaveLength(0);
  });

  it("builds an overview with USD native value", () => {
    const ov = transformEthereumOverview(ETH, "0x" + (2n * 10n ** 18n).toString(16), [], 2000, null);
    expect(ov).toMatchObject({
      chain: "ethereum",
      nativeBalance: { formatted: "2", usdValue: 4000 },
    });
  });

  it("classifies transfers by direction and sorts newest first", () => {
    const txs = transformEthereumTransfers(ETH, [
      { hash: "0xa", from: ETH, to: "0xother", value: 1, asset: "ETH", blockTimestamp: "2024-01-01T00:00:00Z" },
      { hash: "0xb", from: "0xother", to: ETH, value: 2, asset: "ETH", blockTimestamp: "2024-02-01T00:00:00Z" },
    ]);
    expect(txs[0]).toMatchObject({ hash: "0xb", type: "receive" });
    expect(txs[1]).toMatchObject({ hash: "0xa", type: "send" });
  });
});

describe("bitcoin adapter", () => {
  it("computes balance from funded minus spent", () => {
    const ov = transformBitcoinOverview(
      BTC,
      { chain_stats: { funded_txo_sum: 150_000_000, spent_txo_sum: 50_000_000 } },
      30_000,
      "2024-01-01T00:00:00.000Z",
    );
    expect(ov.nativeBalance).toMatchObject({ formatted: "1", usdValue: 30_000 });
    expect(ov.tokens).toHaveLength(0);
  });

  it("classifies a received tx", () => {
    const txs = transformBitcoinTransactions(BTC, [
      {
        txid: "t1",
        fee: 1000,
        status: { confirmed: true, block_time: 1_700_000_000 },
        vin: [{ prevout: { scriptpubkey_address: "other", value: 200_000_000 } }],
        vout: [{ scriptpubkey_address: BTC, value: 100_000_000 }],
      },
    ]);
    expect(txs[0]).toMatchObject({ type: "receive", value: "1", status: "confirmed" });
  });
});

describe("solana adapter", () => {
  it("maps DAS fungible tokens with USD price", () => {
    const tokens = transformSolanaTokens([
      {
        interface: "FungibleToken",
        id: "mint1",
        content: { metadata: { symbol: "USDC", name: "USD Coin" }, links: { image: "x" } },
        token_info: {
          balance: 2_000_000,
          decimals: 6,
          symbol: "USDC",
          price_info: { total_price: 2 },
        },
      },
    ]);
    expect(tokens[0]).toMatchObject({ symbol: "USDC", balance: "2", usdValue: 2 });
  });

  it("classifies a sent native transfer", () => {
    const txs = transformSolanaTransactions(SOL, [
      {
        signature: "s1",
        timestamp: 1_700_000_000,
        fee: 5000,
        nativeTransfers: [{ fromUserAccount: SOL, toUserAccount: "other", amount: 1_000_000_000 }],
      },
    ]);
    expect(txs[0]).toMatchObject({ type: "send", value: "1", status: "confirmed" });
  });
});
