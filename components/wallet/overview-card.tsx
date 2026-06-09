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
    <Card className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <ChainBadge chain={overview.chain} />
        <span className="font-mono text-xs text-muted">
          {truncateAddress(overview.address)}
        </span>
      </div>
      <div>
        <div className="font-mono text-3xl font-semibold tabular-nums">
          {Number(formatted).toLocaleString(undefined, { maximumFractionDigits: 6 })}{" "}
          <span className="text-lg text-muted">{symbol}</span>
        </div>
        <div className="mt-1 text-sm text-muted">
          {usdValue === null ? "—" : formatCurrency(usdValue)}
        </div>
      </div>
      {overview.lastActivity && (
        <div className="text-xs text-muted">
          Last activity {new Date(overview.lastActivity).toLocaleDateString()}
        </div>
      )}
    </Card>
  );
}
