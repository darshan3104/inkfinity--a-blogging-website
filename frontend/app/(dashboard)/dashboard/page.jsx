"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { postsApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { formatDate, truncate } from "@/lib/utils";
import {
  PenLine,
  Trash2,
  Edit,
  Loader2,
  BookOpen,
  Plus,
} from "lucide-react";
import toast from "react-hot-toast";

export default function MyPostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { data } = await postsApi.getAll({ limit: 100 });
      const myPosts = (data.posts || []).filter(
        (p) => p.author?._id === user?.id || p.author?.email === user?.email
      );
      setPosts(myPosts);
    } catch {
      toast.error("Failed to load posts.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    setDeletingId(id);
    try {
      await postsApi.delete(id);
      setPosts((prev) => prev.filter((p) => p._id !== id));
      toast.success("Post deleted.");
    } catch {
      toast.error("Failed to delete post.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My Posts</h1>
          <p className="text-sm text-slate-500 mt-1">
            {posts.length} post{posts.length !== 1 ? "s" : ""} published
          </p>
        </div>
        <Link href="/dashboard/create">
          <Button variant="gradient" size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            New Post
          </Button>
        </Link>
      </div>

      {/* Posts List */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-7 h-7 text-violet-600 animate-spin" />
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 flex flex-col items-center justify-center py-24 text-center">
          <BookOpen className="w-16 h-16 text-slate-200 mb-4" />
          <h3 className="text-lg font-semibold text-slate-600 mb-2">No posts yet</h3>
          <p className="text-slate-400 text-sm mb-6">Start writing your first post today!</p>
          <Link href="/dashboard/create">
            <Button variant="gradient" size="sm" className="gap-2">
              <PenLine className="w-4 h-4" /> Create Your First Post
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post._id}
              className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-md hover:shadow-violet-500/5 transition-all duration-200"
            >
              <div className="flex items-start gap-4">
                {/* Cover thumbnail */}
                <div className="w-20 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-violet-100 to-indigo-100 flex-shrink-0">
                  {post.coverImage ? (
                    <img src={post.coverImage} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">✍️</div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-800 truncate">{post.title}</h3>
                  <p className="text-sm text-slate-400 mt-1 line-clamp-2">
                    {truncate(post.excerpt || "", 100)}
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-xs text-slate-400">{formatDate(post.createdAt)}</span>
                    <Link
                      href={`/blogs/${post._id}`}
                      className="text-xs text-violet-600 hover:underline"
                    >
                      View post →
                    </Link>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5"
                    onClick={() => router.push(`/dashboard/edit/${post._id}`)}
                  >
                    <Edit className="w-3.5 h-3.5" /> Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 text-rose-500 border-rose-200 hover:bg-rose-50"
                    disabled={deletingId === post._id}
                    onClick={() => handleDelete(post._id)}
                  >
                    {deletingId === post._id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
