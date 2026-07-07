import { cn } from "@/lib/utils";
import type { Chain } from "@/types";

const LABELS: Record<Chain, string> = {
  ethereum: "ETH",
  solana: "SOL",
  bitcoin: "BTC",
};

const COLORS: Record<Chain, string> = {
  ethereum: "text-[#9db1ff] border-[#9db1ff]/35",
  solana: "text-[#4be0a8] border-[#4be0a8]/35",
  bitcoin: "text-[#f7931a] border-[#f7931a]/35",
};

/** Compact chain identifier chip. */
export function ChainBadge({ chain }: { chain: Chain }) {
  return (
    <span
      className={cn(
        "inline-block rounded-sm border bg-night/40 px-2 py-0.5 font-mono text-[11px] font-bold tracking-[0.08em]",
        COLORS[chain],
      )}
    >
      {LABELS[chain]}
    </span>
  );
}
