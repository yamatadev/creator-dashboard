"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Users, Eye, Heart, DollarSign } from "lucide-react";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import type { Platform } from "@prisma/client";

const platformColors: Record<string, string> = {
    INSTAGRAM: "bg-pink-500/10 text-pink-400 border-pink-500/20",
    YOUTUBE: "bg-red-500/10 text-red-400 border-red-500/20",
    TIKTOK: "bg-slate-700/50 text-slate-300 border-slate-600/30",
    ONLYFANS: "bg-sky-500/10 text-sky-400 border-sky-500/20",
    PRIVACY: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    TWITTER: "bg-slate-500/10 text-slate-400 border-slate-500/20",
};

const statusColors: Record<string, string> = {
    ACTIVE: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    INACTIVE: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    SUSPENDED: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    PENDING: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

interface CreatorDetail {
    id: string;
    name: string;
    email: string;
    platform: string;
    platforms: Platform[];
    status: string;
    avatarUrl: string;
    bio: string | null;
    joinedAt: string;
    totalEarnings: number;
    monthlyEarnings: number;
    latestFollowers: number;
    latestViews: number;
    latestEngagement: number;
    earnings: { amount: number; date: string }[];
    metrics: { followers: number; views: number; likes: number; engagement: number; date: string }[];
}

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

export default function CreatorDetailPage() {
    const params = useParams();
    const [creator, setCreator] = useState<CreatorDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/creators/${params.id}`)
            .then((res) => res.json())
            .then((data) => {
                setCreator(data);
                setLoading(false);
            })
            .catch(console.error);
    }, [params.id]);

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="h-8 w-32 bg-white/5 rounded animate-pulse" />
                <div className="h-40 bg-surface rounded-xl border border-white/6 animate-pulse" />
                <div className="h-80 bg-surface rounded-xl border border-white/6 animate-pulse" />
            </div>
        );
    }

    if (!creator) {
        return <div className="p-12 text-center text-slate-600 text-sm">Creator not found.</div>;
    }

    const earningsData = [...creator.earnings].reverse().map((e) => ({
        date: new Date(e.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        amount: Math.round(e.amount),
    }));

    const metricsData = [...creator.metrics].reverse().map((m) => ({
        date: new Date(m.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        followers: m.followers,
        views: m.views,
        likes: m.likes,
    }));

    return (
        <div>
            {/* Back link */}
            <Link href="/creators" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 mb-6 transition-colors cursor-pointer">
                <ArrowLeft size={14} /> Back to Creators
            </Link>

            {/* Profile Card */}
            <div className="bg-surface rounded-xl border border-white/6 p-6 mb-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-center gap-4 min-w-0">
                        {creator.avatarUrl ? (
                            <img
                                src={creator.avatarUrl}
                                alt={creator.name}
                                className="w-16 h-16 rounded-full bg-slate-800 object-cover shrink-0"
                            />
                        ) : (
                            <div className="w-16 h-16 rounded-full bg-linear-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-white font-bold text-xl shrink-0">
                                {creator.name.charAt(0)}
                            </div>
                        )}

                        <div className="min-w-0">
                            <h2 className="text-xl font-bold text-slate-100 truncate">{creator.name}</h2>
                            <p className="text-slate-500 text-sm truncate">{creator.email}</p>
                            {creator.bio && <p className="text-xs text-slate-600 mt-1 line-clamp-2">{creator.bio}</p>}
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 sm:justify-end sm:max-w-xs">
                        {(creator.platforms?.length ? creator.platforms : [creator.platform]).map((p) => (
                            <span
                                key={p}
                                className={`text-xs font-medium px-2.5 py-1 rounded-full border whitespace-nowrap ${platformColors[p] || "bg-slate-500/10 text-slate-400 border-slate-500/20"}`}
                            >
                                {p}
                            </span>
                        ))}
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full border whitespace-nowrap ${statusColors[creator.status] || "bg-slate-500/10 text-slate-400 border-slate-500/20"}`}>
                            {creator.status}
                        </span>
                    </div>
                </div>

                {/* Mini Stats */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-6">
                    {[
                        { label: "Total Revenue", value: `$${creator.totalEarnings.toLocaleString()}`, icon: DollarSign, color: "text-emerald-400" },
                        { label: "This Month", value: `$${creator.monthlyEarnings.toLocaleString()}`, icon: DollarSign, color: "text-violet-400" },
                        { label: "Followers", value: creator.latestFollowers.toLocaleString(), icon: Users, color: "text-fuchsia-400" },
                        { label: "Views", value: creator.latestViews.toLocaleString(), icon: Eye, color: "text-amber-400" },
                        { label: "Engagement", value: `${creator.latestEngagement}%`, icon: Heart, color: "text-rose-400" },
                    ].map((stat) => (
                        <div key={stat.label} className="bg-white/4 border border-white/6 rounded-lg p-3">
                            <div className="flex items-center gap-1.5 mb-1.5">
                                <stat.icon size={12} className={stat.color} />
                                <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{stat.label}</span>
                            </div>
                            <p className="text-base font-bold text-slate-100 tabular-nums">{stat.value}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-surface rounded-xl border border-white/6 p-6">
                    <h3 className="text-sm font-semibold text-slate-200 mb-5 uppercase tracking-wider">Earnings Over Time</h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <LineChart data={earningsData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                            <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                            <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                            <Tooltip {...tooltipStyle}
                                formatter={(value) => {
                                    const n = typeof value === "number" ? value : typeof value === "string" ? Number(value) : 0;
                                    return [`$${n.toLocaleString()}`, "Earnings"] as const;
                                }}
                                cursor={{ stroke: "rgba(124,58,237,0.3)", strokeWidth: 1 }}
                            />
                            <Line type="monotone" dataKey="amount" stroke="#7C3AED" strokeWidth={2} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-surface rounded-xl border border-white/6 p-6">
                    <h3 className="text-sm font-semibold text-slate-200 mb-5 uppercase tracking-wider">Audience Growth</h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <LineChart data={metricsData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                            <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                            <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v.toString()} />
                            <Tooltip {...tooltipStyle}
                                formatter={(value, name) => {
                                    const n = typeof value === "number" ? value : typeof value === "string" ? Number(value) : 0;
                                    return [n.toLocaleString(), name] as const;
                                }}
                                cursor={{ stroke: "rgba(124,58,237,0.3)", strokeWidth: 1 }}
                            />
                            <Line type="monotone" dataKey="followers" stroke="#A78BFA" strokeWidth={2} dot={false} name="Followers" />
                            <Line type="monotone" dataKey="views" stroke="#F59E0B" strokeWidth={2} dot={false} name="Views" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
