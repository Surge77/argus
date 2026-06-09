import { CopyLink } from "@/components/wallet/copy-link";
import { OverviewCard } from "@/components/wallet/overview-card";
import { PortfolioChart } from "@/components/wallet/portfolio-chart";
import { TokenTable } from "@/components/wallet/token-table";
import { TransactionList } from "@/components/wallet/transaction-list";
import type { WalletOverview } from "@/types";

/**
 * Full wallet dashboard. Server component embedding client islands (chart, transactions).
 * `overview` is fetched server-side on the share page for crawlable, spinner-free loads.
 */
export function Dashboard({ overview }: { overview: WalletOverview }) {
  const { address, chain } = overview;
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-mono text-sm text-muted">Wallet dashboard</h1>
        <CopyLink />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <OverviewCard overview={overview} />
        <PortfolioChart address={address} chain={chain} />
      </div>
      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium text-muted">Token holdings</h2>
        <TokenTable tokens={overview.tokens} />
      </section>
      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium text-muted">Recent transactions</h2>
        <TransactionList address={address} chain={chain} />
      </section>
    </div>
  );
}
