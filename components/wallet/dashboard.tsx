import { CopyLink } from "@/components/wallet/copy-link";
import { Insights } from "@/components/wallet/insights";
import { OverviewCard } from "@/components/wallet/overview-card";
import { PortfolioChart } from "@/components/wallet/portfolio-chart";
import { TokenTable } from "@/components/wallet/token-table";
import { TransactionList } from "@/components/wallet/transaction-list";
import type { WalletOverview } from "@/types";

function SectionLabel({ index, children }: { index: string; children: React.ReactNode }) {
  return (
    <h2 className="flex items-baseline gap-2 border-b border-line pb-2 font-mono text-[10px] uppercase tracking-[0.3em] text-dim">
      <span aria-hidden className="text-brass">
        {index}
      </span>
      {children}
    </h2>
  );
}

/**
 * Full wallet dashboard. Server component embedding client islands (chart, transactions).
 * `overview` is fetched server-side on the share page for crawlable, spinner-free loads.
 */
export function Dashboard({ overview }: { overview: WalletOverview }) {
  const { address, chain } = overview;
  return (
    <div className="flex flex-col gap-7">
      <div className="rise flex items-center justify-between">
        <h1 className="font-mono text-[10px] uppercase tracking-[0.3em] text-dim">
          Wallet dashboard
        </h1>
        <CopyLink />
      </div>
      <div className="rise rise-1 grid gap-6 lg:grid-cols-2">
        <OverviewCard overview={overview} />
        <PortfolioChart address={address} chain={chain} />
      </div>
      <div className="rise rise-2">
        <Insights overview={overview} />
      </div>
      <section className="rise rise-3 flex flex-col gap-3">
        <SectionLabel index="Obs. 02">Token holdings</SectionLabel>
        <TokenTable tokens={overview.tokens} />
      </section>
      <section className="rise rise-4 flex flex-col gap-3">
        <SectionLabel index="Obs. 03">Recent transactions</SectionLabel>
        <TransactionList address={address} chain={chain} />
      </section>
    </div>
  );
}
