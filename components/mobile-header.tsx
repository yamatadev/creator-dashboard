"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LayoutDashboard, Users, BarChart3, DollarSign, LogOut, Zap } from "lucide-react";
import { useAuth } from "@/components/auth-provider";

const navItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Creators", href: "/creators", icon: Users },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Earnings", href: "/earnings", icon: DollarSign },
];

export function MobileHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="lg:hidden">
      <header className="bg-sidebar border-b border-white/6 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-violet-600 rounded-lg flex items-center justify-center">
            <Zap size={13} className="text-white" fill="white" />
          </div>
          <span className="text-sm font-bold text-slate-100 tracking-tight">CreatorDash</span>
        </div>
        <button onClick={() => setOpen(!open)} className="p-2 rounded-lg text-slate-400 hover:bg-white/4 hover:text-slate-200 transition-colors cursor-pointer">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>
      {open && (
        <nav className="bg-sidebar border-b border-white/6 p-2 space-y-0.5">
          {navItems.map((item) => {
            const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  isActive
                    ? "bg-violet-600/10 text-violet-400 border border-violet-500/20"
                    : "text-slate-400 hover:bg-white/4 hover:text-slate-200 border border-transparent"
                }`}>
                <item.icon size={17} />
                {item.label}
              </Link>
            );
          })}
          <button onClick={logout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent transition-all w-full cursor-pointer">
            <LogOut size={17} />
            Logout
          </button>
        </nav>
      )}
    </div>
  );
}
