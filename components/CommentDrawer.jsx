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
    "bg-violet-500", "bg-indigo-500", "bg-pink-500",
    "bg-emerald-500", "bg-amber-500", "bg-rose-500",
  ];
  const color = colors[initials.charCodeAt(0) % colors.length];
  const sizeClass = size === "sm" ? "w-7 h-7 text-xs" : "w-9 h-9 text-sm";
  return (
    <div className={`${color} ${sizeClass} rounded-full flex items-center justify-center text-white font-semibold shrink-0`}>
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
              className="text-xs text-slate-400 hover:text-violet-600 transition-colors flex items-center gap-1"
            >
              <CornerDownRight className="w-3 h-3" /> Reply
            </button>
            {comment.replies?.length > 0 && (
              <button
                onClick={() => setShowReplies(!showReplies)}
                className="text-xs text-violet-500 hover:text-violet-700 transition-colors"
              >
                {showReplies ? "Hide" : `${comment.replies.length}`} repl{comment.replies.length === 1 ? "y" : "ies"}
              </button>
            )}
            {currentUserId && comment.userId?._id === currentUserId && (
              <button
                onClick={() => onDelete(comment._id)}
                className="text-xs text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100 ml-auto"
              >
                <Trash2 className="w-3 h-3" />
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
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-violet-600" />
            <span className="font-semibold text-slate-800">
              Comments
              {totalCount > 0 && (
                <span className="ml-2 text-sm text-slate-400 font-normal">
                  ({totalCount})
                </span>
              )}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comments list */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-6 h-6 text-violet-600 animate-spin" />
            </div>
          ) : comments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <MessageCircle className="w-12 h-12 text-slate-200 mb-3" />
              <p className="text-slate-500 font-medium">No comments yet</p>
              <p className="text-slate-400 text-sm mt-1">Be the first to share your thoughts!</p>
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
        <div className="border-t border-slate-100 p-4 bg-slate-50">
          {replyTo && (
            <div className="flex items-center justify-between bg-violet-50 rounded-lg px-3 py-1.5 mb-3 text-xs text-violet-700">
              <span>
                Replying to <strong>{replyTo.userId?.name}</strong>
              </span>
              <button onClick={() => setReplyTo(null)} className="hover:text-violet-900">
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
          {isAuthenticated ? (
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Avatar name={user?.name} size="sm" />
              <div className="flex-1 flex gap-2">
                <input
                  ref={inputRef}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={replyTo ? "Write a reply..." : "Write a comment..."}
                  className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
                  disabled={submitting}
                />
                <button
                  type="submit"
                  disabled={submitting || !text.trim()}
                  className="bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white rounded-xl px-3 transition-colors flex items-center"
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
            </form>
          ) : (
            <p className="text-center text-sm text-slate-500 py-1">
              <Link href="/login" className="text-violet-600 hover:underline font-medium">
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
