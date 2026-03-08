"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { postsApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { formatDate } from "@/lib/utils";
import { Eye, ThumbsUp, DollarSign, Calendar, FileText, Clock } from "lucide-react";

// Components
import StatCard from "@/components/dashboard/StatCard";
import ScheduleWidget from "@/components/dashboard/ScheduleWidget";
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
      const { data } = await postsApi.getAll({ limit: 4, sort: "mostLiked" }); // getting top articles
      // Filter out user's posts if we only want their posts, but for "Top articles" we can just show the site's top articles,
      // or we can show the user's top articles. Mockup seems like an overview, so let's show user's.
      const myPosts = (data.posts || []).filter(
        (p) => p.author?._id === user?.id || p.author?.email === user?.email
      );
      setPosts(myPosts.slice(0, 4)); // Only top 4 as per mockup
      // If the user has none, we'll still render an empty state or just an empty list.
    } catch {
      // toast or silent error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto flex flex-col xl:flex-row gap-6 lg:gap-8">
      
      <div className="flex-1 flex flex-col gap-6 lg:gap-8 min-w-0">
        <WelcomeBanner userName={user?.name?.split(" ")[0]} />

        {/* Top Articles Section */}
        <div className="bg-[#f8f9ff] rounded-2xl p-6 md:p-8 flex-1">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-serif font-bold text-[#1f2852]">Top articles</h2>
          </div>

          <div className="flex flex-col gap-6">
            {posts.length > 0 ? (
              posts.map((post, index) => (
                <article 
                  key={post._id} 
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-5 group cursor-pointer"
                  onClick={() => router.push(`/blogs/${post._id}`)}
                >
                  <span className="text-2xl font-bold text-[#cacedd] w-8 shrink-0">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  
                  {/* Thumbnail */}
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white shrink-0 shadow-sm border border-slate-100 flex items-center justify-center p-2">
                     {post.coverImage ? (
                        <img src={post.coverImage} alt="" className="w-full h-full object-contain rounded-xl" />
                      ) : (
                        <div className="w-full h-full bg-slate-100 rounded-xl flex items-center justify-center text-xl">✍️</div>
                     )}
                  </div>

                  {/* Title & Date */}
                  <div className="flex-1 min-w-0 pr-4">
                    <h3 className="font-bold text-[#1f2852] text-base leading-snug line-clamp-2 md:line-clamp-1 mb-1 group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-sm text-[#9095af] font-medium">
                      {formatDate(post.createdAt)}
                    </p>
                  </div>

                  {/* Stats (Mocked for Views/Earnings, real for likes if possible) */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-8 w-full sm:w-auto mt-2 sm:mt-0 px-2 sm:px-0 bg-white sm:bg-transparent py-3 sm:py-0 rounded-xl border border-slate-100 sm:border-transparent">
                    <div className="flex items-center gap-2 text-[#464c70] font-bold">
                      <Eye className="w-5 h-5 text-[#464c70]" />
                      {(index + 2) * 1.3}K
                    </div>
                    <div className="flex items-center gap-2 text-[#464c70] font-bold">
                      <ThumbsUp className="w-5 h-5 text-[#ee9e9c]" />
                      {post.likeCount || ((index + 1) * 0.8).toFixed(1) + "K"}
                    </div>
                    <div className="flex items-center gap-2 text-[#464c70] font-bold">
                      <div className="w-5 h-5 rounded border border-slate-300 flex items-center justify-center">
                        <DollarSign className="w-3.5 h-3.5 text-[#5e668c]" />
                      </div>
                      {(4 - index) * 12 + 10}
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-[#9095af] font-medium">No top articles found yet.</p>
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
