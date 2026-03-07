"use client";

import { useState } from "react";
import Link from "next/link";
import { authApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PenLine, Eye, EyeOff, Loader2, LogIn } from "lucide-react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error("All fields are required.");

    setLoading(true);
    try {
      const { data } = await authApi.login(form);
      login(data.user);
      toast.success(`Welcome back, ${data.user.name}!`);
      router.push("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left: Visual */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 relative overflow-hidden items-center justify-center">
        <div className="absolute w-80 h-80 rounded-full bg-white/5 -top-20 -left-20" />
        <div className="absolute w-60 h-60 rounded-full bg-white/5 bottom-10 right-10" />
        <div className="relative text-center text-white px-12">
          <div className="text-6xl mb-6">📖</div>
          <h2 className="text-3xl font-bold mb-4">Welcome back!</h2>
          <p className="text-violet-200 text-lg leading-relaxed">
            Your stories are waiting. Continue where you left off and share more with the world.
          </p>
          <div className="mt-10 bg-white/10 rounded-2xl p-6 text-left">
            <p className="text-sm text-violet-200 italic leading-relaxed">
              &ldquo;The scariest moment is always just before you start writing. After that, things can only get better.&rdquo;
            </p>
            <p className="text-xs text-violet-300 mt-3 font-medium">— Stephen King</p>
          </div>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-md">
          <Link href="/" className="flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-md">
              <PenLine className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              Inkfinity
            </span>
          </Link>

          <h1 className="text-3xl font-bold text-slate-800 mb-2">Log in to your account</h1>
          <p className="text-slate-500 mb-8">Enter your credentials to continue writing.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                value={form.email}
                onChange={handleChange}
                disabled={loading}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Your password"
                  value={form.password}
                  onChange={handleChange}
                  disabled={loading}
                  className="h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" variant="gradient" size="lg" className="w-full" disabled={loading}>
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Logging in...</>
              ) : (
                <><LogIn className="w-4 h-4" /> Log In</>
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-violet-600 font-semibold hover:underline">
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
