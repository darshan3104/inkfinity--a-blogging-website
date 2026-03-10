"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { postsApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImagePlus, Loader2, Send, X } from "lucide-react";
import toast from "react-hot-toast";

// Dynamically import react-quill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";

const QUILL_MODULES = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["blockquote", "code-block"],
    ["link", "image"],
    ["clean"],
  ],
};

export default function CreatePostPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      return toast.error("Image must be less than 2MB.");
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setCoverImage(reader.result);
      setCoverPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return toast.error("Title is required.");
    if (!content || content === "<p><br></p>") return toast.error("Content is required.");

    setLoading(true);
    try {
      await postsApi.create({ title, content, coverImage });
      toast.success("Post published successfully! 🎉");
      router.push("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to publish post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto xl:px-8 py-6">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#0B1527] tracking-tight">Create New Post</h1>
          <p className="text-base text-slate-500 mt-2">Share your ideas with the world.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* Left Column (Title & Image) */}
        <div className="w-full lg:w-[320px] shrink-0 flex flex-col gap-6">
          
          {/* Title */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)]">
            <div className="space-y-3">
              <Label htmlFor="title" className="text-sm font-semibold text-slate-600 block">
                Post Title
              </Label>
              <Input
                id="title"
                type="text"
                placeholder="Enter a compelling title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={loading}
                className="h-12 text-base rounded-xl bg-white border-slate-200 text-slate-900 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all duration-200"
              />
            </div>
          </div>

          {/* Cover Image */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)]">
            <Label className="text-sm font-semibold text-slate-600 mb-4 block">
              Cover Image <span className="text-slate-400 font-normal">(optional)</span>
            </Label>
            {coverPreview ? (
              <div className="relative">
                <img
                  src={coverPreview}
                  alt="Cover preview"
                  className="w-full h-48 object-cover rounded-2xl border border-slate-200/50"
                />
                <button
                  type="button"
                  onClick={() => { setCoverImage(null); setCoverPreview(null); }}
                  className="absolute top-3 right-3 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-all shadow-md"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center h-48 border border-dashed border-slate-300 rounded-2xl cursor-pointer hover:border-blue-500 bg-slate-50/50 hover:bg-blue-50 transition-all duration-200 group">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3 group-hover:bg-blue-100 transition-colors">
                  <ImagePlus className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                </div>
                <span className="text-xs font-medium text-slate-500 text-center px-4">Click to upload (max 2MB)</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={loading}
                />
              </label>
            )}
          </div>
        </div>

        {/* Right Column (Content Editor & Actions) */}
        <div className="w-full flex-1 flex flex-col gap-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)] flex flex-col min-h-[500px]">
            <Label className="text-sm font-semibold text-slate-600 mb-4 block">Content</Label>
            <div className="prose-container flex-1 flex flex-col">
              <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                modules={QUILL_MODULES}
                placeholder="Start writing your story..."
                className="rounded-xl flex-1 flex flex-col border border-slate-100 overflow-hidden"
                readOnly={loading}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 justify-end">
            <Button
              type="button"
              className="bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 h-12 px-6 rounded-xl text-sm font-semibold shadow-sm"
              onClick={() => router.push("/dashboard")}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="h-12 px-8 rounded-xl bg-[#1d4ed8] hover:bg-[#1e40af] text-white border-0 font-semibold text-sm transition-transform active:scale-[0.98] gap-2 shadow-md shadow-blue-500/20" 
              disabled={loading}
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Publishing...</>
              ) : (
                <><Send className="w-4 h-4 -rotate-45" /> Publish Post</>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
