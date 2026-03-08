"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { getInitials } from "@/lib/utils";
import {
  LayoutDashboard,
  PenLine,
  User,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Globe,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "My Posts", icon: LayoutDashboard },
  { href: "/dashboard/create", label: "Create Post", icon: PenLine },
  { href: "/dashboard/profile", label: "Profile", icon: User },
  {href: "/dashboard/forum", label:"Globe", icon: Globe}
];

function DashboardSidebar({ mobile, onClose }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <div className={`flex flex-col h-full ${mobile ? "w-full" : "w-64"}`}>
      {/* Logo */}
      <div className="p-6 border-b border-slate-100">
        <Link href="/" className="flex items-center gap-2" onClick={onClose}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
            <PenLine className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            Inkfinity
          </span>
        </Link>
        {mobile && (
          <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-lg hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* User info */}
      <div className="p-4 border-b border-slate-100">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {getInitials(user?.name)}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate">{user?.name}</p>
            <p className="text-xs text-slate-400 truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                active
                  ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/25"
                  : "text-slate-600 hover:text-violet-600 hover:bg-violet-50"
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
              {active && <ChevronRight className="w-4 h-4 ml-auto" />}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-slate-100">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-3 text-rose-500 hover:text-rose-600 hover:bg-rose-50"
          onClick={() => { logout(); onClose?.(); }}
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50 flex">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-100 shadow-sm fixed inset-y-0 left-0 z-40">
          <DashboardSidebar onClose={() => {}} />
        </aside>

        {/* Mobile Overlay Sidebar */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
            <aside className="relative w-72 max-w-[85vw] h-full bg-white shadow-xl">
              <DashboardSidebar mobile onClose={() => setSidebarOpen(false)} />
            </aside>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 md:pl-64 flex flex-col min-h-screen">
          {/* Mobile Header */}
          <header className="md:hidden bg-white border-b border-slate-100 px-4 py-3 flex items-center gap-3 sticky top-0 z-30">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <Menu className="w-5 h-5 text-slate-600" />
            </button>
            <span className="font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              Inkfinity
            </span>
          </header>

          <main className="flex-1 p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
