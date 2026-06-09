import { formatUnits } from "viem";

import { NATIVE_ASSET, TX_PAGE_SIZE } from "@/lib/constants";
import { env } from "@/lib/env";
import { getJson, rpcCall } from "@/lib/http";
import { getPrices } from "@/lib/prices";
import type { TokenHolding, Transaction, WalletOverview } from "@/types";

const { decimals, coingeckoId } = NATIVE_ASSET.solana;

const rpcUrl = () => `https://mainnet.helius-rpc.com/?api-key=${env.heliusApiKey}`;
const txUrl = (address: string) =>
  `https://api.helius.xyz/v0/addresses/${address}/transactions?api-key=${env.heliusApiKey}&limit=${TX_PAGE_SIZE}`;

interface DasAsset {
  interface?: string;
  id: string;
  content?: { metadata?: { symbol?: string; name?: string }; links?: { image?: string } };
  token_info?: {
    balance?: number;
    decimals?: number;
    symbol?: string;
    price_info?: { total_price?: number; price_per_token?: number };
  };
}

interface HeliusTx {
  signature: string;
  timestamp: number;
  fee: number;
  type?: string;
  nativeTransfers?: { fromUserAccount: string; toUserAccount: string; amount: number }[];
  transactionError?: unknown;
}

/** Pure: DAS fungible assets → canonical token holdings. */
export function transformSolanaTokens(assets: DasAsset[]): TokenHolding[] {
  return assets
    .filter((a) => a.interface === "FungibleToken" || a.token_info?.balance)
    .map((a) => {
      const info = a.token_info ?? {};
      const dec = info.decimals ?? 0;
      const balance = info.balance != null ? formatUnits(BigInt(info.balance), dec) : "0";
      return {
        symbol: info.symbol ?? a.content?.metadata?.symbol ?? "?",
        name: a.content?.metadata?.name ?? info.symbol ?? "Unknown",
        logoUrl: a.content?.links?.image ?? null,
        balance,
        usdValue: info.price_info?.total_price ?? null,
        priceChange24h: null,
        contractAddress: a.id,
      };
    })
    .filter((t) => Number(t.balance) > 0);
}

/** Pure: Helius enhanced txs → canonical transactions, classified relative to `address`. */
export function transformSolanaTransactions(
  address: string,
  txs: HeliusTx[],
): Transaction[] {
  return txs.slice(0, TX_PAGE_SIZE).map((tx) => {
    const transfers = tx.nativeTransfers ?? [];
    const received = transfers
      .filter((t) => t.toUserAccount === address)
      .reduce((s, t) => s + t.amount, 0);
    const sent = transfers
      .filter((t) => t.fromUserAccount === address)
      .reduce((s, t) => s + t.amount, 0);
    const net = received - sent;
    return {
      hash: tx.signature,
      chain: "solana",
      type: net >= 0 ? "receive" : "send",
      value: formatUnits(BigInt(Math.abs(net)), decimals),
      usdValue: null,
      fee: formatUnits(BigInt(tx.fee), decimals),
      timestamp: new Date(tx.timestamp * 1000).toISOString(),
      status: tx.transactionError ? "failed" : "confirmed",
      counterparty: null,
    };
  });
}

export async function fetchSolanaOverview(address: string): Promise<WalletOverview> {
  const [balanceRes, prices, tokens] = await Promise.all([
    rpcCall<{ value: number }>(rpcUrl(), "getBalance", [address]),
    getPrices([coingeckoId]),
    fetchSolanaTokens(address),
  ]);
  const lamports = balanceRes.value;
  const formatted = formatUnits(BigInt(lamports), decimals);
  const usd = prices[coingeckoId]?.usd ?? null;
  return {
    address,
    chain: "solana",
    nativeBalance: {
      raw: String(lamports),
      formatted,
      usdValue: usd === null ? null : Number(formatted) * usd,
    },
    tokens,
    lastActivity: null,
  };
}

async function fetchSolanaTokens(address: string): Promise<TokenHolding[]> {
  try {
    const res = await rpcCall<{ items: DasAsset[] }>(rpcUrl(), "getAssetsByOwner", {
      ownerAddress: address,
      page: 1,
      limit: 50,
      displayOptions: { showFungible: true },
    });
    return transformSolanaTokens(res.items ?? []);
  } catch {
    return [];
  }
}

export async function fetchSolanaTransactions(address: string): Promise<Transaction[]> {
  const txs = await getJson<HeliusTx[]>(txUrl(address));
  return transformSolanaTransactions(address, txs);
}
