import { cn } from "@/lib/utils";
import type { Chain } from "@/types";

const LABELS: Record<Chain, string> = {
  ethereum: "ETH",
  solana: "SOL",
  bitcoin: "BTC",
};

const COLORS: Record<Chain, string> = {
  ethereum: "text-[#8ea2ff] border-[#8ea2ff]/40",
  solana: "text-[#14f195] border-[#14f195]/40",
  bitcoin: "text-[#f7931a] border-[#f7931a]/40",
};

/** Compact chain identifier chip. */
export function ChainBadge({ chain }: { chain: Chain }) {
  return (
    <span
      className={cn(
        "inline-block rounded-sm border px-2 py-0.5 font-mono text-xs font-medium",
        COLORS[chain],
      )}
    >
      {LABELS[chain]}
    </span>
  );
}
