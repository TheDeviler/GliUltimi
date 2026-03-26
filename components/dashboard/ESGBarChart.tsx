"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import type { ChartDataPoint } from "@/lib/types";

interface ESGBarChartProps {
  data: ChartDataPoint[];
  color: string;
  label: string;
}

export default function ESGBarChart({ data, color, label }: ESGBarChartProps) {
  return (
    <div>
      <h4 className="mb-3 text-sm font-medium text-slate-600">{label}</h4>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -10 }}>
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
              fontSize: "12px",
            }}
          />
          <ReferenceLine
            y={data[data.length - 1]?.target}
            stroke="#94a3b8"
            strokeDasharray="4 4"
            label={{ value: "Target", position: "right", fontSize: 10, fill: "#94a3b8" }}
          />
          <Bar dataKey="actual" fill={color} radius={[4, 4, 0, 0]} barSize={24} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
