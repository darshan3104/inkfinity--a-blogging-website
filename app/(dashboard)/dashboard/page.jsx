"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { postsApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { formatDate } from "@/lib/utils";
import { ThumbsUp, Calendar, FileText, Clock, MessageCircle } from "lucide-react";

// Components
import WelcomeBanner from "../../../components/dashboard/WelcomeBanner";

export default function DashboardOverviewPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      // Since there isn't a dedicated endpoint for an author's posts,
      // we fetch a larger batch of latest posts and filter client-side.
      const { data } = await postsApi.getAll({ limit: 100, sort: "latest" }); 
      
      const myPosts = (data.posts || []).filter(
        (p) => p.author?._id === user?.id || p.author?.email === user?.email
      );

      // Sort the user's posts by most liked, then slice top 4
      const myTopPosts = myPosts.sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0)).slice(0, 4);
      
      setPosts(myTopPosts);
    } catch {
      // safe fallback
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto flex flex-col xl:flex-row gap-6 lg:gap-8">
      
      <div className="flex-1 flex flex-col gap-6 lg:gap-8 min-w-0">
        <WelcomeBanner userName={user?.name?.split(" ")[0]} />

        {/* Top Articles Section */}
        <div className="bg-white/80 backdrop-blur-3xl rounded-[2.5rem] p-6 md:p-8 flex-1 border border-slate-200/60 shadow-2xl shadow-slate-200/50 transition-all duration-300">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Top Articles</h2>
          </div>

          <div className="flex flex-col gap-6">
            {posts.length > 0 ? (
              posts.map((post, index) => (
                <article 
                  key={post._id} 
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-5 group cursor-pointer p-4 rounded-2xl hover:bg-white transition-colors border border-transparent hover:border-slate-100 hover:shadow-sm"
                  onClick={() => router.push(`/blogs/${post._id}`)}
                >
                  <span className="text-2xl font-bold text-slate-300 w-8 shrink-0 group-hover:text-blue-500 transition-colors">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  
                  {/* Thumbnail */}
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white shrink-0 shadow-sm border border-slate-100 flex items-center justify-center p-0">
                     {post.coverImage ? (
                        <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover rounded-xl" />
                      ) : (
                        <div className="w-full h-full bg-slate-100 rounded-xl flex items-center justify-center text-xl">✍️</div>
                     )}
                  </div>

                  {/* Title & Date */}
                  <div className="flex-1 min-w-0 pr-4">
                    <h3 className="font-bold text-slate-800 text-base leading-snug line-clamp-2 md:line-clamp-1 mb-1 group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-sm text-slate-500 font-medium">
                      {formatDate(post.createdAt)}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-8 w-full sm:w-auto mt-2 sm:mt-0 px-4 sm:px-0 bg-white sm:bg-transparent py-3 sm:py-0 rounded-xl border border-slate-100 sm:border-transparent">
                    <div className="flex items-center gap-2 text-slate-600 font-bold group-hover:text-blue-600 transition-colors">
                      <ThumbsUp className="w-5 h-5 text-rose-500" />
                      {post.likeCount || 0}
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 font-bold group-hover:text-blue-600 transition-colors">
                      <MessageCircle className="w-5 h-5 text-blue-500" />
                      {post.commentCount || 0}
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="text-center py-10 bg-white rounded-2xl border border-slate-100">
                <p className="text-slate-500 font-medium">No top articles found yet.</p>
                <Link href="/dashboard/create" className="text-blue-600 font-bold hover:underline mt-2 inline-block">
                  Create your first article
                </Link>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
