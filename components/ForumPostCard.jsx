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
      <article className="group bg-white border border-slate-100 shadow-sm rounded-2xl overflow-hidden hover:border-indigo-200 hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col">
        {/* Cover Image */}
        <Link href={`/blogs/${post._id}`} className="block relative h-48 overflow-hidden shrink-0">
          {post.coverImage ? (
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-slate-100 flex items-center justify-center">
              <span className="text-5xl opacity-40">✍️</span>
            </div>
          )}
          <div className="absolute inset-0 bg-linear-to-t from-slate-900/60 via-transparent to-transparent" />

          {/* Author badge on image */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-sm">
            <User className="w-3.5 h-3.5 text-indigo-500" />
            <span className="text-[13px] text-slate-700 font-bold tracking-tight">
              {post.author?.name || "Anonymous"}
            </span>
          </div>
        </Link>

        {/* Body */}
        <div className="p-5 flex flex-col flex-1">
          <Link href={`/blogs/${post._id}`} className="block flex-1">
            <h2 className="text-lg font-bold text-slate-800 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors duration-200 leading-snug">
              {post.title}
            </h2>
            <p className="text-[15px] text-slate-500 line-clamp-2 leading-relaxed">
              {truncate(post.excerpt || "", 110)}
            </p>
          </Link>

          <div className="mt-5 pt-4 flex items-center justify-between border-t border-slate-100">
            {/* Date */}
            <span className="flex items-center gap-1.5 text-[13px] font-medium text-slate-400">
              <Calendar className="w-4 h-4" />
              {formatDate(post.createdAt)}
            </span>

            {/* Action buttons */}
            <div className="flex items-center gap-1.5">
              {/* Like */}
              <button
                onClick={handleLike}
                disabled={likeLoading}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[13px] font-bold transition-all duration-200 ${
                  liked
                    ? "bg-rose-50 text-rose-600 border border-rose-100 shrink-0"
                    : "bg-slate-50 text-slate-500 border border-transparent hover:bg-rose-50 hover:text-rose-500 shrink-0"
                }`}
                aria-label="Like post"
              >
                <Heart
                  strokeWidth={2.5}
                  className={`w-4 h-4 transition-transform duration-150 ${liked ? "fill-rose-500 scale-110" : ""}`}
                />
                <span>{likeCount}</span>
              </button>

              {/* Comment */}
              <button
                onClick={handleCommentOpen}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[13px] font-bold bg-slate-50 text-slate-500 border border-transparent hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200 shrink-0"
                aria-label="Open comments"
              >
                <MessageCircle strokeWidth={2.5} className="w-4 h-4" />
                <span>{commentCount}</span>
              </button>

              {/* Share */}
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 p-1.5 rounded-xl text-[13px] font-bold bg-slate-50 text-slate-400 border border-transparent hover:bg-emerald-50 hover:text-emerald-600 transition-all duration-200 shrink-0"
                aria-label="Share post"
              >
                <Share2 strokeWidth={2.5} className="w-4 h-4" />
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
