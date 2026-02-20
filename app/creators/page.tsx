"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Search, Plus, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";

interface Creator {
  id: string;
  name: string;
  email: string;
  platform: string;
  status: string;
  bio: string | null;
  joinedAt: string;
  _count: { earnings: number; metrics: number };
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const statusColors: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-700",
  INACTIVE: "bg-gray-100 text-gray-600",
  SUSPENDED: "bg-red-100 text-red-700",
  PENDING: "bg-amber-100 text-amber-700",
};

const platformColors: Record<string, string> = {
  INSTAGRAM: "bg-pink-100 text-pink-700",
  YOUTUBE: "bg-red-100 text-red-700",
  TIKTOK: "bg-gray-900 text-white",
  ONLYFANS: "bg-blue-100 text-blue-700",
  PRIVACY: "bg-purple-100 text-purple-700",
  TWITTER: "bg-sky-100 text-sky-700",
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Creators</h2>
          <p className="text-gray-500 mt-1">{pagination?.total || 0} creators in your network</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-3">
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
            <option value="PENDING">Pending</option>
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

      {/* Lista */}
      <div className="bg-white rounded-xl border border-gray-200">
        {loading ? (
          <div className="p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-50 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {creators.map((creator) => (
              <Link key={creator.id} href={`/creators/${creator.id}`}
                className="block p-5 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                      {creator.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{creator.name}</h3>
                      <p className="text-sm text-gray-500">{creator.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${platformColors[creator.platform] || "bg-gray-100"}`}>
                      {creator.platform}
                    </span>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[creator.status] || "bg-gray-100"}`}>
                      {creator.status}
                    </span>
                    <ExternalLink size={16} className="text-gray-300" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Paginação */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-gray-200">
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
          <div className="p-12 text-center text-gray-400">No creators found.</div>
        )}
      </div>
    </div>
  );
}