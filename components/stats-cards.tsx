"use client";

import { useEffect, useState } from "react";
import { Users, UserCheck, DollarSign, TrendingUp } from "lucide-react";

interface Stats {
  totalCreators: number;
  activeCreators: number;
  totalEarnings: number;
  monthlyEarnings: number;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function StatsCards() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then(setStats)
      .catch(console.error);
  }, []);

  if (!stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-surface rounded-xl p-6 border border-white/6 animate-pulse h-28" />
        ))}
      </div>
    );
  }

  const cards = [
    { label: "Total Creators", value: stats.totalCreators.toString(), icon: Users, color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20" },
    { label: "Active", value: stats.activeCreators.toString(), icon: UserCheck, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    { label: "Total Revenue", value: formatCurrency(stats.totalEarnings), icon: DollarSign, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
    { label: "This Month", value: formatCurrency(stats.monthlyEarnings), icon: TrendingUp, color: "text-fuchsia-400", bg: "bg-fuchsia-500/10", border: "border-fuchsia-500/20" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div key={card.label} className="bg-surface rounded-xl p-6 border border-white/6 hover:border-white/10 transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{card.label}</p>
              <p className="text-2xl font-bold mt-2 text-slate-100">{card.value}</p>
            </div>
            <div className={`${card.bg} border ${card.border} p-3 rounded-xl`}>
              <card.icon className={card.color} size={20} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
