"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import BlogCard from "@/components/BlogCard";
import { postsApi } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2, BookOpen } from "lucide-react";

export default function BlogsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPosts = async (searchVal = search, pageVal = page) => {
    setLoading(true);
    try {
      const { data } = await postsApi.getAll({ page: pageVal, limit: 9, search: searchVal });
      setPosts(data.posts || []);
      setTotalPages(data.totalPages || 1);
    } catch {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [page, search]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Page Header */}
      <div className="bg-gradient-to-br from-violet-600 to-indigo-600 pt-28 pb-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Explore All Stories</h1>
          <p className="text-violet-200 max-w-xl mx-auto mb-8">
            Discover articles, guides, and stories from writers around the world.
          </p>
          {/* Search */}
          <form
            onSubmit={handleSearch}
            className="flex gap-3 max-w-md mx-auto"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-10 pr-4 h-11 rounded-xl border-0 bg-white/90 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
              />
            </div>
            <Button type="submit" variant="default" className="bg-white text-violet-600 hover:bg-violet-50 h-11 px-5 rounded-xl">
              Search
            </Button>
          </form>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-8 h-8 text-violet-600 animate-spin" />
              <p className="text-sm text-slate-500">Loading posts...</p>
            </div>
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <BookOpen className="w-16 h-16 text-slate-200 mb-4" />
            <h3 className="text-lg font-semibold text-slate-600 mb-2">No posts found</h3>
            <p className="text-slate-400 text-sm">Try a different search term or check back later.</p>
          </div>
        ) : (
          <>
            {search && (
              <p className="text-sm text-slate-500 mb-6">
                Showing results for{" "}
                <span className="font-semibold text-violet-600">&ldquo;{search}&rdquo;</span>
                &nbsp;—&nbsp;
                <button onClick={() => { setSearch(""); setSearchInput(""); setPage(1); }} className="text-rose-500 hover:underline">
                  Clear
                </button>
              </p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <BlogCard key={post._id} post={post} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <Button
                    key={p}
                    variant={p === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPage(p)}
                    className={p === page ? "bg-violet-600 text-white border-violet-600" : ""}
                  >
                    {p}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
