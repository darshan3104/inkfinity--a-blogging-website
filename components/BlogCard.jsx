"use client";

import Link from "next/link";
import { formatDate, truncate } from "@/lib/utils";
import { Calendar, User, ArrowRight } from "lucide-react";

export default function BlogCard({ post }) {
  return (
    <Link href={`/blogs/${post._id}`} className="group block">
      <article className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:shadow-violet-500/10 hover:-translate-y-1 transition-all duration-300">
        {/* Cover Image */}
        <div className="relative h-48 bg-gradient-to-br from-violet-100 to-indigo-100 overflow-hidden">
          {post.coverImage ? (
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-6xl opacity-20">✍️</div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>

        {/* Content */}
        <div className="p-5">
          <h2 className="text-lg font-bold text-slate-800 mb-2 line-clamp-2 group-hover:text-violet-600 transition-colors duration-200">
            {post.title}
          </h2>

          <p className="text-sm text-slate-500 line-clamp-3 mb-4 leading-relaxed">
            {truncate(post.excerpt || "", 120)}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5" />
                {post.author?.name || "Anonymous"}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(post.createdAt)}
              </span>
            </div>
            <span className="text-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
