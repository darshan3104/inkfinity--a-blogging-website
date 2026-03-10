import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PenLine } from "lucide-react";

export default function WelcomeBanner({ userName }) {
  return (
    <div className="bg-white/80 backdrop-blur-3xl rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden flex flex-col md:flex-row items-center justify-between border border-slate-200/60 shadow-xl shadow-slate-200/40 transition-all duration-300">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-linear-to-br from-blue-50/60 via-transparent to-fuchsia-50/30 pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />
      
      <div className="absolute top-0 right-0 w-full h-full pointer-events-none overflow-hidden opacity-60">
         <div className="absolute top-1/2 right-[10%] w-[500px] h-[500px] bg-blue-200/40 rounded-full blur-[120px] -translate-y-1/2"></div>
         <div className="absolute -bottom-20 -right-20 w-[400px] h-[400px] bg-fuchsia-200/40 rounded-full blur-[100px]"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-lg mb-8 md:mb-0">
        <div className="inline-flex items-center gap-2 bg-blue-50/80 border border-blue-100 rounded-full px-4 py-1.5 text-blue-700 text-sm font-medium mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          Dashboard Overview
        </div>
        
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight leading-[1.1]">
          Hello,{" "}
          <span className="bg-linear-to-r from-blue-600 via-fuchsia-600 to-blue-600 bg-clip-text text-transparent">
            {userName || "Writer"}!
          </span>
        </h1>
        
        <p className="text-slate-500 font-medium leading-relaxed mb-8 text-lg">
          Welcome back to Inkfinity. Check your latest article stats, respond to comments, and discover new stories in our community.
        </p>
        
        <Link href="/dashboard/create">
          <Button className="bg-linear-to-r from-blue-600 to-blue-600 hover:from-blue-700 hover:to-blue-700 text-white rounded-2xl px-8 h-12 sm:h-14 shadow-lg shadow-blue-500/25 border-0 font-semibold text-base transition-transform active:scale-[0.98] flex items-center gap-2">
            <PenLine className="w-5 h-5" />
            Write new post
          </Button>
        </Link>
      </div>

      {/* Illustration */}
      <div className="relative z-10 w-48 h-48 md:w-64 md:h-64 shrink-0 flex items-center justify-center">
        <img
          src="/images/welcome-illustration.png"
          alt="Welcome"
          className="w-full h-full object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
        />
      </div>
    </div>
  );
}
