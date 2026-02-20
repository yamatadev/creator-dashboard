"use client";

import { useEffect, useState } from "react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend,
} from "recharts";

interface Stats {
    totalCreators: number;
    byPlatform: { platform: string; count: number }[];
}

interface ChartData {
    revenueByMonth: { month: string; total: number }[];
    topCreators: { name: string; platform: string; total: number }[];
}

const COLORS = ["#3b82f6", "#ef4444", "#111827", "#6366f1", "#8b5cf6", "#06b6d4"];

export default function AnalyticsPage() {
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
        return (
            <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-80 bg-white rounded-xl border animate-pulse" />
                ))}
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
                <p className="text-gray-500 mt-1">Deep dive into your creator network performance</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Receita mensal */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold mb-4">Revenue Trend</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={charts.revenueByMonth}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="month" tick={{ fontSize: 12 }}
                                tickFormatter={(v) => {
                                    const [, month] = v.split("-");
                                    const m = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                                    return m[parseInt(month) - 1];
                                }} />
                            <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
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
                            />
                            <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Distribuição por plataforma */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold mb-4">Creators by Platform</h3>

                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={stats.byPlatform}
                                dataKey="count"
                                nameKey="platform"
                                cx="50%"
                                cy="45%"
                                innerRadius={70}
                                outerRadius={100}
                                paddingAngle={3}
                                cornerRadius={8}
                                labelLine={false}
                                label={false}
                            >
                                {stats.byPlatform.map((_, index) => (
                                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>

                            <Tooltip
                                formatter={(value, name) => {
                                    const n =
                                        typeof value === "number"
                                            ? value
                                            : typeof value === "string"
                                                ? Number(value)
                                                : 0;

                                    return [`${n}`, name] as const;
                                }}
                            />

                            <Legend
                                verticalAlign="bottom"
                                align="center"
                                iconType="circle"
                                wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Top criadores por receita */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold mb-4">Top Creators by Revenue</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={charts.topCreators} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis type="number" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 12 }} />
                            <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 12 }} />
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
                            />
                            <Bar dataKey="total" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}