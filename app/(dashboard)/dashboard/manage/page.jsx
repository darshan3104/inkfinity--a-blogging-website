"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { postsApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { formatDate } from "@/lib/utils";
import { Pencil, Trash2, Plus, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function ManagePostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  const fetchPosts = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data } = await postsApi.getAll({ limit: 100, sort: "latest" }); 
      const myPosts = (data.posts || []).filter(
        (p) => p.author?._id === user?.id || p.author?.email === user?.email
      );
      setPosts(myPosts);
    } catch {
      toast.error("Failed to load posts.");
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      await postsApi.delete(id);
      toast.success("Post deleted successfully.");
      setPosts(p => p.filter(post => post._id !== id));
    } catch {
      toast.error("Failed to delete post.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto xl:px-8 py-6">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#0B1527] tracking-tight">Manage Posts</h1>
          <p className="text-base text-slate-500 mt-2">Edit or delete your published articles.</p>
        </div>
        <button
          onClick={() => router.push("/dashboard/create")}
          className="h-12 px-6 rounded-xl bg-[#1d4ed8] hover:bg-[#1e40af] text-white font-semibold text-sm transition-transform active:scale-[0.98] shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          <Plus className="w-5 h-5" />
          Create Post
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)]">
        <div className="flex flex-col gap-4">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div 
                key={post._id} 
                className="flex items-center justify-between gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-slate-100/50 hover:border-slate-200"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200/50 flex items-center justify-center">
                    {post.coverImage ? (
                      <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-xl">✍️</div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-slate-800 text-base leading-snug truncate">
                      {post.title}
                    </h3>
                    <p className="text-sm text-slate-500 mt-0.5">
                      {formatDate(post.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button 
                    onClick={() => router.push(`/dashboard/edit/${post._id}`)}
                    className="p-2 sm:px-4 sm:py-2 flex items-center gap-2 rounded-xl text-blue-600 font-semibold hover:bg-blue-50 transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                    <span className="hidden sm:inline text-sm">Edit</span>
                  </button>
                  <button 
                    onClick={(e) => handleDelete(post._id, e)}
                    className="p-2 sm:px-4 sm:py-2 flex items-center gap-2 rounded-xl text-rose-600 font-semibold hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="hidden sm:inline text-sm">Delete</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-500 font-medium text-lg">You haven&apos;t written anything yet.</p>
              <button 
                onClick={() => router.push("/dashboard/create")} 
                className="text-blue-600 font-bold hover:underline mt-2 inline-block"
              >
                Start writing your first post →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
