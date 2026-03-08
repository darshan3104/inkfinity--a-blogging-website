import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function WelcomeBanner({ userName }) {
  return (
    <div className="bg-[#ebd068] rounded-2xl p-8 relative overflow-hidden flex flex-col md:flex-row items-center justify-between shadow-xs">
      {/* Content */}
      <div className="relative z-10 max-w-sm mb-6 md:mb-0">
        <h1 className="text-4xl font-serif font-bold text-[#2d285a] mb-4">
          Hello {userName || "Writer"}!
        </h1>
        <p className="text-[#3b356e] font-medium leading-relaxed mb-6">
          Welcome back to Inkfinity. Here is what is happening with your articles today and the printing and typesetting industry.
        </p>
        <Link href="/dashboard/create">
          <Button className="bg-[#2d285a] hover:bg-[#1a1738] text-white rounded-xl px-6 py-5 shadow-md">
            Write new post
          </Button>
        </Link>
      </div>

      {/* Illustration */}
      <div className="relative z-10 w-48 h-48 md:w-64 md:h-64 flex-shrink-0 flex items-center justify-center">
        {/* We use our generated image */}
        <img
          src="/images/welcome-illustration.png"
          alt="Welcome Illustration"
          className="w-full h-full object-contain drop-shadow-lg"
        />
      </div>

      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-full h-full pointer-events-none overflow-hidden">
         <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2"></div>
      </div>
    </div>
  );
}
