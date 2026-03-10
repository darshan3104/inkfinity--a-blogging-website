"use client";

import { useAuth } from "@/context/AuthContext";
import { getInitials } from "@/lib/utils";
import { User, Mail, PenLine, ShieldCheck } from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="max-w-2xl mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-[28px] font-bold text-[#0F172A] tracking-tight">Profile</h1>
        <p className="text-[15px] text-slate-500 mt-1.5">Your account information.</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)] overflow-hidden pb-8">
        
        {/* Banner */}
        <div className="h-[120px] bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] relative">
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 2px, transparent 0)`,
            backgroundSize: "24px 24px",
          }} />
        </div>

        <div className="px-6 md:px-8">
          {/* Avatar & Basic Info */}
          <div className="flex items-end gap-5 -mt-10 mb-8 relative z-10 w-fit">
            <div className="w-[96px] h-[96px] rounded-2xl bg-[#5a67d8] flex items-center justify-center text-white font-bold text-[32px] tracking-wide shadow-sm border-[4px] border-white shrink-0">
              {getInitials(user?.name)}
            </div>
            <div className="mb-2 min-w-0">
              <h2 className="text-[22px] font-bold text-[#0F172A] truncate leading-tight">{user?.name}</h2>
              <p className="text-[15px] text-slate-500 truncate mt-0.5">Inkfinity Writer</p>
            </div>
          </div>

          {/* Info Fields */}
          <div className="space-y-3">
            <div className="flex items-center gap-4 p-4 bg-[#F8FAFC] rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-violet-100/50 flex items-center justify-center shrink-0">
                <User className="w-5 h-5 text-violet-600" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-[0.08em] mb-0.5">Full Name</p>
                <p className="text-[15px] font-semibold text-[#0F172A] truncate">{user?.name || "—"}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-[#F8FAFC] rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-blue-100/50 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-[0.08em] mb-0.5">Email Address</p>
                <p className="text-[15px] font-semibold text-[#0F172A] truncate">{user?.email || "—"}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-[#F8FAFC] rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-emerald-100/50 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-[0.08em] mb-0.5">Account Status</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <p className="text-[15px] font-semibold text-emerald-700">Verified & Active</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-[#F8FAFC] rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-fuchsia-100/50 flex items-center justify-center shrink-0">
                <PenLine className="w-5 h-5 text-fuchsia-600" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-[0.08em] mb-0.5">Role</p>
                <p className="text-[15px] font-semibold text-[#0F172A]">Writer & Publisher</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
