"use client";

import { ArrowDownLeft, ArrowUpRight } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTransactions } from "@/hooks/use-wallet";
import { NATIVE_ASSET } from "@/lib/constants";
import { cn, truncateAddress } from "@/lib/utils";
import type { Chain } from "@/types";

export function TransactionList({ address, chain }: { address: string; chain: Chain }) {
  const { data, isLoading, isError } = useTransactions(address);
  const { symbol } = NATIVE_ASSET[chain];

  if (isLoading) {
    return (
      <Card className="flex flex-col gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </Card>
    );
  }
  if (isError || !data) {
    return <Card className="text-sm text-negative">Could not load transactions.</Card>;
  }
  if (data.transactions.length === 0) {
    return <Card className="text-sm text-muted">No recent transactions.</Card>;
  }

  return (
    <Card className="flex flex-col divide-y divide-border/50 p-0">
      {data.transactions.map((tx) => {
        const incoming = tx.type === "receive";
        return (
          <a
            key={tx.hash}
            href={`#${tx.hash}`}
            className="flex items-center justify-between px-4 py-3 hover:bg-surface-elevated"
          >
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-sm",
                  incoming ? "bg-positive/10 text-positive" : "bg-negative/10 text-negative",
                )}
              >
                {incoming ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
              </span>
              <div>
                <div className="text-sm capitalize">{tx.type.replace("_", " ")}</div>
                <div className="font-mono text-xs text-muted">{truncateAddress(tx.hash)}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono text-sm tabular-nums">
                {incoming ? "+" : "-"}
                {Number(tx.value).toLocaleString(undefined, { maximumFractionDigits: 6 })} {symbol}
              </div>
              <div className="text-xs text-muted">
                {new Date(tx.timestamp).toLocaleDateString()}
              </div>
            </div>
          </a>
        );
      })}
    </Card>
  );
}
