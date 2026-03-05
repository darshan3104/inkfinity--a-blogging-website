"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { postsApi, commentsApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { formatDate, getInitials } from "@/lib/utils";
import { Calendar, User, ArrowLeft, Send, Loader2, MessageCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function BlogDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [loadingPost, setLoadingPost] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    Promise.all([postsApi.getById(id), commentsApi.getByPost(id)])
      .then(([postRes, commRes]) => {
        setPost(postRes.data);
        setComments(commRes.data);
      })
      .catch(() => toast.error("Failed to load post."))
      .finally(() => setLoadingPost(false));
  }, [id]);

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    if (!isAuthenticated) return toast.error("Please log in to comment.");

    setSubmitting(true);
    try {
      const { data } = await commentsApi.create({ postId: id, comment });
      setComments([data.comment, ...comments]);
      setComment("");
      toast.success("Comment added!");
    } catch {
      toast.error("Failed to add comment.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingPost) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 text-violet-600 animate-spin" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
          <h2 className="text-2xl font-bold text-slate-700">Post not found</h2>
          <Button onClick={() => router.push("/blogs")} variant="outline" className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Blogs
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Cover Image */}
      {post.coverImage && (
        <div className="w-full h-[420px] pt-16 overflow-hidden">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <main className={`max-w-3xl mx-auto px-6 ${post.coverImage ? "py-12" : "pt-28 pb-12"}`}>
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-violet-600 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {/* Post Title */}
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight mb-6">
          {post.title}
        </h1>

        {/* Author & Date */}
        <div className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-100">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white font-bold text-lg">
            {getInitials(post.author?.name)}
          </div>
          <div>
            <p className="font-semibold text-slate-800">{post.author?.name || "Anonymous"}</p>
            <div className="flex items-center gap-3 text-sm text-slate-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(post.createdAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div
          className="prose prose-lg prose-slate max-w-none mb-16 prose-headings:font-bold prose-a:text-violet-600 prose-img:rounded-xl"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Comments Section */}
        <div className="border-t border-slate-100 pt-10">
          <h3 className="text-2xl font-bold text-slate-800 mb-8 flex items-center gap-2">
            <MessageCircle className="w-6 h-6 text-violet-600" />
            Comments ({comments.length})
          </h3>

          {/* Comment Form */}
          {isAuthenticated ? (
            <form onSubmit={handleComment} className="mb-8">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {getInitials(user?.name)}
                </div>
                <div className="flex-1 flex gap-3">
                  <input
                    type="text"
                    placeholder="Share your thoughts..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    disabled={submitting}
                  />
                  <Button type="submit" variant="gradient" size="sm" disabled={submitting || !comment.trim()}>
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </form>
          ) : (
            <div className="bg-violet-50 rounded-xl p-4 mb-8 text-center">
              <p className="text-sm text-slate-600">
                <a href="/login" className="text-violet-600 font-semibold hover:underline">Log in</a> to leave a comment.
              </p>
            </div>
          )}

          {/* Comment List */}
          {comments.length === 0 ? (
            <div className="text-center py-10 text-slate-400">
              <MessageCircle className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No comments yet. Be the first!</p>
            </div>
          ) : (
            <div className="space-y-5">
              {comments.map((c) => (
                <div key={c._id} className="flex gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-400 to-slate-500 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                    {getInitials(c.userId?.name)}
                  </div>
                  <div className="flex-1">
                    <div className="bg-slate-50 rounded-xl px-4 py-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-slate-700">{c.userId?.name || "Anonymous"}</span>
                        <span className="text-xs text-slate-400">{formatDate(c.createdAt)}</span>
                      </div>
                      <p className="text-sm text-slate-600">{c.comment}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
