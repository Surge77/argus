"use client";

import { X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { ChainBadge } from "@/components/wallet/chain-badge";
import { cn, truncateAddress } from "@/lib/utils";
import { MAX_WALLETS, useWalletStore } from "@/store/wallets";

/** Tracked-wallet switcher. Reads the persisted Zustand list. */
export function WalletSidebar() {
  const wallets = useWalletStore((s) => s.wallets);
  const removeWallet = useWalletStore((s) => s.removeWallet);
  const pathname = usePathname();

  if (wallets.length === 0) return null;

  return (
    <aside className="w-full shrink-0 md:w-64">
      <div className="mb-2 flex items-center justify-between px-1">
        <h2 className="text-xs font-medium uppercase tracking-wider text-muted">
          Tracked wallets
        </h2>
        <span className="font-mono text-xs text-muted">
          {wallets.length}/{MAX_WALLETS}
        </span>
      </div>
      <nav className="flex flex-col gap-1">
        {wallets.map((w) => {
          const active = pathname === `/${w.address}`;
          return (
            <div
              key={w.address}
              className={cn(
                "group flex items-center justify-between rounded-sm border px-3 py-2",
                active ? "border-accent bg-surface" : "border-border hover:bg-surface",
              )}
            >
              <Link href={`/${w.address}`} className="flex min-w-0 flex-1 items-center gap-2">
                <ChainBadge chain={w.chain} />
                <span className="truncate font-mono text-xs">
                  {w.label ?? truncateAddress(w.address)}
                </span>
              </Link>
              <button
                aria-label="Remove wallet"
                onClick={() => removeWallet(w.address)}
                className="ml-2 text-muted opacity-0 transition hover:text-negative group-hover:opacity-100"
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
