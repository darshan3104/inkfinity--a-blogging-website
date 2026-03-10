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
    <div className="min-h-screen bg-[#F8F9FA] pb-24">
      {/* ── Hero ────────────────────────────────────── */}
      <section className="relative pt-12 pb-16 px-6 overflow-hidden">
        {/* Decorative background subtle gradients */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-100/50 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-100/50 rounded-full blur-[80px] pointer-events-none translate-y-1/3 -translate-x-1/3" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-full px-4 py-1.5 text-indigo-700 text-sm font-semibold mb-6">
            <Globe className="w-4 h-4 text-indigo-500 animate-[spin_4s_linear_infinite]" />
            Global Community Forum
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-[#0F172A] mb-4 leading-tight tracking-tight">
            Ideas from{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Every Corner
            </span>
          </h1>
          <p className="text-slate-500 text-lg max-w-xl mx-auto mb-10">
            Explore, like, and discuss stories shared by writers around the world.
          </p>

          {/* Stats */}
          {total > 0 && !loading && (
            <div className="inline-flex items-center gap-2 bg-white border border-slate-200 shadow-sm rounded-full px-5 py-2 text-slate-500 text-sm mb-8">
              <BookOpen className="w-4 h-4 text-indigo-500" />
              <span>
                <strong className="text-slate-800">{total.toLocaleString()}</strong>{" "}
                {total === 1 ? "story" : "stories"} in the community
              </span>
            </div>
          )}

          {/* Search */}
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto relative z-20">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors pointer-events-none" />
              <input
                type="text"
                placeholder="Search all posts..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-12 pr-4 h-14 rounded-2xl bg-white border-2 border-slate-100 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500/30 focus:ring-4 focus:ring-indigo-500/10 text-[15px] shadow-sm transition-all"
              />
            </div>
            <button
              type="submit"
              className="h-14 px-8 bg-[#0F172A] hover:bg-slate-800 text-white font-semibold rounded-2xl transition-all shadow-md active:scale-[0.98]"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* ── Content ─────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
          {/* Sort Tabs */}
          <div className="flex items-center gap-1">
            {SORT_OPTIONS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => handleSort(key)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[14px] font-semibold transition-all duration-200 ${
                  sort === key
                    ? "bg-indigo-50/80 text-indigo-700"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                }`}
              >
                <Icon className={`w-4 h-4 ${sort === key ? "text-indigo-600" : "text-slate-400"}`} />
                {label}
              </button>
            ))}
          </div>

          {/* Active search indicator */}
          {search && (
            <div className="flex items-center gap-3 px-3">
              <span className="text-sm text-slate-500 font-medium">
                Results for {" "}
                <span className="text-indigo-600 font-bold">&ldquo;{search}&rdquo;</span>
              </span>
              <div className="w-[1px] h-4 bg-slate-200" />
              <button
                onClick={() => { setSearch(""); setSearchInput(""); setPage(1); }}
                className="text-slate-400 hover:text-rose-500 text-sm font-medium transition-colors"
              >
                Clear
              </button>
            </div>
          )}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
            </div>
            <p className="text-slate-500 text-sm font-medium">Loading stories...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-[24px] border border-slate-100 shadow-sm">
            <div className="w-20 h-20 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-5">
              <BookOpen className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-[20px] font-bold text-slate-800 mb-2">
              {search ? "No results found" : "No posts yet"}
            </h3>
            <p className="text-slate-500 text-[15px] max-w-sm mb-6 leading-relaxed">
              {search
                ? "We couldn't find anything matching your search. Try different keywords!"
                : "The forum is currently empty. Be the first to share your creative writing with the world!"}
            </p>
            {search && (
              <button
                onClick={() => { setSearch(""); setSearchInput(""); setPage(1); }}
                className="px-6 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-semibold rounded-xl text-[15px] transition-colors"
              >
                Clear Search Results
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <ForumPostCard key={post._id} post={post} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-all shadow-sm"
                >
                  Previous
                </button>

                <div className="flex gap-1.5 p-1 bg-white border border-slate-200 rounded-xl shadow-sm">
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
                        <span key={`dots-${idx}`} className="px-2 py-1.5 text-slate-400 text-sm font-bold">
                          …
                        </span>
                      ) : (
                        <button
                          key={item}
                          onClick={() => setPage(item)}
                          className={`min-w-[36px] h-9 rounded-lg text-[14px] font-bold transition-all ${
                            page === item
                              ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
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
                  className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-all shadow-sm"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
