"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { parseAddress } from "@/lib/validators/address";
import { useWalletStore } from "@/store/wallets";

/** Address input with client-side validation; navigates to the dashboard on submit. */
export function WalletSearch({ autoFocus = false }: { autoFocus?: boolean }) {
  const router = useRouter();
  const addWallet = useWalletStore((s) => s.addWallet);
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = parseAddress(value);
    if (!parsed) {
      setError("Enter a valid Ethereum, Solana, or Bitcoin address");
      return;
    }
    setError(null);
    addWallet({ address: parsed.address, chain: parsed.chain });
    router.push(`/${parsed.address}`);
  }

  return (
    <form onSubmit={onSubmit} className="w-full">
      <div className="flex items-center gap-2 rounded-sm border border-border bg-surface px-3 focus-within:border-accent">
        <Search size={18} className="text-muted" />
        <input
          autoFocus={autoFocus}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (error) setError(null);
          }}
          spellCheck={false}
          placeholder="Paste an ETH, SOL, or BTC address…"
          aria-label="Wallet address"
          className="flex-1 bg-transparent py-3 font-mono text-sm outline-none placeholder:text-muted"
        />
        <button
          type="submit"
          className="rounded-sm bg-accent px-4 py-1.5 text-sm font-medium text-accent-foreground hover:opacity-90"
        >
          View
        </button>
      </div>
      {error && (
        <p role="alert" className="mt-2 text-sm text-negative">
          {error}
        </p>
      )}
    </form>
  );
}
