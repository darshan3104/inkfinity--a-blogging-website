"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, MessageCircle, Share2, User, Calendar } from "lucide-react";
import { postsApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { formatDate, truncate } from "@/lib/utils";
import toast from "react-hot-toast";
import CommentDrawer from "./CommentDrawer";

export default function ForumPostCard({ post }) {
  const { isAuthenticated } = useAuth();

  // Optimistic like state
  const [liked, setLiked] = useState(post.likedByMe || false);
  const [likeCount, setLikeCount] = useState(post.likeCount ?? post.likes?.length ?? 0);
  const [likeLoading, setLikeLoading] = useState(false);

  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentCount] = useState(post.commentCount ?? 0);

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error("Please log in to like posts.");
      return;
    }
    // Optimistic update
    setLiked((prev) => !prev);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
    setLikeLoading(true);
    try {
      const { data } = await postsApi.toggleLike(post._id);
      setLiked(data.liked);
      setLikeCount(data.likeCount);
    } catch {
      // Revert optimistic update
      setLiked((prev) => !prev);
      setLikeCount((prev) => (liked ? prev + 1 : prev - 1));
      toast.error("Failed to update like.");
    } finally {
      setLikeLoading(false);
    }
  };

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/blogs/${post._id}`;
    navigator.clipboard.writeText(url).then(() => {
      toast.success("Link copied to clipboard!");
    }).catch(() => {
      toast.error("Failed to copy link.");
    });
  };

  const handleCommentOpen = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCommentsOpen(true);
  };

  return (
    <>
      <article className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-violet-500/40 hover:bg-white/10 transition-all duration-300 hover:shadow-2xl hover:shadow-violet-500/10 hover:-translate-y-0.5 flex flex-col">
        {/* Cover Image */}
        <Link href={`/blogs/${post._id}`} className="block relative h-48 overflow-hidden shrink-0">
          {post.coverImage ? (
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-violet-900/60 to-indigo-900/60 flex items-center justify-center">
              <span className="text-5xl opacity-30">✍️</span>
            </div>
          )}
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

          {/* Author badge on image */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm rounded-full px-2.5 py-1">
            <User className="w-3 h-3 text-violet-300" />
            <span className="text-xs text-white/90 font-medium">
              {post.author?.name || "Anonymous"}
            </span>
          </div>
        </Link>

        {/* Body */}
        <div className="p-5 flex flex-col flex-1">
          <Link href={`/blogs/${post._id}`} className="block flex-1">
            <h2 className="text-base font-bold text-white mb-2 line-clamp-2 group-hover:text-violet-300 transition-colors duration-200 leading-snug">
              {post.title}
            </h2>
            <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">
              {truncate(post.excerpt || "", 110)}
            </p>
          </Link>

          <div className="mt-4 flex items-center justify-between">
            {/* Date */}
            <span className="flex items-center gap-1 text-xs text-slate-500">
              <Calendar className="w-3 h-3" />
              {formatDate(post.createdAt)}
            </span>

            {/* Action buttons */}
            <div className="flex items-center gap-1">
              {/* Like */}
              <button
                onClick={handleLike}
                disabled={likeLoading}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                  liked
                    ? "bg-rose-500/20 text-rose-400 hover:bg-rose-500/30"
                    : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-rose-400"
                }`}
                aria-label="Like post"
              >
                <Heart
                  className={`w-3.5 h-3.5 transition-transform duration-150 ${liked ? "fill-rose-400 scale-110" : ""}`}
                />
                <span>{likeCount}</span>
              </button>

              {/* Comment */}
              <button
                onClick={handleCommentOpen}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-white/5 text-slate-400 hover:bg-white/10 hover:text-violet-400 transition-all duration-200"
                aria-label="Open comments"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>{commentCount}</span>
              </button>

              {/* Share */}
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-white/5 text-slate-400 hover:bg-white/10 hover:text-emerald-400 transition-all duration-200"
                aria-label="Share post"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </article>

      {/* Comment Drawer */}
      <CommentDrawer
        postId={post._id}
        commentCount={commentCount}
        isOpen={commentsOpen}
        onClose={() => setCommentsOpen(false)}
      />
    </>
  );
}
