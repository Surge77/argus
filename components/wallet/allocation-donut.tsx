"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { formatCurrency } from "@/lib/utils";
import type { AllocationSlice } from "@/lib/analytics";

export const ALLOCATION_COLORS = [
  "#00e5cc",
  "#8ea2ff",
  "#f7931a",
  "#14f195",
  "#c084fc",
  "#ff5c5c",
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
          paddingAngle={2}
          stroke="none"
        >
          {data.map((_, i) => (
            <Cell key={i} fill={ALLOCATION_COLORS[i % ALLOCATION_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: "#14161a",
            border: "1px solid #2a2e35",
            borderRadius: 4,
            fontSize: 12,
          }}
          formatter={(v) => formatCurrency(Number(v))}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
