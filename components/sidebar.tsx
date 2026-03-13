"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  DollarSign,
  LogOut,
  Zap,
} from "lucide-react";
import { useAuth } from "@/components/auth-provider";

const navItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Creators", href: "/creators", icon: Users },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Earnings", href: "/earnings", icon: DollarSign },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="hidden lg:flex w-64 flex-col bg-sidebar border-r border-white/6">
      <div className="p-6 border-b border-white/6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center shrink-0">
            <Zap size={16} className="text-white" fill="white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-100 tracking-tight">CreatorDash</h1>
            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">Management</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-0.5">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                isActive
                  ? "bg-violet-600/10 text-violet-400 border border-violet-500/20"
                  : "text-slate-400 hover:bg-white/4 hover:text-slate-200 border border-transparent"
              }`}
            >
              <item.icon size={17} className={isActive ? "text-violet-400" : ""} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-white/6">
        <div className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/4 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-400 font-bold text-sm shrink-0">
              {user?.name?.charAt(0) || "A"}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-200">{user?.name || "Admin"}</p>
              <p className="text-xs text-slate-500 truncate max-w-27.5">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
            title="Logout"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
}
