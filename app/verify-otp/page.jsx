"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { PenLine, Loader2, RefreshCw, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(300); // 5 min
  const [email, setEmail] = useState("");
  const inputsRef = useRef([]);
  const router = useRouter();

  useEffect(() => {
    const pending = sessionStorage.getItem("pending_email");
    if (!pending) {
      router.push("/signup");
      return;
    }
    setEmail(pending);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const updated = [...otp];
    updated[index] = value.slice(-1);
    setOtp(updated);
    if (value && index < 5) inputsRef.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (paste.length === 6) {
      setOtp(paste.split(""));
      inputsRef.current[5]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join("");
    if (otpString.length < 6) return toast.error("Please enter all 6 digits.");

    setLoading(true);
    try {
      await authApi.verifyOtp({ email, otp: otpString });
      sessionStorage.removeItem("pending_email");
      toast.success("Email verified! You can now log in.");
      router.push("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    setResending(true);
    try {
      await authApi.resendOtp({ email });
      setCountdown(300);
      setOtp(["", "", "", "", "", ""]);
      inputsRef.current[0]?.focus();
      toast.success("New OTP sent to your email.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resend OTP.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-white to-indigo-50 px-6 py-12">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-violet-100 blur-3xl opacity-60" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-indigo-100 blur-3xl opacity-60" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-violet-500/10 border border-violet-100 p-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mb-8 justify-center">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
              <PenLine className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              Inkfinity
            </span>
          </Link>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-violet-50 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-violet-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 mb-2">Verify your email</h1>
            <p className="text-slate-500 text-sm">
              We sent a 6-digit code to <br />
              <span className="font-semibold text-slate-700">{email}</span>
            </p>
          </div>

          {/* OTP Inputs */}
          <div className="flex gap-3 justify-center mb-6" onPaste={handlePaste}>
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputsRef.current[i] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="w-12 h-14 text-center text-xl font-bold rounded-xl border-2 border-slate-200 bg-slate-50 focus:border-violet-500 focus:bg-white focus:outline-none transition-all duration-200"
              />
            ))}
          </div>

          {/* Countdown Timer */}
          <div className="text-center mb-6">
            <span
              className={`text-sm font-mono font-semibold ${
                countdown < 60 ? "text-rose-500" : "text-violet-600"
              }`}
            >
              {countdown > 0 ? `Expires in ${formatTime(countdown)}` : "OTP expired"}
            </span>
          </div>

          {/* Verify Button */}
          <Button
            onClick={handleVerify}
            variant="gradient"
            size="lg"
            className="w-full mb-4"
            disabled={loading || otp.join("").length < 6}
          >
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Verifying...</> : "Verify Email"}
          </Button>

          {/* Resend */}
          <button
            onClick={handleResend}
            disabled={countdown > 0 || resending}
            className="w-full flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-violet-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${resending ? "animate-spin" : ""}`} />
            {countdown > 0 ? `Resend OTP in ${formatTime(countdown)}` : "Resend OTP"}
          </button>
        </div>
      </div>
    </div>
  );
}
