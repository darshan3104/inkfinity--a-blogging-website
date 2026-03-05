"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import BlogCard from "@/components/BlogCard";
import { Button } from "@/components/ui/button";
import { postsApi } from "@/lib/api";
import { PenLine, ArrowRight, Sparkles, BookOpen, Users, Zap } from "lucide-react";

export default function LandingPage() {
  const [featuredPosts, setFeaturedPosts] = useState([]);

  useEffect(() => {
    postsApi.getAll({ limit: 3, page: 1 })
      .then((res) => setFeaturedPosts(res.data.posts || []))
      .catch(() => {});
  }, []);

  const stats = [
    { icon: BookOpen, label: "Posts Published", value: "10K+" },
    { icon: Users, label: "Active Writers", value: "2K+" },
    { icon: Zap, label: "Daily Readers", value: "50K+" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-indigo-50" />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-violet-200/30 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-indigo-200/30 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-purple-100/20 blur-3xl" />
        </div>

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative max-w-5xl mx-auto px-6 text-center py-32">
          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 bg-violet-50 border border-violet-200 rounded-full px-4 py-1.5 text-sm text-violet-700 font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            The modern blogging experience
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 leading-tight tracking-tight mb-6">
            Write. Share.{" "}
            <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Inspire.
            </span>
          </h1>

          <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed mb-10">
            Inkfinity is a beautiful platform for writers who care about great design. Share your ideas and build your audience — all in one place.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button variant="gradient" size="lg" className="gap-2 text-base px-8 h-14 shadow-xl shadow-violet-500/30">
                <PenLine className="w-5 h-5" />
                Start Writing Free
              </Button>
            </Link>
            <Link href="/blogs">
              <Button variant="outline" size="lg" className="gap-2 text-base px-8 h-14 border-slate-200">
                <BookOpen className="w-5 h-5" />
                Explore Blogs
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
            {stats.map(({ icon: Icon, label, value }) => (
              <div key={label} className="text-center">
                <div className="text-2xl font-bold text-slate-800">{value}</div>
                <div className="text-xs text-slate-500 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-400">
          <div className="w-5 h-8 border-2 border-slate-300 rounded-full flex items-start justify-center p-1">
            <div className="w-1 h-1.5 bg-slate-400 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="py-20 px-6 bg-slate-50">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-sm font-semibold text-violet-600 uppercase tracking-wider mb-2">
                  Fresh reads
                </p>
                <h2 className="text-4xl font-bold text-slate-800">Latest Stories</h2>
              </div>
              <Link
                href="/blogs"
                className="hidden sm:flex items-center gap-1 text-sm font-medium text-violet-600 hover:gap-2 transition-all"
              >
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredPosts.map((post) => (
                <BlogCard key={post._id} post={post} />
              ))}
            </div>

            <div className="text-center mt-10 sm:hidden">
              <Link href="/blogs">
                <Button variant="outline" className="gap-2">
                  View all posts <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-24 px-6 bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-white/5" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-white/5" />
        </div>
        <div className="relative max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to share your story?</h2>
          <p className="text-violet-200 text-lg mb-10">
            Join Inkfinity today. It&apos;s free and takes less than a minute.
          </p>
          <Link href="/signup">
            <Button size="lg" className="bg-white text-violet-600 hover:bg-violet-50 gap-2 h-14 px-10 text-base shadow-xl">
              <PenLine className="w-5 h-5" />
              Get Started — It&apos;s Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
              <PenLine className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-bold">Inkfinity</span>
          </div>
          <p className="text-sm">© {new Date().getFullYear()} Inkfinity. Built with ❤️ for writers.</p>
          <div className="flex gap-6 text-sm">
            <Link href="/blogs" className="hover:text-white transition-colors">Explore</Link>
            <Link href="/signup" className="hover:text-white transition-colors">Sign Up</Link>
            <Link href="/login" className="hover:text-white transition-colors">Log In</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
