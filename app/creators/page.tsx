"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

interface Creator {
  id: string;
  name: string;
  email: string;
  platform: string;
  platforms: string[];
  status: string;
  bio: string | null;
  avatarUrl: string | null;
  joinedAt: string;
  _count: { earnings: number; metrics: number };
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const statusConfig: Record<string, { label: string; dot: string; bg: string; text: string; border: string }> = {
  ACTIVE: { label: "Active", dot: "bg-emerald-400", bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20" },
  INACTIVE: { label: "Inactive", dot: "bg-slate-500", bg: "bg-slate-500/10", text: "text-slate-400", border: "border-slate-500/20" },
  SUSPENDED: { label: "Suspended", dot: "bg-rose-400", bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/20" },
  PENDING: { label: "Pending", dot: "bg-amber-400", bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20" },
};

const platformConfig: Record<string, { label: string; color: string }> = {
  INSTAGRAM: { label: "IG", color: "bg-gradient-to-r from-purple-500 to-pink-500 text-white" },
  YOUTUBE: { label: "YT", color: "bg-red-600 text-white" },
  TIKTOK: { label: "TT", color: "bg-slate-800 text-white" },
  ONLYFANS: { label: "OF", color: "bg-sky-500 text-white" },
  PRIVACY: { label: "PV", color: "bg-violet-600 text-white" },
  TWITTER: { label: "X", color: "bg-slate-700 text-white" },
};

export default function CreatorsPage() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [platformFilter, setPlatformFilter] = useState("");
  const [page, setPage] = useState(1);

  const fetchCreators = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (statusFilter) params.set("status", statusFilter);
    if (platformFilter) params.set("platform", platformFilter);
    params.set("page", page.toString());

    const res = await fetch(`/api/creators?${params}`);
    const data = await res.json();
    setCreators(data.creators);
    setPagination(data.pagination);
    setLoading(false);
  }, [search, statusFilter, platformFilter, page]);

  useEffect(() => {
    fetchCreators();
  }, [fetchCreators]);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-100">Creators</h2>
        <p className="text-slate-500 mt-1 text-sm">{pagination?.total || 0} creators in your network</p>
      </div>

      {/* Filters */}
      <div className="bg-surface rounded-xl border border-white/6 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-4 py-2.5 bg-white/4 border border-white/8 rounded-lg text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
            />
          </div>
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-3 py-2.5 border border-white/8 rounded-lg text-sm bg-white/4 text-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500/50 cursor-pointer">
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="SUSPENDED">Suspended</option>
          </select>
          <select value={platformFilter} onChange={(e) => { setPlatformFilter(e.target.value); setPage(1); }}
            className="px-3 py-2.5 border border-white/8 rounded-lg text-sm bg-white/4 text-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500/50 cursor-pointer">
            <option value="">All Platforms</option>
            <option value="INSTAGRAM">Instagram</option>
            <option value="YOUTUBE">YouTube</option>
            <option value="TIKTOK">TikTok</option>
            <option value="ONLYFANS">OnlyFans</option>
            <option value="PRIVACY">Privacy</option>
          </select>
        </div>
      </div>

      {/* Creator Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-36 bg-surface rounded-xl border border-white/6 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {creators.map((creator) => {
            const status = statusConfig[creator.status] || statusConfig.PENDING;
            const allPlatforms = creator.platforms?.length > 0 ? creator.platforms : [creator.platform];

            return (
              <Link
                key={creator.id}
                href={`/creators/${creator.id}`}
                className="bg-surface rounded-xl border border-white/6 p-5 hover:border-violet-500/30 hover:bg-surface-hover transition-all group cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className="shrink-0">
                    {creator.avatarUrl ? (
                      <img
                        src={creator.avatarUrl}
                        alt={creator.name}
                        className="w-11 h-11 rounded-full bg-slate-800 object-cover"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-white font-bold text-sm">
                        {creator.name.charAt(0)}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-slate-200 group-hover:text-violet-400 transition-colors truncate text-sm">
                        {creator.name}
                      </h3>
                      <span className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${status.bg} ${status.text} ${status.border}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                        {status.label}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 truncate">{creator.email}</p>

                    {creator.bio && (
                      <p className="text-xs text-slate-600 mt-1 line-clamp-1">{creator.bio}</p>
                    )}

                    <div className="flex items-center gap-1.5 mt-3">
                      {allPlatforms.map((p) => {
                        const config = platformConfig[p];
                        if (!config) return null;
                        return (
                          <span key={p} className={`text-[9px] font-bold px-2 py-0.5 rounded ${config.color}`}>
                            {config.label}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 bg-surface rounded-xl border border-white/6 p-4">
          <p className="text-xs text-slate-500">Page {pagination.page} of {pagination.totalPages}</p>
          <div className="flex gap-2">
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}
              className="p-2 rounded-lg border border-white/8 text-slate-400 hover:bg-white/4 hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer">
              <ChevronLeft size={15} />
            </button>
            <button onClick={() => setPage(Math.min(pagination.totalPages, page + 1))} disabled={page === pagination.totalPages}
              className="p-2 rounded-lg border border-white/8 text-slate-400 hover:bg-white/4 hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer">
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}

      {!loading && creators.length === 0 && (
        <div className="bg-surface rounded-xl border border-white/6 p-12 text-center text-slate-600 text-sm">
          No creators found.
        </div>
      )}
    </div>
  );
}
