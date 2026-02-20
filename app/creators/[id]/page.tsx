"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Users, Eye, Heart, DollarSign } from "lucide-react";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

interface CreatorDetail {
    id: string;
    name: string;
    email: string;
    platform: string;
    status: string;
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
                <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
                <div className="h-40 bg-white rounded-xl border animate-pulse" />
                <div className="h-80 bg-white rounded-xl border animate-pulse" />
            </div>
        );
    }

    if (!creator) {
        return <div className="p-12 text-center text-gray-400">Creator not found.</div>;
    }

    // Preparar dados dos gráficos (reverter pra ordem cronológica)
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
            {/* Header */}
            <Link href="/creators" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
                <ArrowLeft size={16} /> Back to Creators
            </Link>

            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                            {creator.name.charAt(0)}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">{creator.name}</h2>
                            <p className="text-gray-500">{creator.email}</p>
                            {creator.bio && <p className="text-sm text-gray-400 mt-1">{creator.bio}</p>}
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <span className="text-xs font-medium px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                            {creator.platform}
                        </span>
                        <span className={`text-xs font-medium px-3 py-1 rounded-full ${creator.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                            }`}>
                            {creator.status}
                        </span>
                    </div>
                </div>

                {/* Mini stats */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
                    {[
                        { label: "Total Revenue", value: `$${creator.totalEarnings.toLocaleString()}`, icon: DollarSign, color: "text-green-600" },
                        { label: "This Month", value: `$${creator.monthlyEarnings.toLocaleString()}`, icon: DollarSign, color: "text-blue-600" },
                        { label: "Followers", value: creator.latestFollowers.toLocaleString(), icon: Users, color: "text-purple-600" },
                        { label: "Views", value: creator.latestViews.toLocaleString(), icon: Eye, color: "text-amber-600" },
                        { label: "Engagement", value: `${creator.latestEngagement}%`, icon: Heart, color: "text-red-500" },
                    ].map((stat) => (
                        <div key={stat.label} className="bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center gap-1.5 mb-1">
                                <stat.icon size={14} className={stat.color} />
                                <span className="text-xs text-gray-500">{stat.label}</span>
                            </div>
                            <p className="text-lg font-bold">{stat.value}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Gráfico de ganhos */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold mb-4">Earnings Over Time</h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <LineChart data={earningsData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="date" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
                            <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v}`} />
                            <Tooltip
                                formatter={(value) => {
                                    const n =
                                        typeof value === "number"
                                            ? value
                                            : typeof value === "string"
                                                ? Number(value)
                                                : 0;

                                    return [`$${n.toLocaleString()}`, "Earnings"] as const;
                                }}
                            />
                            <Line type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={2} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Gráfico de seguidores */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold mb-4">Audience Growth</h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <LineChart data={metricsData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="date" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
                            <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v.toString()} />
                            <Tooltip
                                formatter={(value, name) => {
                                    const n =
                                        typeof value === "number"
                                            ? value
                                            : typeof value === "string"
                                                ? Number(value)
                                                : 0;

                                    return [n.toLocaleString(), name] as const;
                                }}
                            />
                            <Line type="monotone" dataKey="followers" stroke="#8b5cf6" strokeWidth={2} dot={false} name="Followers" />
                            <Line type="monotone" dataKey="views" stroke="#f59e0b" strokeWidth={2} dot={false} name="Views" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}