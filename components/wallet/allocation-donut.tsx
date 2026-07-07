"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { formatCurrency } from "@/lib/utils";
import type { AllocationSlice } from "@/lib/analytics";

/** Brass-led instrument palette; chain identity hues kept for recognition. */
export const ALLOCATION_COLORS = [
  "#c9a45c",
  "#9db1ff",
  "#f7931a",
  "#4be0a8",
  "#a06cd5",
  "#d96a55",
];

/** Value-weighted allocation donut. Code-split via next/dynamic in insights.tsx. */
export default function AllocationDonut({ data }: { data: AllocationSlice[] }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="label"
          innerRadius={55}
          outerRadius={85}
          paddingAngle={3}
          stroke="var(--night)"
          strokeWidth={2}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={ALLOCATION_COLORS[i % ALLOCATION_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: "var(--surface)",
            border: "1px solid var(--line-strong)",
            borderRadius: 4,
            fontSize: 12,
            fontFamily: "var(--font-space-mono)",
            color: "var(--starlight)",
          }}
          formatter={(v) => formatCurrency(Number(v))}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
