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
          <div key={i} className="bg-white rounded-xl p-6 border border-gray-200 animate-pulse h-28" />
        ))}
      </div>
    );
  }

  const cards = [
    { label: "Total Creators", value: stats.totalCreators.toString(), icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Active", value: stats.activeCreators.toString(), icon: UserCheck, color: "text-green-600", bg: "bg-green-50" },
    { label: "Total Revenue", value: formatCurrency(stats.totalEarnings), icon: DollarSign, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "This Month", value: formatCurrency(stats.monthlyEarnings), icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-50" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div key={card.label} className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{card.label}</p>
              <p className="text-2xl font-bold mt-1">{card.value}</p>
            </div>
            <div className={`${card.bg} p-3 rounded-lg`}>
              <card.icon className={card.color} size={24} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}