"use client";

import { useEffect, useState } from "react";
import { DollarSign, TrendingUp, Calendar } from "lucide-react";

interface Stats {
  totalEarnings: number;
  monthlyEarnings: number;
}

interface ChartData {
  revenueByMonth: { month: string; total: number }[];
  topCreators: { name: string; platform: string; total: number }[];
}

export default function EarningsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [charts, setCharts] = useState<ChartData | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/stats").then((r) => r.json()),
      fetch("/api/charts").then((r) => r.json()),
    ]).then(([s, c]) => {
      setStats(s);
      setCharts(c);
    });
  }, []);

  if (!stats || !charts) {
    return <div className="h-96 bg-white rounded-xl border animate-pulse" />;
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Earnings</h2>
        <p className="text-gray-500 mt-1">Revenue breakdown and financial overview</p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-green-50 p-2 rounded-lg"><DollarSign className="text-green-600" size={20} /></div>
            <span className="text-sm text-gray-500">Total Revenue</span>
          </div>
          <p className="text-3xl font-bold">${stats.totalEarnings.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-50 p-2 rounded-lg"><TrendingUp className="text-blue-600" size={20} /></div>
            <span className="text-sm text-gray-500">This Month</span>
          </div>
          <p className="text-3xl font-bold">${stats.monthlyEarnings.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-purple-50 p-2 rounded-lg"><Calendar className="text-purple-600" size={20} /></div>
            <span className="text-sm text-gray-500">Avg / Month</span>
          </div>
          <p className="text-3xl font-bold">
            ${charts.revenueByMonth.length > 0
              ? Math.round(charts.revenueByMonth.reduce((s, m) => s + m.total, 0) / charts.revenueByMonth.length).toLocaleString()
              : 0}
          </p>
        </div>
      </div>

      {/* Tabela mensal */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Monthly Breakdown</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left text-xs font-medium text-gray-500 uppercase px-6 py-3">Month</th>
              <th className="text-right text-xs font-medium text-gray-500 uppercase px-6 py-3">Revenue</th>
              <th className="text-right text-xs font-medium text-gray-500 uppercase px-6 py-3">Change</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {charts.revenueByMonth.map((month, index) => {
              const prev = index > 0 ? charts.revenueByMonth[index - 1].total : month.total;
              const change = prev > 0 ? ((month.total - prev) / prev) * 100 : 0;
              const [year, m] = month.month.split("-");
              const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

              return (
                <tr key={month.month} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {months[parseInt(m) - 1]} {year}
                  </td>
                  <td className="px-6 py-4 text-sm text-right font-semibold">
                    ${month.total.toLocaleString()}
                  </td>
                  <td className={`px-6 py-4 text-sm text-right font-medium ${
                    change >= 0 ? "text-green-600" : "text-red-600"
                  }`}>
                    {change >= 0 ? "+" : ""}{change.toFixed(1)}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Revenue por criador */}
      <div className="bg-white rounded-xl border border-gray-200 mt-6">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Revenue by Creator</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {charts.topCreators.map((creator, i) => {
            const maxTotal = charts.topCreators[0]?.total || 1;
            const percentage = (creator.total / maxTotal) * 100;

            return (
              <div key={creator.name} className="p-4 px-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-gray-400 w-5">{i + 1}</span>
                    <div>
                      <p className="text-sm font-medium">{creator.name}</p>
                      <p className="text-xs text-gray-400">{creator.platform}</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold">${creator.total.toLocaleString()}</span>
                </div>
                <div className="ml-8 bg-gray-100 rounded-full h-2">
                  <div className="bg-blue-500 rounded-full h-2" style={{ width: `${percentage}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}