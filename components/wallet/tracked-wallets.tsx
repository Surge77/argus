"use client";

import Link from "next/link";
import { useState } from "react";

import { Card } from "@/components/ui/card";
import { ChainBadge } from "@/components/wallet/chain-badge";
import { cn, truncateAddress } from "@/lib/utils";
import { useWalletStore } from "@/store/wallets";
import type { Chain } from "@/types";

type Filter = "all" | Chain;
const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "ethereum", label: "ETH" },
  { key: "solana", label: "SOL" },
  { key: "bitcoin", label: "BTC" },
];

/** Landing-page list of tracked wallets with a chain filter (F-09). */
export function TrackedWallets() {
  const wallets = useWalletStore((s) => s.wallets);
  const [filter, setFilter] = useState<Filter>("all");

  if (wallets.length === 0) return null;
  const visible = filter === "all" ? wallets : wallets.filter((w) => w.chain === filter);

  return (
    <div className="mt-12 w-full">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xs font-medium uppercase tracking-wider text-muted">
          Your wallets
        </h2>
        <div className="flex gap-1">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                "rounded-sm px-2 py-1 font-mono text-xs",
                f.key === filter
                  ? "bg-accent text-accent-foreground"
                  : "text-muted hover:bg-surface",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {visible.map((w) => (
          <Link key={w.address} href={`/${w.address}`}>
            <Card className="flex items-center gap-3 py-3 hover:border-accent">
              <ChainBadge chain={w.chain} />
              <span className="truncate font-mono text-sm">
                {w.label ?? truncateAddress(w.address)}
              </span>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
