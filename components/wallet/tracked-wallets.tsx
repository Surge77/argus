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
    <div className="rise rise-4 mt-14 w-full text-left">
      <div className="mb-3 flex items-center justify-between border-b border-line pb-2.5">
        <h2 className="font-mono text-[10px] uppercase tracking-[0.3em] text-dim">
          Your wallets
        </h2>
        <div className="flex gap-1">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                "rounded-sm px-2 py-1 font-mono text-xs transition-colors",
                f.key === filter
                  ? "bg-brass font-bold text-brassink"
                  : "text-dim hover:text-starlight",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {visible.map((w, i) => (
          <Link key={w.address} href={`/${w.address}`}>
            <Card className="flex items-center gap-3 py-3 transition-colors hover:border-linestrong">
              <span aria-hidden className="font-mono text-[10px] text-brass">
                {String(i + 1).padStart(2, "0")}
              </span>
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
