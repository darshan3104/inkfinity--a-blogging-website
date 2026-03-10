"use client";

import { useState, useEffect, useRef } from "react";
import { commentsApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Loader2, Send, Trash2, CornerDownRight, X, MessageCircle } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

function Avatar({ name, size = "sm" }) {
  const initials = name
    ? name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : "?";
  const colors = [
    "bg-indigo-100 text-indigo-700", "bg-blue-100 text-blue-700", "bg-pink-100 text-pink-700",
    "bg-emerald-100 text-emerald-700", "bg-amber-100 text-amber-700", "bg-rose-100 text-rose-700",
  ];
  const color = colors[initials.charCodeAt(0) % colors.length];
  const sizeClass = size === "sm" ? "w-8 h-8 text-xs" : "w-10 h-10 text-sm";
  return (
    <div className={`${color} ${sizeClass} rounded-full flex items-center justify-center font-bold shrink-0 shadow-sm border border-white/50 backdrop-blur-sm`}>
      {initials}
    </div>
  );
}

function CommentItem({ comment, postId, currentUserId, onDelete, onReply }) {
  const [showReplies, setShowReplies] = useState(false);

  return (
    <div className="group">
      <div className="flex gap-3">
        <Avatar name={comment.userId?.name} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-semibold text-slate-800">
              {comment.userId?.name || "Anonymous"}
            </span>
            <span className="text-xs text-slate-400 shrink-0">
              {formatDate(comment.createdAt)}
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-0.5 leading-relaxed overflow-wrap-anywhere">
            {comment.comment}
          </p>
          <div className="flex items-center gap-3 mt-1.5">
            <button
              onClick={() => onReply(comment)}
              className="text-xs font-medium text-slate-400 hover:text-indigo-600 transition-colors flex items-center gap-1 bg-slate-50 hover:bg-indigo-50 px-2 py-1 rounded-md"
            >
              <CornerDownRight className="w-3 h-3" /> Reply
            </button>
            {comment.replies?.length > 0 && (
              <button
                onClick={() => setShowReplies(!showReplies)}
                className="text-xs font-semibold text-indigo-500 hover:text-indigo-700 transition-colors"
              >
                {showReplies ? "Hide" : `${comment.replies.length}`} repl{comment.replies.length === 1 ? "y" : "ies"}
              </button>
            )}
            {currentUserId && comment.userId?._id === currentUserId && (
              <button
                onClick={() => onDelete(comment._id)}
                className="text-xs text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100 ml-auto p-1 hover:bg-rose-50 rounded-md"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Nested replies */}
      {showReplies && comment.replies?.length > 0 && (
        <div className="ml-10 mt-3 space-y-3 border-l-2 border-violet-100 pl-3">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply._id}
              comment={reply}
              postId={postId}
              currentUserId={currentUserId}
              onDelete={onDelete}
              onReply={onReply}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CommentDrawer({ postId, isOpen, onClose }) {
  const { user, isAuthenticated } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [text, setText] = useState("");
  const [replyTo, setReplyTo] = useState(null); // { _id, userId.name }
  const inputRef = useRef(null);
  const drawerRef = useRef(null);

  useEffect(() => {
    if (isOpen && postId) {
      loadComments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, postId]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const loadComments = async () => {
    setLoading(true);
    try {
      const { data } = await commentsApi.getByPost(postId);
      setComments(data);
    } catch {
      toast.error("Failed to load comments.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    if (!isAuthenticated) {
      toast.error("Please log in to comment.");
      return;
    }
    setSubmitting(true);
    try {
      const { data } = await commentsApi.create({
        postId,
        comment: text.trim(),
        parentId: replyTo?._id || null,
      });
      setComments((prev) => {
        if (replyTo) {
          return prev.map((c) => {
            if (c._id === replyTo._id) {
              return { ...c, replies: [...(c.replies || []), data.comment] };
            }
            return c;
          });
        }
        return [data.comment, ...prev];
      });
      setText("");
      setReplyTo(null);
    } catch {
      toast.error("Failed to post comment.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await commentsApi.delete(commentId);
      // Remove from state (top-level or nested)
      setComments((prev) =>
        prev
          .filter((c) => c._id !== commentId)
          .map((c) => ({
            ...c,
            replies: (c.replies || []).filter((r) => r._id !== commentId),
          }))
      );
      toast.success("Comment deleted.");
    } catch {
      toast.error("Failed to delete comment.");
    }
  };

  const handleReply = (comment) => {
    setReplyTo(comment);
    inputRef.current?.focus();
  };

  const totalCount = comments.reduce(
    (acc, c) => acc + 1 + (c.replies?.length || 0),
    0
  );

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-[0_0_40px_rgba(0,0,0,0.1)] z-50 flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-indigo-600" />
            </div>
            <span className="font-bold text-slate-800 text-[17px]">
              Discussion
              {totalCount > 0 && (
                <span className="ml-2 text-[15px] text-slate-400 font-medium">
                  ({totalCount})
                </span>
              )}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comments list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-7 h-7 text-indigo-500 animate-spin" />
            </div>
          ) : comments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-4">
                <MessageCircle strokeWidth={1.5} className="w-8 h-8 text-slate-300" />
              </div>
              <p className="text-slate-800 font-bold text-lg">No comments yet</p>
              <p className="text-slate-500 text-[15px] mt-1.5">Be the first to share your thoughts!</p>
            </div>
          ) : (
            comments.map((comment) => (
              <CommentItem
                key={comment._id}
                comment={comment}
                postId={postId}
                currentUserId={user?._id || user?.id}
                onDelete={handleDelete}
                onReply={handleReply}
              />
            ))
          )}
        </div>

        {/* Input area */}
        <div className="border-t border-slate-100 p-5 bg-white shadow-[0_-10px_30px_rgba(0,0,0,0.02)] relative z-10">
          {replyTo && (
            <div className="flex items-center justify-between bg-indigo-50/80 rounded-xl px-4 py-2 mb-4 text-[13px] text-indigo-700 font-medium border border-indigo-100/50">
              <span>
                Replying to <strong className="font-bold">{replyTo.userId?.name}</strong>
              </span>
              <button onClick={() => setReplyTo(null)} className="hover:text-indigo-900 bg-white/50 rounded-md p-1">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
          {isAuthenticated ? (
            <form onSubmit={handleSubmit} className="flex gap-3">
              <Avatar name={user?.name} size="sm" />
              <div className="flex-1 flex gap-2">
                <input
                  ref={inputRef}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={replyTo ? "Write a reply..." : "Add to discussion..."}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-[15px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/30 focus:bg-white transition-all shadow-sm"
                  disabled={submitting}
                />
                <button
                  type="submit"
                  disabled={submitting || !text.trim()}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl px-4 transition-all shadow-md shadow-indigo-500/20 flex items-center"
                >
                  {submitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>
            </form>
          ) : (
            <p className="text-center text-[15px] text-slate-500 py-3 bg-slate-50 rounded-xl border border-slate-100">
              <Link href="/login" className="text-indigo-600 hover:text-indigo-700 font-semibold underline underline-offset-2">
                Log in
              </Link>{" "}
              to join the conversation.
            </p>
          )}
        </div>
      </div>
    </>
  );
}
