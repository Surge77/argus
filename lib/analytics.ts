import { NATIVE_ASSET, STABLECOIN_SYMBOLS } from "@/lib/constants";
import type { Transaction, WalletOverview } from "@/types";

export interface PortfolioSummary {
  totalUsd: number;
  tokenCount: number;
  pricedCount: number;
  stablecoinUsd: number;
}

/** Derive headline portfolio metrics from an overview (native + priced tokens). */
export function summarizePortfolio(overview: WalletOverview): PortfolioSummary {
  const nativeUsd = overview.nativeBalance.usdValue ?? 0;
  let tokensUsd = 0;
  let priced = 0;
  let stable = 0;
  for (const t of overview.tokens) {
    if (t.usdValue != null) {
      tokensUsd += t.usdValue;
      priced += 1;
      if (STABLECOIN_SYMBOLS.has(t.symbol.toUpperCase())) stable += t.usdValue;
    }
  }
  return {
    totalUsd: nativeUsd + tokensUsd,
    tokenCount: overview.tokens.length,
    pricedCount: priced,
    stablecoinUsd: stable,
  };
}

export interface TxStats {
  inCount: number;
  outCount: number;
  /** Net native flow across the sample (received − sent). */
  netFlow: number;
  /** Total native fees across the sample. */
  totalFees: number;
  lastActive: string | null;
}

/** Derive flow/fee/direction metrics from a transaction sample (last N). */
export function summarizeTransactions(txs: Transaction[]): TxStats {
  let inCount = 0;
  let outCount = 0;
  let netFlow = 0;
  let totalFees = 0;
  let lastActive: string | null = null;
  for (const t of txs) {
    const value = Number(t.value) || 0;
    totalFees += Number(t.fee) || 0;
    if (t.type === "receive") {
      inCount += 1;
      netFlow += value;
    } else if (t.type === "send") {
      outCount += 1;
      netFlow -= value;
    }
    if (!lastActive || t.timestamp > lastActive) lastActive = t.timestamp;
  }
  return { inCount, outCount, netFlow, totalFees, lastActive };
}

export interface AllocationSlice {
  label: string;
  value: number;
}

/** Value-weighted allocation (native + priced tokens), with a long tail grouped as "Other". */
export function allocationByValue(
  overview: WalletOverview,
  maxSlices = 5,
): AllocationSlice[] {
  const slices: AllocationSlice[] = [];
  const nativeUsd = overview.nativeBalance.usdValue ?? 0;
  if (nativeUsd > 0) {
    slices.push({ label: NATIVE_ASSET[overview.chain].symbol, value: nativeUsd });
  }
  for (const t of overview.tokens) {
    if (t.usdValue && t.usdValue > 0) slices.push({ label: t.symbol, value: t.usdValue });
  }
  slices.sort((a, b) => b.value - a.value);
  if (slices.length <= maxSlices) return slices;
  const top = slices.slice(0, maxSlices);
  const other = slices.slice(maxSlices).reduce((sum, s) => sum + s.value, 0);
  if (other > 0) top.push({ label: "Other", value: other });
  return top;
}
