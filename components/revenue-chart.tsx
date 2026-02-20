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
      <div className="bg-white rounded-xl border border-gray-200 p-6 h-80 animate-pulse" />
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Gráfico de barras — Receita mensal */}
      <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Monthly Revenue</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.revenueByMonth}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12 }}
              tickFormatter={(v) => {
                const [year, month] = v.split("-");
                const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                return `${months[parseInt(month) - 1]} ${year.slice(2)}`;
              }}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              formatter={(value) => {
                const n =
                  typeof value === "number"
                    ? value
                    : typeof value === "string"
                      ? Number(value)
                      : 0;

                return [`$${n.toLocaleString()}`, "Revenue"] as const;
              }}
              labelFormatter={(label) => {
                const [year, month] = String(label).split("-");
                const months = [
                  "January", "February", "March", "April", "May", "June",
                  "July", "August", "September", "October", "November", "December"
                ];
                return `${months[parseInt(month, 10) - 1]} ${year}`;
              }}
            />
            <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top Criadores */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Top Creators</h3>
        <div className="space-y-4">
          {data.topCreators.map((creator, index) => (
            <div key={creator.name} className="flex items-center gap-3">
              <span className="text-sm font-bold text-gray-400 w-5">
                {index + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {creator.name}
                </p>
                <p className="text-xs text-gray-500">{creator.platform}</p>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                ${creator.total.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}