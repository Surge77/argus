import { Alchemy, Network, SortingOrder, AssetTransfersCategory } from "alchemy-sdk";
import { formatUnits } from "viem";

import {
  ETH_TOKEN_PRICE_IDS,
  NATIVE_ASSET,
  TX_PAGE_SIZE,
} from "@/lib/constants";
import { env } from "@/lib/env";
import { getPrices, type PriceInfo } from "@/lib/prices";
import type { TokenHolding, Transaction, WalletOverview } from "@/types";

const { decimals, coingeckoId } = NATIVE_ASSET.ethereum;

let client: Alchemy | null = null;
function alchemy(): Alchemy {
  if (!client) {
    client = new Alchemy({ apiKey: env.alchemyApiKey, network: Network.ETH_MAINNET });
  }
  return client;
}

export interface RawTokenBalance {
  contractAddress: string;
  rawBalanceHex: string;
  metadata: { name?: string | null; symbol?: string | null; decimals?: number | null; logo?: string | null };
}

export interface RawTransfer {
  hash: string;
  from: string | null;
  to: string | null;
  value: number | null;
  asset: string | null;
  blockTimestamp?: string;
}

/** Pure: token balances + metadata + price map → canonical holdings (priced if allowlisted). */
export function transformEthereumTokens(
  items: RawTokenBalance[],
  prices: Record<string, PriceInfo>,
): TokenHolding[] {
  return items
    .map((item) => {
      const dec = item.metadata.decimals ?? 18;
      const balance = formatUnits(BigInt(item.rawBalanceHex), dec);
      const priceId = ETH_TOKEN_PRICE_IDS[item.contractAddress.toLowerCase()];
      const price = priceId ? prices[priceId] : undefined;
      return {
        symbol: item.metadata.symbol ?? "?",
        name: item.metadata.name ?? "Unknown",
        logoUrl: item.metadata.logo ?? null,
        balance,
        usdValue: price ? Number(balance) * price.usd : null,
        priceChange24h: price?.change24h ?? null,
        contractAddress: item.contractAddress,
      };
    })
    .filter((t) => Number(t.balance) > 0);
}

/** Pure: native balance + tokens → canonical overview. */
export function transformEthereumOverview(
  address: string,
  weiHex: string,
  tokens: TokenHolding[],
  nativeUsd: number | null,
  lastActivity: string | null,
): WalletOverview {
  const formatted = formatUnits(BigInt(weiHex), decimals);
  return {
    address,
    chain: "ethereum",
    nativeBalance: {
      raw: BigInt(weiHex).toString(),
      formatted,
      usdValue: nativeUsd === null ? null : Number(formatted) * nativeUsd,
    },
    tokens,
    lastActivity,
  };
}

/** Pure: Alchemy transfers → canonical transactions, newest first. */
export function transformEthereumTransfers(
  address: string,
  transfers: RawTransfer[],
): Transaction[] {
  const lower = address.toLowerCase();
  return [...transfers]
    .sort((a, b) => (b.blockTimestamp ?? "").localeCompare(a.blockTimestamp ?? ""))
    .slice(0, TX_PAGE_SIZE)
    .map((t) => ({
      hash: t.hash,
      chain: "ethereum" as const,
      type: t.to?.toLowerCase() === lower ? "receive" : "send",
      value: t.value != null ? String(t.value) : "0",
      usdValue: null,
      fee: "0",
      timestamp: t.blockTimestamp ?? new Date().toISOString(),
      status: "confirmed" as const,
      counterparty: (t.to?.toLowerCase() === lower ? t.from : t.to) ?? null,
    }));
}

const MAX_TOKENS = 20;

export async function fetchEthereumOverview(address: string): Promise<WalletOverview> {
  const a = alchemy();
  const [weiBalance, balances, nativePrices] = await Promise.all([
    a.core.getBalance(address),
    a.core.getTokenBalances(address),
    getPrices([coingeckoId]),
  ]);

  const nonZero = balances.tokenBalances
    .filter((b) => b.tokenBalance && BigInt(b.tokenBalance) > 0n)
    .slice(0, MAX_TOKENS);

  const items: RawTokenBalance[] = await Promise.all(
    nonZero.map(async (b) => {
      const metadata = await a.core.getTokenMetadata(b.contractAddress);
      return {
        contractAddress: b.contractAddress,
        rawBalanceHex: b.tokenBalance as string,
        metadata,
      };
    }),
  );

  const priceIds = Object.values(ETH_TOKEN_PRICE_IDS);
  const tokenPrices = await getPrices(priceIds);
  const tokens = transformEthereumTokens(items, tokenPrices);

  return transformEthereumOverview(
    address,
    weiBalance.toHexString(),
    tokens,
    nativePrices[coingeckoId]?.usd ?? null,
    null,
  );
}

export async function fetchEthereumTransactions(address: string): Promise<Transaction[]> {
  const a = alchemy();
  const common = {
    category: [AssetTransfersCategory.EXTERNAL, AssetTransfersCategory.ERC20],
    order: SortingOrder.DESCENDING,
    maxCount: TX_PAGE_SIZE,
    withMetadata: true,
  };
  const [sent, received] = await Promise.all([
    a.core.getAssetTransfers({ ...common, fromAddress: address }),
    a.core.getAssetTransfers({ ...common, toAddress: address }),
  ]);
  const transfers: RawTransfer[] = [...sent.transfers, ...received.transfers].map((t) => ({
    hash: t.hash,
    from: t.from,
    to: t.to,
    value: t.value,
    asset: t.asset,
    blockTimestamp: (t as { metadata?: { blockTimestamp?: string } }).metadata?.blockTimestamp,
  }));
  return transformEthereumTransfers(address, transfers);
}
