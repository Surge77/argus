"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useChart } from "@/hooks/use-wallet";
import { NATIVE_ASSET } from "@/lib/constants";
import { cn } from "@/lib/utils";
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

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-muted">
          {NATIVE_ASSET[chain].symbol} price
        </h2>
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
