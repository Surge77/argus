"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Dashboard } from "@/components/wallet/dashboard";
import { useOverview } from "@/hooks/use-wallet";

/** Client fallback used when server-side prefetch fails (e.g. transient provider outage). */
export function DashboardLive({ address }: { address: string }) {
  const { data, isLoading, isError, refetch } = useOverview(address);

  if (isLoading) {
    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }
  if (isError || !data) {
    return (
      <Card className="flex flex-col items-start gap-3">
        <p className="font-mono text-sm text-down">
          Could not load this wallet. A data provider may be temporarily unavailable.
        </p>
        <button
          onClick={() => refetch()}
          className="rounded-sm bg-brass px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-[0.18em] text-brassink transition-colors hover:bg-brassbright"
        >
          Retry
        </button>
      </Card>
    );
  }
  return <Dashboard overview={data} />;
}
