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
    return <div className="h-96 bg-surface rounded-xl border border-white/6 animate-pulse" />;
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-100">Earnings</h2>
        <p className="text-slate-500 mt-1 text-sm">Revenue breakdown and financial overview</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-surface rounded-xl p-6 border border-white/6">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-emerald-500/10 border border-emerald-500/20 p-2 rounded-xl">
              <DollarSign className="text-emerald-400" size={18} />
            </div>
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Total Revenue</span>
          </div>
          <p className="text-3xl font-bold text-slate-100">${stats.totalEarnings.toLocaleString()}</p>
        </div>
        <div className="bg-surface rounded-xl p-6 border border-white/6">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-violet-500/10 border border-violet-500/20 p-2 rounded-xl">
              <TrendingUp className="text-violet-400" size={18} />
            </div>
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">This Month</span>
          </div>
          <p className="text-3xl font-bold text-slate-100">${stats.monthlyEarnings.toLocaleString()}</p>
        </div>
        <div className="bg-surface rounded-xl p-6 border border-white/6">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-amber-500/10 border border-amber-500/20 p-2 rounded-xl">
              <Calendar className="text-amber-400" size={18} />
            </div>
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Avg / Month</span>
          </div>
          <p className="text-3xl font-bold text-slate-100">
            ${charts.revenueByMonth.length > 0
              ? Math.round(charts.revenueByMonth.reduce((s, m) => s + m.total, 0) / charts.revenueByMonth.length).toLocaleString()
              : 0}
          </p>
        </div>
      </div>

      {/* Monthly Breakdown */}
      <div className="bg-surface rounded-xl border border-white/6">
        <div className="p-6 border-b border-white/6">
          <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">Monthly Breakdown</h3>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/6">
                <th className="text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">Month</th>
                <th className="text-right text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">Revenue</th>
                <th className="text-right text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">Change</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/4">
              {charts.revenueByMonth.map((month, index) => {
                const prev = index > 0 ? charts.revenueByMonth[index - 1].total : month.total;
                const change = prev > 0 ? ((month.total - prev) / prev) * 100 : 0;
                const [year, m] = month.month.split("-");
                const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
                return (
                  <tr key={month.month} className="hover:bg-white/2 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-slate-300">{months[parseInt(m) - 1]} {year}</td>
                    <td className="px-6 py-4 text-sm text-right font-semibold text-slate-100 tabular-nums">${month.total.toLocaleString()}</td>
                    <td className={`px-6 py-4 text-sm text-right font-semibold tabular-nums ${change >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                      {change >= 0 ? "+" : ""}{change.toFixed(1)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-white/4">
          {charts.revenueByMonth.map((month, index) => {
            const prev = index > 0 ? charts.revenueByMonth[index - 1].total : month.total;
            const change = prev > 0 ? ((month.total - prev) / prev) * 100 : 0;
            const [year, m] = month.month.split("-");
            const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
            return (
              <div key={month.month} className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-300">{months[parseInt(m) - 1]} {year}</p>
                  <p className={`text-xs font-semibold mt-0.5 ${change >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                    {change >= 0 ? "↑" : "↓"} {Math.abs(change).toFixed(1)}%
                  </p>
                </div>
                <p className="text-sm font-bold text-slate-100 tabular-nums">${month.total.toLocaleString()}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Revenue by Creator */}
      <div className="bg-surface rounded-xl border border-white/6 mt-6">
        <div className="p-6 border-b border-white/6">
          <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">Revenue by Creator</h3>
        </div>
        <div className="divide-y divide-white/4">
          {charts.topCreators.map((creator, i) => {
            const maxTotal = charts.topCreators[0]?.total || 1;
            const percentage = (creator.total / maxTotal) * 100;
            return (
              <div key={creator.name} className="p-4 px-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-600 w-5">{i + 1}</span>
                    <div>
                      <p className="text-sm font-medium text-slate-200">{creator.name}</p>
                      <p className="text-xs text-slate-500">{creator.platform}</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-slate-200 tabular-nums">${creator.total.toLocaleString()}</span>
                </div>
                <div className="ml-8 bg-white/5 rounded-full h-1.5">
                  <div className="bg-violet-500 rounded-full h-1.5 transition-all" style={{ width: `${percentage}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
