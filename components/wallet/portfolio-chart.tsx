"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useChart } from "@/hooks/use-wallet";
import { NATIVE_ASSET } from "@/lib/constants";
import { cn, formatCurrency, formatPercent } from "@/lib/utils";
import type { ChartPeriod } from "@/types";

const ChartInner = dynamic(() => import("@/components/wallet/chart-inner"), {
  ssr: false,
  loading: () => <Skeleton className="h-[240px] w-full" />,
});

const PERIODS: ChartPeriod[] = ["7d", "30d", "90d", "1y"];

export function PortfolioChart({
  address,
  chain,
}: {
  address: string;
  chain: "ethereum" | "solana" | "bitcoin";
}) {
  const [period, setPeriod] = useState<ChartPeriod>("30d");
  const { data, isLoading, isError } = useChart(address, period);

  const points = data?.points ?? [];
  const current = points.at(-1)?.usd ?? null;
  const first = points[0]?.usd ?? null;
  const changePct =
    current !== null && first ? ((current - first) / first) * 100 : null;

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-sm font-medium text-muted">
            {NATIVE_ASSET[chain].symbol} price
          </h2>
          {current !== null && (
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-mono text-xl font-semibold tabular-nums">
                {formatCurrency(current)}
              </span>
              {changePct !== null && (
                <span
                  className={cn(
                    "font-mono text-xs tabular-nums",
                    changePct >= 0 ? "text-positive" : "text-negative",
                  )}
                >
                  {formatPercent(changePct)}
                </span>
              )}
            </div>
          )}
        </div>
        <div className="flex gap-1">
          {PERIODS.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={cn(
                "rounded-sm px-2 py-1 font-mono text-xs",
                p === period
                  ? "bg-accent text-accent-foreground"
                  : "text-muted hover:bg-surface-elevated",
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
      {isLoading ? (
        <Skeleton className="h-[240px] w-full" />
      ) : isError || !data ? (
        <div className="flex h-[240px] items-center justify-center text-sm text-negative">
          Could not load chart.
        </div>
      ) : (
        <ChartInner points={data.points} />
      )}
    </Card>
  );
}
