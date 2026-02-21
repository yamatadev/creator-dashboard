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

const statusConfig: Record<string, { label: string; dot: string; bg: string; text: string }> = {
  ACTIVE: { label: "Active", dot: "bg-green-500", bg: "bg-green-50", text: "text-green-700" },
  INACTIVE: { label: "Inactive", dot: "bg-gray-400", bg: "bg-gray-50", text: "text-gray-600" },
  SUSPENDED: { label: "Suspended", dot: "bg-red-500", bg: "bg-red-50", text: "text-red-700" },
  PENDING: { label: "Pending", dot: "bg-amber-500", bg: "bg-amber-50", text: "text-amber-700" },
};

const platformConfig: Record<string, { label: string; color: string }> = {
  INSTAGRAM: { label: "IG", color: "bg-gradient-to-r from-purple-500 to-pink-500 text-white" },
  YOUTUBE: { label: "YT", color: "bg-red-600 text-white" },
  TIKTOK: { label: "TT", color: "bg-gray-900 text-white" },
  ONLYFANS: { label: "OF", color: "bg-blue-500 text-white" },
  PRIVACY: { label: "PV", color: "bg-purple-600 text-white" },
  TWITTER: { label: "X", color: "bg-gray-800 text-white" },
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
        <h2 className="text-2xl font-bold text-gray-900">Creators</h2>
        <p className="text-gray-500 mt-1">{pagination?.total || 0} creators in your network</p>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="SUSPENDED">Suspended</option>
          </select>
          <select value={platformFilter} onChange={(e) => { setPlatformFilter(e.target.value); setPage(1); }}
            className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">All Platforms</option>
            <option value="INSTAGRAM">Instagram</option>
            <option value="YOUTUBE">YouTube</option>
            <option value="TIKTOK">TikTok</option>
            <option value="ONLYFANS">OnlyFans</option>
            <option value="PRIVACY">Privacy</option>
          </select>
        </div>
      </div>

      {/* Lista de creators — Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-36 bg-white rounded-xl border animate-pulse" />
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
                className="bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-300 hover:shadow-md transition-all group"
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    {creator.avatarUrl ? (
                      <img
                        src={creator.avatarUrl}
                        alt={creator.name}
                        className="w-12 h-12 rounded-full bg-gray-100"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                        {creator.name.charAt(0)}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                        {creator.name}
                      </h3>
                      {/* Status badge */}
                      <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full ${status.bg} ${status.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                        {status.label}
                      </span>
                    </div>

                    <p className="text-sm text-gray-500 truncate">{creator.email}</p>

                    {creator.bio && (
                      <p className="text-xs text-gray-400 mt-1 line-clamp-1">{creator.bio}</p>
                    )}

                    {/* Platform badges */}
                    <div className="flex items-center gap-1.5 mt-3">
                      {allPlatforms.map((p) => {
                        const config = platformConfig[p];
                        if (!config) return null;
                        return (
                          <span
                            key={p}
                            className={`text-[10px] font-bold px-2 py-0.5 rounded ${config.color}`}
                          >
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

      {/* Paginação */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Page {pagination.page} of {pagination.totalPages}</p>
          <div className="flex gap-2">
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              <ChevronLeft size={16} />
            </button>
            <button onClick={() => setPage(Math.min(pagination.totalPages, page + 1))} disabled={page === pagination.totalPages}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {!loading && creators.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400">
          No creators found.
        </div>
      )}
    </div>
  );
}