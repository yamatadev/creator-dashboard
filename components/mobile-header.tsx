"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LayoutDashboard, Users, BarChart3, DollarSign } from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Creators", href: "/creators", icon: Users },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Earnings", href: "/earnings", icon: DollarSign },
];

export function MobileHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="lg:hidden">
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-bold">📊 CreatorDash</h1>
        <button onClick={() => setOpen(!open)} className="p-2 rounded-lg hover:bg-gray-100">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>
      {open && (
        <nav className="bg-white border-b border-gray-200 p-2">
          {navItems.map((item) => {
            const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-100"
                }`}>
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      )}
    </div>
  );
}