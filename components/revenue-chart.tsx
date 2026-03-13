"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ChartData {
  revenueByMonth: { month: string; total: number }[];
  topCreators: { name: string; platform: string; total: number }[];
}

export function RevenueChart() {
  const [data, setData] = useState<ChartData | null>(null);

  useEffect(() => {
    fetch("/api/charts")
      .then((res) => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  if (!data) {
    return (
      <div className="bg-surface rounded-xl border border-white/6 p-6 h-80 animate-pulse" />
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Monthly Revenue Bar Chart */}
      <div className="lg:col-span-2 bg-surface rounded-xl border border-white/6 p-6">
        <h3 className="text-sm font-semibold text-slate-200 mb-5 uppercase tracking-wider">Monthly Revenue</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.revenueByMonth}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: "#64748b" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => {
                const [year, month] = v.split("-");
                const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                return `${months[parseInt(month) - 1]} ${year.slice(2)}`;
              }}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#64748b" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#18181f",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "8px",
                color: "#f1f5f9",
                fontSize: "12px",
              }}
              labelStyle={{ color: "#94a3b8", marginBottom: "4px" }}
              formatter={(value) => {
                const n = typeof value === "number" ? value : typeof value === "string" ? Number(value) : 0;
                return [`$${n.toLocaleString()}`, "Revenue"] as const;
              }}
              labelFormatter={(label) => {
                const [year, month] = String(label).split("-");
                const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                return `${months[parseInt(month, 10) - 1]} ${year}`;
              }}
              cursor={{ fill: "rgba(124,58,237,0.06)" }}
            />
            <Bar dataKey="total" fill="#7C3AED" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top Creators */}
      <div className="bg-surface rounded-xl border border-white/6 p-6">
        <h3 className="text-sm font-semibold text-slate-200 mb-5 uppercase tracking-wider">Top Creators</h3>
        <div className="space-y-4">
          {data.topCreators.map((creator, index) => (
            <div key={creator.name} className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-600 w-4">
                {index + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-200 truncate">
                  {creator.name}
                </p>
                <p className="text-xs text-slate-500">{creator.platform}</p>
              </div>
              <span className="text-sm font-semibold text-slate-300 tabular-nums">
                ${creator.total.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
