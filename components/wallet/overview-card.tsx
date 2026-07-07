import { Card } from "@/components/ui/card";
import { ChainBadge } from "@/components/wallet/chain-badge";
import { NATIVE_ASSET } from "@/lib/constants";
import { formatCurrency, truncateAddress } from "@/lib/utils";
import type { WalletOverview } from "@/types";

/** Headline card: native balance, USD value, and the address with its chain. */
export function OverviewCard({ overview }: { overview: WalletOverview }) {
  const { symbol } = NATIVE_ASSET[overview.chain];
  const { formatted, usdValue } = overview.nativeBalance;
  return (
    <Card className="flex flex-col justify-between gap-4">
      <div className="flex items-center justify-between">
        <ChainBadge chain={overview.chain} />
        <span className="font-mono text-xs text-dim">
          {truncateAddress(overview.address)}
        </span>
      </div>
      <div>
        <div className="font-mono text-4xl font-bold tabular-nums tracking-tight">
          {Number(formatted).toLocaleString(undefined, { maximumFractionDigits: 6 })}{" "}
          <span className="font-display text-2xl font-normal italic text-brass">{symbol}</span>
        </div>
        <div className="mt-1.5 font-mono text-sm text-dim">
          {usdValue === null ? "—" : formatCurrency(usdValue)}
        </div>
      </div>
      {overview.lastActivity && (
        <div className="border-t border-line pt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-dim">
          Last observed {new Date(overview.lastActivity).toLocaleDateString()}
        </div>
      )}
    </Card>
  );
}
