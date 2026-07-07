"use client";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { formatCurrency } from "@/lib/utils";
import type { ChartPoint } from "@/types";

/** Recharts area chart. Code-split via next/dynamic in portfolio-chart.tsx. */
export default function ChartInner({ points }: { points: ChartPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={points} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
        <defs>
          <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c9a45c" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#c9a45c" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="t" hide />
        <YAxis domain={["auto", "auto"]} hide />
        <Tooltip
          contentStyle={{
            background: "var(--surface)",
            border: "1px solid var(--line-strong)",
            borderRadius: 4,
            fontSize: 12,
            fontFamily: "var(--font-space-mono)",
            color: "var(--starlight)",
          }}
          labelFormatter={(t) => new Date(t as string).toLocaleString()}
          formatter={(v) => [formatCurrency(Number(v)), "Price"]}
        />
        <Area
          type="monotone"
          dataKey="usd"
          stroke="#c9a45c"
          strokeWidth={1.75}
          fill="url(#fill)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
