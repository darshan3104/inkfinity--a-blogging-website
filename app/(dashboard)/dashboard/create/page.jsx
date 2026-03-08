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
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Create New Post</h1>
        <p className="text-sm text-slate-500 mt-1">Share your ideas with the world.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-base font-semibold text-slate-700">
              Post Title
            </Label>
            <Input
              id="title"
              type="text"
              placeholder="Enter a compelling title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
              className="h-12 text-lg font-medium"
            />
          </div>
        </div>

        {/* Cover Image */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <Label className="text-base font-semibold text-slate-700 mb-3 block">
            Cover Image <span className="text-slate-400 font-normal">(optional)</span>
          </Label>
          {coverPreview ? (
            <div className="relative">
              <img
                src={coverPreview}
                alt="Cover preview"
                className="w-full h-48 object-cover rounded-xl"
              />
              <button
                type="button"
                onClick={() => { setCoverImage(null); setCoverPreview(null); }}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-violet-400 hover:bg-violet-50 transition-all duration-200">
              <ImagePlus className="w-8 h-8 text-slate-300 mb-2" />
              <span className="text-sm text-slate-400">Click to upload (max 2MB)</span>
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

        {/* Rich Text Editor */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <Label className="text-base font-semibold text-slate-700 mb-3 block">Content</Label>
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            modules={QUILL_MODULES}
            placeholder="Start writing your story..."
            className="rounded-lg"
            readOnly={loading}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard")}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" variant="gradient" size="lg" className="gap-2" disabled={loading}>
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Publishing...</>
            ) : (
              <><Send className="w-4 h-4" /> Publish Post</>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
