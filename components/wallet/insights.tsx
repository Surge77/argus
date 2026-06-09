"use client";

import dynamic from "next/dynamic";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ALLOCATION_COLORS } from "@/components/wallet/allocation-donut";
import { useTransactions } from "@/hooks/use-wallet";
import {
  allocationByValue,
  summarizePortfolio,
  summarizeTransactions,
} from "@/lib/analytics";
import { NATIVE_ASSET } from "@/lib/constants";
import { cn, formatCurrency } from "@/lib/utils";
import type { WalletOverview } from "@/types";

const AllocationDonut = dynamic(
  () => import("@/components/wallet/allocation-donut"),
  { ssr: false, loading: () => <Skeleton className="h-[200px] w-full" /> },
);

const SAMPLE = 25;

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Card className="flex flex-col gap-1 p-4">
      <span className="text-xs text-muted">{label}</span>
      <span className="font-mono text-lg font-semibold tabular-nums">{value}</span>
    </Card>
  );
}

/** Derived metrics computed from the overview + recent transactions (no extra fetches). */
export function Insights({ overview }: { overview: WalletOverview }) {
  const { data: txData } = useTransactions(overview.address);
  const txs = txData?.transactions ?? [];

  const p = summarizePortfolio(overview);
  const t = summarizeTransactions(txs);
  const alloc = allocationByValue(overview);
  const sym = NATIVE_ASSET[overview.chain].symbol;
  const net = `${t.netFlow >= 0 ? "+" : ""}${t.netFlow.toFixed(4)} ${sym}`;

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-sm font-medium text-muted">Insights</h2>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        <Stat label="Total value" value={formatCurrency(p.totalUsd)} />
        <Stat label="Tokens (priced)" value={`${p.pricedCount}/${p.tokenCount}`} />
        <Stat label={`Net flow · ${SAMPLE}`} value={net} />
        <Stat label={`Fees · ${SAMPLE}`} value={`${t.totalFees.toFixed(4)} ${sym}`} />
        <Stat label={`In / Out · ${SAMPLE}`} value={`${t.inCount} / ${t.outCount}`} />
        <Stat
          label="Last active"
          value={t.lastActive ? new Date(t.lastActive).toLocaleDateString() : "—"}
        />
      </div>

      {alloc.length > 0 && (
        <Card className="grid gap-4 md:grid-cols-2">
          <div>
            <h3 className="mb-2 text-sm font-medium text-muted">Allocation by value</h3>
            <AllocationDonut data={alloc} />
          </div>
          <ul className="flex flex-col justify-center gap-2">
            {alloc.map((slice, i) => (
              <li key={slice.label} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <span
                    className="inline-block h-3 w-3 rounded-sm"
                    style={{ background: ALLOCATION_COLORS[i % ALLOCATION_COLORS.length] }}
                  />
                  {slice.label}
                </span>
                <span className="font-mono tabular-nums text-muted">
                  {formatCurrency(slice.value)}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {p.stablecoinUsd > 0 && (
        <p className={cn("text-xs text-muted")}>
          Stablecoins: {formatCurrency(p.stablecoinUsd)} (
          {((p.stablecoinUsd / p.totalUsd) * 100).toFixed(1)}% of portfolio)
        </p>
      )}
    </section>
  );
}
