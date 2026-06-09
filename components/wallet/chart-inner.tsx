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
            <stop offset="0%" stopColor="#00e5cc" stopOpacity={0.4} />
            <stop offset="100%" stopColor="#00e5cc" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="t"
          hide
        />
        <YAxis domain={["auto", "auto"]} hide />
        <Tooltip
          contentStyle={{
            background: "#14161a",
            border: "1px solid #2a2e35",
            borderRadius: 4,
            fontSize: 12,
          }}
          labelFormatter={(t) => new Date(t as string).toLocaleString()}
          formatter={(v) => [formatCurrency(Number(v)), "Price"]}
        />
        <Area
          type="monotone"
          dataKey="usd"
          stroke="#00e5cc"
          strokeWidth={2}
          fill="url(#fill)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
