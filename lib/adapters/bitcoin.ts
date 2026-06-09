import { formatUnits } from "viem";

import { NATIVE_ASSET, TX_PAGE_SIZE } from "@/lib/constants";
import { env } from "@/lib/env";
import { getJson } from "@/lib/http";
import { getPrices } from "@/lib/prices";
import type { Transaction, WalletOverview } from "@/types";

const { decimals, coingeckoId } = NATIVE_ASSET.bitcoin;

interface BlockstreamAddress {
  chain_stats: { funded_txo_sum: number; spent_txo_sum: number };
}

interface BlockstreamTx {
  txid: string;
  fee: number;
  status: { confirmed: boolean; block_time?: number };
  vin: { prevout?: { scriptpubkey_address?: string; value: number } }[];
  vout: { scriptpubkey_address?: string; value: number }[];
}

/** Pure: Blockstream address stats → canonical overview (no tokens on Bitcoin MVP). */
export function transformBitcoinOverview(
  address: string,
  data: BlockstreamAddress,
  usdPrice: number | null,
  lastActivity: string | null,
): WalletOverview {
  const sats = data.chain_stats.funded_txo_sum - data.chain_stats.spent_txo_sum;
  const formatted = formatUnits(BigInt(sats), decimals);
  return {
    address,
    chain: "bitcoin",
    nativeBalance: {
      raw: String(sats),
      formatted,
      usdValue: usdPrice === null ? null : Number(formatted) * usdPrice,
    },
    tokens: [],
    lastActivity,
  };
}

/** Pure: Blockstream txs → canonical transactions, classified relative to `address`. */
export function transformBitcoinTransactions(
  address: string,
  txs: BlockstreamTx[],
): Transaction[] {
  return txs.slice(0, TX_PAGE_SIZE).map((tx) => {
    const sentValue = tx.vin
      .filter((v) => v.prevout?.scriptpubkey_address === address)
      .reduce((sum, v) => sum + (v.prevout?.value ?? 0), 0);
    const receivedValue = tx.vout
      .filter((v) => v.scriptpubkey_address === address)
      .reduce((sum, v) => sum + v.value, 0);
    const net = receivedValue - sentValue;
    return {
      hash: tx.txid,
      chain: "bitcoin",
      type: net >= 0 ? "receive" : "send",
      value: formatUnits(BigInt(Math.abs(net)), decimals),
      usdValue: null,
      fee: formatUnits(BigInt(tx.fee), decimals),
      timestamp: tx.status.block_time
        ? new Date(tx.status.block_time * 1000).toISOString()
        : new Date().toISOString(),
      status: tx.status.confirmed ? "confirmed" : "pending",
      counterparty: null,
    };
  });
}

export async function fetchBitcoinOverview(address: string): Promise<WalletOverview> {
  const base = env.bitcoinApiBaseUrl;
  const [data, txs, prices] = await Promise.all([
    getJson<BlockstreamAddress>(`${base}/address/${address}`),
    getJson<BlockstreamTx[]>(`${base}/address/${address}/txs`),
    getPrices([coingeckoId]),
  ]);
  const lastActivity =
    txs[0]?.status.block_time != null
      ? new Date(txs[0].status.block_time * 1000).toISOString()
      : null;
  return transformBitcoinOverview(
    address,
    data,
    prices[coingeckoId]?.usd ?? null,
    lastActivity,
  );
}

export async function fetchBitcoinTransactions(address: string): Promise<Transaction[]> {
  const txs = await getJson<BlockstreamTx[]>(
    `${env.bitcoinApiBaseUrl}/address/${address}/txs`,
  );
  return transformBitcoinTransactions(address, txs);
}
