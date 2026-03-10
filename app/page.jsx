"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import BlogCard from "@/components/BlogCard";
import { Button } from "@/components/ui/button";
import { postsApi } from "@/lib/api";
import {
  PenLine,
  ArrowRight,
  Activity,
  Users,
  Zap,
  MessageSquare,
  Sparkles,
  Globe,
  LayoutDashboard,
  Share2,
  Search,
  Settings,
  ChevronRight,
  TrendingUp,
  Shield,
} from "lucide-react";
import { motion } from "framer-motion";
export default function LandingPage() {
  const [featuredPosts, setFeaturedPosts] = useState([]);
  useEffect(() => {
    postsApi
      .getAll({ limit: 3, page: 1 })
      .then((res) => setFeaturedPosts(res.data.posts || []))
      .catch(() => {});
  }, []);
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-cyan-500/30 overflow-hidden font-sans">
      {" "}
      <Navbar /> {/* 1. Ultra-Premium Hero Section */}{" "}
      <section className="relative min-h-screen flex items-center justify-center pt-32 pb-20 overflow-hidden">
        {" "}
        {/* Animated Background Mesh */}{" "}
        <div className="absolute inset-0 bg-background" />{" "}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-60">
          {" "}
          <motion.div
            animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, -30, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-blue-400/20 blur-[120px]"
          />{" "}
          <motion.div
            animate={{ scale: [1, 1.1, 1], x: [0, -30, 0], y: [0, 40, 0] }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
            className="absolute -bottom-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-cyan-400/20 blur-[120px]"
          />{" "}
        </div>{" "}
        {/* Subtle grid and noise overlay */}{" "}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />{" "}
        <div className="absolute inset-0 opacity-[0.02].04] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />{" "}
        <div className="relative w-full max-w-7xl mx-auto px-6 grid xl:grid-cols-2 gap-16 items-center z-10">
          {" "}
          {/* Left Hero Content */}{" "}
          <div className="text-center xl:text-left flex flex-col items-center xl:items-start pt-10 xl:pt-0">
            {" "}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 border border-slate-200/50 shadow-sm backdrop-blur-md mb-8 hover:bg-white/80 transition-colors cursor-pointer"
            >
              {" "}
              <Sparkles className="w-4 h-4 text-cyan-500" />{" "}
              <span className="text-sm font-semibold text-slate-800 tracking-wide">
                Introducing Inkfinity 2.0
              </span>{" "}
              <ChevronRight className="w-4 h-4 text-slate-400" />{" "}
            </motion.div>{" "}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              className="text-5xl sm:text-6xl lg:text-[5.5rem] font-extrabold text-slate-900 leading-[1.05] tracking-tight mb-8"
            >
              {" "}
              Publishing, <br className="hidden xl:block" />{" "}
              <span className="relative inline-block mt-2">
                {" "}
                <span className="absolute -inset-1 rounded-lg bg-linear-to-r from-blue-600/30 to-cyan-500/30 blur-xl opacity-70"></span>{" "}
                <span className="relative bg-linear-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  {" "}
                  Perfected.{" "}
                </span>{" "}
              </span>{" "}
            </motion.h1>{" "}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="text-lg sm:text-xl text-slate-600 max-w-2xl text-center xl:text-left leading-relaxed mb-10 font-medium"
            >
              {" "}
              A beautifully crafted, high-performance platform for writers who
              care about the details. Engage your audience, track your growth,
              and own your content.{" "}
            </motion.p>{" "}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
            >
              {" "}
              <Link href="/signup" className="w-full sm:w-auto">
                {" "}
                <Button
                  size="lg"
                  className="w-full sm:w-auto relative group h-14 px-8 bg-slate-900 text-white hover:bg-slate-800 rounded-full overflow-hidden transition-all duration-300 transform hover:scale-[1.02] shadow-xl hover:shadow-cyan-500/20 border-0"
                >
                  {" "}
                  <span className="relative z-10 flex items-center font-bold text-base tracking-wide">
                    {" "}
                    Start Writing Now{" "}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />{" "}
                  </span>{" "}
                </Button>{" "}
              </Link>{" "}
              <Link href="/blogs" className="w-full sm:w-auto">
                {" "}
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto h-14 px-8 bg-white/50 backdrop-blur-md border-slate-200 hover:bg-white rounded-full font-bold text-base tracking-wide text-slate-700 transition-all duration-300 transform hover:scale-[1.02]"
                >
                  {" "}
                  Explore Platform{" "}
                </Button>{" "}
              </Link>{" "}
            </motion.div>{" "}
          </div>{" "}
          {/* Right Hero Visuals - Animated Dashboard Floaties */}{" "}
          <div className="w-full relative min-h-[600px] hidden xl:block perspective-1000 mt-10 xl:mt-0">
            {" "}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotateY: 15 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
              className="absolute inset-0"
            >
              {" "}
              {/* Central Post Editor Card */}{" "}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute top-20 left-4 right-16 rounded-[2rem] border border-slate-200/60 bg-white/80#0a0a0a]/90 backdrop-blur-2xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)](0,0,0,0.5)] overflow-hidden z-20"
              >
                {" "}
                <div className="h-12 border-b border-slate-200/60 flex items-center px-4 gap-2 bg-slate-50/50">
                  {" "}
                  <div className="flex gap-1.5">
                    {" "}
                    <div className="w-3 h-3 rounded-full bg-red-400" />{" "}
                    <div className="w-3 h-3 rounded-full bg-amber-400" />{" "}
                    <div className="w-3 h-3 rounded-full bg-emerald-400" />{" "}
                  </div>{" "}
                  <div className="mx-auto px-4 py-1 rounded-md bg-white border border-slate-200 text-xs font-medium text-slate-500 flex items-center gap-2 shadow-sm">
                    {" "}
                    <Globe className="w-3 h-3 text-cyan-500" />{" "}
                    inkfinity.dev/new{" "}
                  </div>{" "}
                </div>{" "}
                <div className="p-8">
                  {" "}
                  <div className="w-24 h-7 bg-blue-100 text-blue-700 text-xs font-bold tracking-wider uppercase rounded-full flex items-center justify-center mb-6">
                    Engineering
                  </div>{" "}
                  <h3 className="text-3xl font-extrabold mb-4 text-slate-900 leading-tight">
                    The Modern Publishing Stack
                  </h3>{" "}
                  <div className="space-y-4">
                    {" "}
                    <div className="h-3 bg-slate-100 rounded-full w-full" />{" "}
                    <div className="h-3 bg-slate-100 rounded-full w-5/6" />{" "}
                    <div className="h-3 bg-slate-100 rounded-full w-4/6" />{" "}
                  </div>{" "}
                  <div className="mt-10 pt-6 border-t border-slate-100 flex gap-4">
                    {" "}
                    <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white" />{" "}
                    <div className="w-10 h-10 rounded-full bg-slate-200 -ml-6 border-2 border-white" />{" "}
                    <div className="w-10 h-10 rounded-full bg-slate-200 -ml-6 border-2 border-white flex items-center justify-center text-xs font-bold text-slate-500">
                      +5
                    </div>{" "}
                  </div>{" "}
                </div>{" "}
              </motion.div>{" "}
              {/* Top Right Mini Stat Card */}{" "}
              <motion.div
                animate={{ y: [10, -10, 10] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
                className="absolute top-6 -right-4 w-[260px] rounded-2xl border border-slate-200/60 bg-white/90#111]/90 backdrop-blur-xl shadow-xl p-5 z-30 flex items-center gap-4"
              >
                {" "}
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center shadow-sm">
                  {" "}
                  <TrendingUp className="w-6 h-6 text-emerald-600" />{" "}
                </div>{" "}
                <div>
                  {" "}
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">
                    Monthly Views
                  </p>{" "}
                  <h4 className="text-2xl font-black text-slate-900">
                    1.4M
                    <span className="text-emerald-500 text-sm ml-2">↑ 24%</span>
                  </h4>{" "}
                </div>{" "}
              </motion.div>{" "}
              {/* Bottom Left Engagement Card */}{" "}
              <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{
                  duration: 7,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2,
                }}
                className="absolute bottom-6 left-10 w-[300px] rounded-3xl border border-slate-200/60 bg-white/90#111]/90 backdrop-blur-xl shadow-xl p-6 z-30"
              >
                {" "}
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
                  Audience Engagement
                </p>{" "}
                <div className="flex items-end justify-between gap-2 h-20">
                  {" "}
                  {[30, 50, 40, 70, 60, 90, 100].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 w-full bg-slate-100 rounded-t-md relative group"
                    >
                      {" "}
                      <div
                        className="absolute bottom-0 left-0 right-0 bg-blue-500 rounded-t-md transition-all duration-300 group-hover:bg-cyan-400 shadow-sm"
                        style={{ height: `${h}%` }}
                      />{" "}
                    </div>
                  ))}{" "}
                </div>{" "}
                <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {" "}
                  <span>Mon</span> <span>Sun</span>{" "}
                </div>{" "}
              </motion.div>{" "}
            </motion.div>{" "}
          </div>{" "}
        </div>{" "}
      </section>{" "}
      {/* 2. Premium Features Section */}{" "}
      <section className="py-32 px-6 relative overflow-hidden bg-slate-50/50 border-y border-slate-200/50">
        {" "}
        <div className="max-w-7xl mx-auto relative z-10">
          {" "}
          <div className="text-center max-w-3xl mx-auto mb-20">
            {" "}
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-slate-900 tracking-tight">
              Focus on writing. <br className="hidden sm:block" /> We handle the{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-cyan-500">
                rest.
              </span>
            </h2>{" "}
            <p className="text-lg text-slate-600 font-medium">
              Professional-grade tools packaged in an incredibly intuitive
              interface.
            </p>{" "}
          </div>{" "}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {" "}
            {[
              {
                title: "Distraction-Free Editor",
                desc: "A beautifully clean writing surface that helps your ideas flow seamlessly. Markdown completely supported.",
                icon: PenLine,
              },
              {
                title: "Rich Analytics",
                desc: "Gain deep insights into your readers. Track views, engagement time, and traffic sources in real-time.",
                icon: LayoutDashboard,
              },
              {
                title: "Built for SEO",
                desc: "Automatically optimized for search engines with auto-generated sitemaps, meta tags, and structured data.",
                icon: Search,
              },
              {
                title: "Team Collaboration",
                desc: "Invite co-authors and editors. Real-time drafting and permissions make teamwork an absolute breeze.",
                icon: Users,
              },
              {
                title: "Lightning Fast Edge",
                desc: "Built on a modern Edge network ensuring your articles load instantly for readers anywhere on the globe.",
                icon: Zap,
              },
              {
                title: "Community Features",
                desc: "Built-in commenting system, reactions, and follower notifications to keep your audience engaged.",
                icon: MessageSquare,
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group relative p-8 rounded-[2rem] bg-white.02] border border-slate-200/80 hover:border-slate-300 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1"
              >
                {" "}
                {/* Hover gradient background effect */}{" "}
                <div className="absolute inset-0 rounded-[2rem] bg-linear-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />{" "}
                <div className="relative z-10">
                  {" "}
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm border border-slate-100">
                    {" "}
                    <feature.icon className="w-6 h-6" />{" "}
                  </div>{" "}
                  <h3 className="text-xl font-bold mb-3 text-slate-900 tracking-wide">
                    {feature.title}
                  </h3>{" "}
                  <p className="text-slate-600 leading-relaxed font-medium">
                    {feature.desc}
                  </p>{" "}
                </div>{" "}
              </motion.div>
            ))}{" "}
          </div>{" "}
        </div>{" "}
      </section>{" "}
      {/* 3. Deep Metric Insights Section */}{" "}
      <section className="py-32 px-6 bg-[#0a0a0a] relative overflow-hidden text-white">
        {" "}
        {/* Dark aesthetic background with glow */}{" "}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] pointer-events-none" />{" "}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none" />{" "}
        <div className="max-w-7xl mx-auto relative z-10">
          {" "}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {" "}
            <div>
              {" "}
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-white tracking-tight">
                Trusted by a growing network of creators
              </h2>{" "}
              <p className="text-lg text-slate-400 mb-10 max-w-md font-medium leading-relaxed">
                Our infrastructure effortlessly scales with your ambition,
                delivering content to millions without breaking a single sweat.
              </p>{" "}
              <div className="space-y-8">
                {" "}
                <div className="flex items-start gap-4">
                  {" "}
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                    {" "}
                    <Globe className="w-5 h-5 text-cyan-400" />{" "}
                  </div>{" "}
                  <div>
                    {" "}
                    <h4 className="text-white font-bold text-lg">
                      Global Edge Delivery
                    </h4>{" "}
                    <p className="text-slate-400 font-medium mt-1 leading-relaxed">
                      Your content is served instantly from over 100+ edge
                      locations worldwide.
                    </p>{" "}
                  </div>{" "}
                </div>{" "}
                <div className="flex items-start gap-4">
                  {" "}
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                    {" "}
                    <Shield className="w-5 h-5 text-purple-400" />{" "}
                  </div>{" "}
                  <div>
                    {" "}
                    <h4 className="text-white font-bold text-lg">
                      Enterprise Security
                    </h4>{" "}
                    <p className="text-slate-400 font-medium mt-1 leading-relaxed">
                      Bank-level encryption, multi-layered DDoS protection and
                      automatic SSL.
                    </p>{" "}
                  </div>{" "}
                </div>{" "}
              </div>{" "}
            </div>{" "}
            <div className="grid grid-cols-2 gap-6">
              {" "}
              {[
                {
                  label: "Active Writers",
                  value: "24.5K",
                  glow: "hover:shadow-cyan-500/20",
                },
                {
                  label: "Articles Read",
                  value: "1.2M",
                  glow: "hover:shadow-blue-500/20",
                },
                {
                  label: "Monthly Visits",
                  value: "8.4M",
                  glow: "hover:shadow-purple-500/20",
                },
                {
                  label: "Uptime SLA",
                  value: "99.99%",
                  glow: "hover:shadow-emerald-500/20",
                },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className={`p-8 rounded-[2rem] bg-white/5 border border-white/10 flex flex-col items-center justify-center text-center hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 ${stat.glow}`}
                >
                  {" "}
                  <div className="text-4xl lg:text-5xl font-black text-white mb-2 tracking-tight">
                    {stat.value}
                  </div>{" "}
                  <div className="text-sm text-slate-400 font-bold uppercase tracking-wider">
                    {stat.label}
                  </div>{" "}
                </motion.div>
              ))}{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </section>{" "}
      {/* 4. Showcase Section */}{" "}
      {featuredPosts.length > 0 && (
        <section className="py-32 px-6 bg-background relative overflow-hidden">
          {" "}
          <div className="max-w-7xl mx-auto relative z-10">
            {" "}
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-6">
              {" "}
              <div className="max-w-2xl">
                {" "}
                <div className="flex items-center gap-2 text-cyan-600 font-bold uppercase tracking-widest text-sm mb-4">
                  {" "}
                  <Activity className="w-4 h-4" /> Discover Content{" "}
                </div>{" "}
                <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
                  Read top stories this week
                </h2>{" "}
                <p className="text-slate-600 text-lg font-medium">
                  Explore some of the most engaging stories and insights
                  published by our community.
                </p>{" "}
              </div>{" "}
              <Link
                href="/blogs"
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-slate-100 border border-slate-200 text-sm font-bold text-slate-800 hover:bg-slate-200 transition-all group"
              >
                {" "}
                View all articles{" "}
                <ArrowRight className="w-4 h-4 group-hover:rotate-[-45deg] transition-transform" />{" "}
              </Link>{" "}
            </div>{" "}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {" "}
              {featuredPosts.map((post) => (
                <div
                  key={post._id}
                  className="hover:-translate-y-2 transition-transform duration-300"
                >
                  {" "}
                  <BlogCard post={post} />{" "}
                </div>
              ))}{" "}
            </div>{" "}
          </div>{" "}
        </section>
      )}{" "}
      {/* 5. Final CTA Section */}{" "}
      <section className="py-24 px-6 relative overflow-hidden bg-background">
        {" "}
        <div className="max-w-7xl mx-auto rounded-[3rem] bg-slate-900#0f0f0f] border border-slate-800 relative overflow-hidden shadow-2xl">
          {" "}
          {/* Glassmorphism overlays */}{" "}
          <div className="absolute top-0 right-1/4 w-[600px] h-[600px] rounded-full bg-blue-500/20 blur-[120px] mix-blend-screen pointer-events-none" />{" "}
          <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] rounded-full bg-cyan-500/20 blur-[120px] mix-blend-screen pointer-events-none" />{" "}
          <div className="relative w-full h-full flex flex-col items-center justify-center text-center px-6 py-32 z-10">
            {" "}
            <h2 className="text-5xl md:text-6xl font-extrabold text-white mb-8 tracking-tight">
              Ready to share your voice?
            </h2>{" "}
            <p className="text-slate-300 text-xl mb-12 max-w-2xl font-medium leading-relaxed">
              {" "}
              Join thousands of independent creators to build your audience on a
              platform explicitly designed for modern publishing.{" "}
            </p>{" "}
            <div className="flex flex-col sm:flex-row gap-4">
              {" "}
              <Link href="/signup">
                {" "}
                <Button
                  size="lg"
                  className="bg-white text-black hover:bg-slate-200 h-16 px-12 text-lg font-bold shadow-xl rounded-full w-full sm:w-auto transform hover:scale-105 transition-all"
                >
                  {" "}
                  Get Started for Free{" "}
                </Button>{" "}
              </Link>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </section>{" "}
      {/* Footer */}{" "}
      <footer className="bg-background py-16 px-6 border-t border-slate-200">
        {" "}
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          {" "}
          <div className="flex items-center gap-3">
            {" "}
            <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center shadow-lg">
              {" "}
              <PenLine className="w-5 h-5 text-white" />{" "}
            </div>{" "}
            <span className="text-slate-900 font-extrabold text-xl tracking-tight">
              Inkfinity
            </span>{" "}
          </div>{" "}
          <p className="text-sm text-slate-500 font-medium">
            © {new Date().getFullYear()} Inkfinity Inc. All rights reserved.
          </p>{" "}
          <div className="flex gap-8 text-sm font-bold text-slate-600">
            {" "}
            <Link
              href="/blogs"
              className="hover:text-slate-900 transition-colors"
            >
              Explore
            </Link>{" "}
            <Link
              href="/signup"
              className="hover:text-slate-900 transition-colors"
            >
              Sign Up
            </Link>{" "}
            <Link
              href="/login"
              className="hover:text-slate-900 transition-colors"
            >
              Log In
            </Link>{" "}
          </div>{" "}
        </div>{" "}
      </footer>{" "}
    </div>
  );
}
