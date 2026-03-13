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

const COLORS = ["#7C3AED", "#10B981", "#F59E0B", "#F43F5E", "#06B6D4", "#A78BFA"];

const tooltipStyle = {
    contentStyle: {
        backgroundColor: "#18181f",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "8px",
        color: "#f1f5f9",
        fontSize: "12px",
    },
    labelStyle: { color: "#94a3b8", marginBottom: "4px" },
};

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
                    <div key={i} className="h-80 bg-surface rounded-xl border border-white/6 animate-pulse" />
                ))}
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-100">Analytics</h2>
                <p className="text-slate-500 mt-1 text-sm">Deep dive into your creator network performance</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Trend */}
                <div className="bg-surface rounded-xl border border-white/6 p-6">
                    <h3 className="text-sm font-semibold text-slate-200 mb-5 uppercase tracking-wider">Revenue Trend</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={charts.revenueByMonth}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false}
                                tickFormatter={(v) => {
                                    const [, month] = v.split("-");
                                    const m = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                                    return m[parseInt(month) - 1];
                                }} />
                            <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                            <Tooltip {...tooltipStyle}
                                formatter={(value) => {
                                    const n = typeof value === "number" ? value : typeof value === "string" ? Number(value) : 0;
                                    return [`$${n.toLocaleString()}`, "Revenue"] as const;
                                }}
                                cursor={{ fill: "rgba(124,58,237,0.06)" }}
                            />
                            <Bar dataKey="total" fill="#7C3AED" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Creators by Platform */}
                <div className="bg-surface rounded-xl border border-white/6 p-6">
                    <h3 className="text-sm font-semibold text-slate-200 mb-5 uppercase tracking-wider">Creators by Platform</h3>
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
                                contentStyle={{
                                    backgroundColor: "#18181f",
                                    border: "1px solid rgba(255,255,255,0.08)",
                                    borderRadius: "8px",
                                    color: "#f1f5f9",
                                    fontSize: "12px",
                                }}
                                formatter={(value, name) => {
                                    const n = typeof value === "number" ? value : typeof value === "string" ? Number(value) : 0;
                                    return [`${n}`, name] as const;
                                }}
                            />
                            <Legend
                                verticalAlign="bottom"
                                align="center"
                                iconType="circle"
                                wrapperStyle={{ fontSize: 11, paddingTop: 8, color: "#94a3b8" }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Top Creators by Revenue */}
                <div className="lg:col-span-2 bg-surface rounded-xl border border-white/6 p-6">
                    <h3 className="text-sm font-semibold text-slate-200 mb-5 uppercase tracking-wider">Top Creators by Revenue</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={charts.topCreators} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
                            <XAxis type="number" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                            <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                            <Tooltip {...tooltipStyle}
                                formatter={(value) => {
                                    const n = typeof value === "number" ? value : typeof value === "string" ? Number(value) : 0;
                                    return [`$${n.toLocaleString()}`, "Revenue"] as const;
                                }}
                                cursor={{ fill: "rgba(124,58,237,0.06)" }}
                            />
                            <Bar dataKey="total" fill="#A78BFA" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
