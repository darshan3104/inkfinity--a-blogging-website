"use client";

import { useEffect, useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import ForumPostCard from "@/components/ForumPostCard";
import { postsApi } from "@/lib/api";
import { Search, Loader2, Globe, TrendingUp, Clock, Flame, BookOpen } from "lucide-react";

const SORT_OPTIONS = [
  { key: "latest", label: "Latest", icon: Clock },
  { key: "mostLiked", label: "Most Liked", icon: Flame },
  { key: "mostCommented", label: "Most Discussed", icon: TrendingUp },
];

export default function ForumPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("latest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchPosts = useCallback(
    async (s = search, p = page, so = sort) => {
      setLoading(true);
      try {
        const { data } = await postsApi.getAll({ page: p, limit: 9, search: s, sort: so });
        setPosts(data.posts || []);
        setTotalPages(data.totalPages || 1);
        setTotal(data.total || 0);
      } catch {
        setPosts([]);
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    fetchPosts(search, page, sort);
  }, [search, page, sort, fetchPosts]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handleSort = (key) => {
    setSort(key);
    setPage(1);
  };

  return (
    <div style={{ background: "linear-gradient(135deg, #0f0c29 0%, #1a1042 40%, #141828 100%)" }}>

      {/* ── Hero ────────────────────────────────────── */}
      <section className="relative pt-28 pb-20 px-6 overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 right-0 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 left-0 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 bg-violet-500/20 border border-violet-500/30 rounded-full px-4 py-1.5 text-violet-300 text-sm font-medium mb-6">
            <Globe className="w-4 h-4 animate-pulse" />
            Global Community Forum
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 leading-tight tracking-tight">
            Ideas from{" "}
            <span className="bg-linear-to-r from-violet-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
              Every Corner
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto mb-10">
            Explore, like, and discuss stories shared by writers around the world.
          </p>

          {/* Stats */}
          {total > 0 && !loading && (
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-5 py-2 text-slate-400 text-sm mb-8">
              <BookOpen className="w-4 h-4 text-violet-400" />
              <span>
                <strong className="text-white">{total.toLocaleString()}</strong>{" "}
                {total === 1 ? "story" : "stories"} in the community
              </span>
            </div>
          )}

          {/* Search */}
          <form onSubmit={handleSearch} className="flex gap-3 max-w-lg mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              <input
                type="text"
                placeholder="Search all posts..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-11 pr-4 h-12 rounded-2xl bg-white/10 border border-white/15 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/60 focus:border-transparent text-sm backdrop-blur-sm"
              />
            </div>
            <button
              type="submit"
              className="h-12 px-6 bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold rounded-2xl transition-all duration-200 shadow-lg shadow-violet-500/30 text-sm"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* ── Content ─────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          {/* Sort Tabs */}
          <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-2xl p-1.5">
            {SORT_OPTIONS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => handleSort(key)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  sort === key
                    ? "bg-violet-600 text-white shadow-lg shadow-violet-500/30"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>

          {/* Active search indicator */}
          {search && (
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <span>
                Results for{" "}
                <span className="text-violet-400 font-semibold">&ldquo;{search}&rdquo;</span>
              </span>
              <button
                onClick={() => { setSearch(""); setSearchInput(""); setPage(1); }}
                className="text-rose-400 hover:text-rose-300 hover:underline text-xs"
              >
                Clear
              </button>
            </div>
          )}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 className="w-9 h-9 text-violet-500 animate-spin" />
            <p className="text-slate-500 text-sm">Loading stories...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-5">
              <BookOpen className="w-9 h-9 text-slate-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-300 mb-2">
              {search ? "No results found" : "No posts yet"}
            </h3>
            <p className="text-slate-500 text-sm max-w-xs">
              {search
                ? "Try a different search term or clear the filter."
                : "Be the first to share your story with the world!"}
            </p>
            {search && (
              <button
                onClick={() => { setSearch(""); setSearchInput(""); setPage(1); }}
                className="mt-5 px-5 py-2 bg-violet-600/30 hover:bg-violet-600/50 border border-violet-500/30 text-violet-300 rounded-xl text-sm transition-all"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {posts.map((post) => (
                <ForumPostCard key={post._id} post={post} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-14">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-4 py-2 rounded-xl text-sm font-medium border border-white/10 text-slate-400 hover:bg-white/5 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  ← Previous
                </button>

                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => {
                      if (totalPages <= 7) return true;
                      if (p === 1 || p === totalPages) return true;
                      if (Math.abs(p - page) <= 2) return true;
                      return false;
                    })
                    .reduce((acc, p, idx, arr) => {
                      if (idx > 0 && p - arr[idx - 1] > 1) {
                        acc.push("...");
                      }
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((item, idx) =>
                      item === "..." ? (
                        <span key={`dots-${idx}`} className="px-2 py-2 text-slate-600 text-sm">
                          …
                        </span>
                      ) : (
                        <button
                          key={item}
                          onClick={() => setPage(item)}
                          className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${
                            page === item
                              ? "bg-violet-600 text-white shadow-lg shadow-violet-500/30"
                              : "border border-white/10 text-slate-400 hover:bg-white/5 hover:text-white"
                          }`}
                        >
                          {item}
                        </button>
                      )
                    )}
                </div>

                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-4 py-2 rounded-xl text-sm font-medium border border-white/10 text-slate-400 hover:bg-white/5 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
