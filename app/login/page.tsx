"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Zap } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) { router.push("/"); router.refresh(); }
      else setError(data.error || "Login failed");
    } catch {
      setError("Connection error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-base">
      {/* Left — Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-sidebar border-r border-white/6 relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 -left-32 w-96 h-96 bg-violet-600/8 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-fuchsia-600/6 rounded-full blur-3xl" />
        </div>

        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)`,
            backgroundSize: "64px 64px",
          }}
        />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-violet-600 rounded-xl flex items-center justify-center">
              <Zap size={16} className="text-white" fill="white" />
            </div>
            <span className="text-slate-100 font-bold text-base tracking-tight">CreatorDash</span>
          </div>

          <div className="max-w-md">
            <h1 className="text-4xl font-bold text-slate-100 leading-tight tracking-tight">
              Manage your creators.
              <br />
              <span className="text-violet-400">Track your revenue.</span>
            </h1>
            <p className="text-slate-500 mt-4 leading-relaxed text-sm">
              Analytics platform for content creator management — revenue tracking,
              audience growth, and performance metrics across multiple platforms.
            </p>

            <div className="grid grid-cols-3 gap-4 mt-10">
              {[
                { label: "Revenue Tracked", value: "$847K+" },
                { label: "Creators", value: "1,200+" },
                { label: "Platforms", value: "6" },
              ].map((stat) => (
                <div key={stat.label} className="bg-white/4 border border-white/6 rounded-xl p-4">
                  <p className="text-slate-100 font-bold text-xl tabular-nums">{stat.value}</p>
                  <p className="text-slate-600 text-xs mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-slate-700 text-xs">
            Built by Renan Paes · renanpaes.dev
          </p>
        </div>
      </div>

      {/* Right — Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-10">
            <div className="w-9 h-9 bg-violet-600 rounded-xl flex items-center justify-center">
              <Zap size={16} className="text-white" fill="white" />
            </div>
            <span className="font-bold text-base text-slate-100 tracking-tight">CreatorDash</span>
          </div>

          <h2 className="text-2xl font-bold text-slate-100 tracking-tight">Welcome back</h2>
          <p className="text-slate-500 mt-2 text-sm">Sign in to your dashboard</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg">
                <p className="text-sm text-rose-400">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@creatordash.com" required
                className="w-full px-4 py-2.5 bg-white/4 border border-white/8 rounded-lg text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" required
                className="w-full px-4 py-2.5 bg-white/4 border border-white/8 rounded-lg text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all" />
            </div>

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-violet-600 text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer">
              {loading ? <><Loader2 size={16} className="animate-spin" /> Signing in...</> : "Sign In"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/6">
            <p className="text-[10px] text-slate-600 text-center mb-3 uppercase tracking-wider">Demo credentials</p>
            <div className="bg-white/4 border border-white/6 rounded-lg p-3 text-center">
              <p className="text-xs text-slate-500 font-mono">admin@creatordash.com · admin123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
