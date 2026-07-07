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
      <div className="mb-2.5 flex items-center justify-between border-b border-line px-1 pb-2">
        <h2 className="font-mono text-[10px] uppercase tracking-[0.3em] text-dim">
          Registry
        </h2>
        <span className="font-mono text-[10px] text-brass">
          {wallets.length}/{MAX_WALLETS}
        </span>
      </div>
      <nav className="flex flex-col gap-1">
        {wallets.map((w, i) => {
          const active = pathname === `/${w.address}`;
          return (
            <div
              key={w.address}
              className={cn(
                "group flex items-center justify-between rounded-sm border px-3 py-2 transition-colors",
                active
                  ? "border-brass/50 bg-surface"
                  : "border-line hover:border-linestrong hover:bg-surface",
              )}
            >
              <Link href={`/${w.address}`} className="flex min-w-0 flex-1 items-center gap-2">
                <span
                  aria-hidden
                  className={cn(
                    "font-mono text-[10px]",
                    active ? "text-brass" : "text-dim",
                  )}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <ChainBadge chain={w.chain} />
                <span className="truncate font-mono text-xs">
                  {w.label ?? truncateAddress(w.address)}
                </span>
              </Link>
              <button
                aria-label="Remove wallet"
                onClick={() => removeWallet(w.address)}
                className="ml-2 text-dim opacity-0 transition hover:text-down group-hover:opacity-100"
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
