"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchApi } from "@/lib/client";
import type { ChartPeriod, ChartPoint, Transaction, WalletOverview } from "@/types";

export function useOverview(address: string) {
  return useQuery({
    queryKey: ["overview", address],
    queryFn: () => fetchApi<WalletOverview>(`/api/wallet/${address}/overview`),
    refetchInterval: 60_000,
  });
}

export function useTransactions(address: string) {
  return useQuery({
    queryKey: ["transactions", address],
    queryFn: () =>
      fetchApi<{ transactions: Transaction[]; nextCursor: string | null }>(
        `/api/wallet/${address}/transactions`,
      ),
  });
}

export function useChart(address: string, period: ChartPeriod) {
  return useQuery({
    queryKey: ["chart", address, period],
    queryFn: () =>
      fetchApi<{ period: ChartPeriod; points: ChartPoint[] }>(
        `/api/wallet/${address}/chart?period=${period}`,
      ),
  });
}
