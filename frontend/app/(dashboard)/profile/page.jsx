"use client";

import { useAuth } from "@/context/AuthContext";
import { formatDate, getInitials } from "@/lib/utils";
import { User, Mail, Calendar, PenLine, Shield } from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth();

  const stats = [
    { label: "Account Status", value: "Verified", icon: Shield, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Member Since", value: "Active", icon: Calendar, color: "text-violet-600", bg: "bg-violet-50" },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Profile</h1>
        <p className="text-sm text-slate-500 mt-1">Your account information.</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        {/* Banner */}
        <div className="h-28 bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 relative">
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, white 2px, transparent 2px), radial-gradient(circle at 75% 75%, white 2px, transparent 2px)`,
            backgroundSize: "30px 30px",
          }} />
        </div>

        {/* Avatar & Basic Info */}
        <div className="px-8 pb-8">
          <div className="flex items-end gap-5 -mt-10 mb-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white font-bold text-3xl shadow-lg border-4 border-white">
              {getInitials(user?.name)}
            </div>
            <div className="mb-2">
              <h2 className="text-xl font-bold text-slate-800">{user?.name}</h2>
              <p className="text-sm text-slate-500">Inkfinity Writer</p>
            </div>
          </div>

          {/* Info Fields */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
              <div className="w-9 h-9 rounded-lg bg-violet-50 flex items-center justify-center">
                <User className="w-4 h-4 text-violet-600" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Full Name</p>
                <p className="text-sm font-semibold text-slate-700 mt-0.5">{user?.name || "—"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center">
                <Mail className="w-4 h-4 text-indigo-600" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Email Address</p>
                <p className="text-sm font-semibold text-slate-700 mt-0.5">{user?.email || "—"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center">
                <Shield className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Account Status</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <p className="text-sm font-semibold text-emerald-700">Verified & Active</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
              <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center">
                <PenLine className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Role</p>
                <p className="text-sm font-semibold text-slate-700 mt-0.5">Writer & Publisher</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
