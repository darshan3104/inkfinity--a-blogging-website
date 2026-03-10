"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { PenLine, Menu, X, LogOut, LayoutDashboard } from "lucide-react";
export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const handleLogout = async () => {
    await logout();
    router.push("/");
  };
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/blogs", label: "Explore" },
  ];
  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/90 backdrop-blur-xl border-b border-slate-200/60 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)]" : "bg-transparent"}`}
    >
      {" "}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {" "}
        <div className="flex items-center justify-between h-16">
          {" "}
          {/* Logo */}{" "}
          <Link href="/" className="flex items-center gap-2 group">
            {" "}
            <div className="w-8 h-8 rounded-[10px] bg-slate-900 flex items-center justify-center shadow-md group-hover:shadow-slate-900/30 transition-all duration-300">
              {" "}
              <PenLine className="w-4 h-4 text-white" />{" "}
            </div>{" "}
            <span className="text-xl font-bold text-slate-900 tracking-tight">
              {" "}
              Inkfinity{" "}
            </span>{" "}
          </Link>{" "}
          {/* Desktop Nav */}{" "}
          <div className="hidden md:flex items-center gap-1">
            {" "}
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${pathname === link.href ? "text-slate-900 bg-slate-100/80" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"}`}
              >
                {" "}
                {link.icon && <link.icon className="w-3.5 h-3.5" />}{" "}
                {link.label}{" "}
              </Link>
            ))}{" "}
          </div>{" "}
          {/* Desktop Auth */}{" "}
          <div className="hidden md:flex items-center gap-3">
            {" "}
            {isAuthenticated ? (
              <>
                {" "}
                <Link href="/dashboard">
                  {" "}
                  <Button variant="outline" size="sm" className="gap-2">
                    {" "}
                    <LayoutDashboard className="w-4 h-4" /> Dashboard{" "}
                  </Button>{" "}
                </Link>{" "}
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  {" "}
                  <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold text-xs shadow-sm">
                    {" "}
                    {user?.name?.[0]?.toUpperCase() || "U"}{" "}
                  </div>{" "}
                </div>{" "}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="gap-2 text-rose-500 hover:text-rose-600 hover:bg-rose-50"
                >
                  {" "}
                  <LogOut className="w-4 h-4" /> Logout{" "}
                </Button>{" "}
              </>
            ) : (
              <>
                {" "}
                <Link href="/login">
                  {" "}
                  <Button variant="ghost" size="sm">
                    Log in
                  </Button>{" "}
                </Link>{" "}
                <Link href="/signup">
                  {" "}
                  <Button
                    size="sm"
                    className="gap-2 bg-slate-900 text-white hover:bg-slate-800 rounded-full px-5 shadow-sm transform hover:-translate-y-0.5 transition-all"
                  >
                    {" "}
                    <PenLine className="w-4 h-4" /> Start Writing{" "}
                  </Button>{" "}
                </Link>{" "}
              </>
            )}{" "}
          </div>{" "}
          {/* Mobile Menu Button */}{" "}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {" "}
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}{" "}
          </button>{" "}
        </div>{" "}
      </div>{" "}
      {/* Mobile Menu */}{" "}
      {mobileOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-lg">
          {" "}
          <div className="px-4 pt-2 pb-4 space-y-1">
            {" "}
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              >
                {" "}
                {link.label}{" "}
              </Link>
            ))}{" "}
            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              {" "}
              {isAuthenticated ? (
                <>
                  {" "}
                  <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                    {" "}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full gap-2"
                    >
                      {" "}
                      <LayoutDashboard className="w-4 h-4" /> Dashboard{" "}
                    </Button>{" "}
                  </Link>{" "}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="w-full gap-2 text-rose-500"
                  >
                    {" "}
                    <LogOut className="w-4 h-4" /> Logout{" "}
                  </Button>{" "}
                </>
              ) : (
                <>
                  {" "}
                  <Link href="/login" onClick={() => setMobileOpen(false)}>
                    {" "}
                    <Button variant="outline" size="sm" className="w-full">
                      Log in
                    </Button>{" "}
                  </Link>{" "}
                  <Link href="/signup" onClick={() => setMobileOpen(false)}>
                    {" "}
                    <Button
                      size="sm"
                      className="w-full gap-2 bg-slate-900 text-white hover:bg-slate-800 rounded-full shadow-sm"
                    >
                      {" "}
                      <PenLine className="w-4 h-4" /> Start Writing{" "}
                    </Button>{" "}
                  </Link>{" "}
                </>
              )}{" "}
            </div>{" "}
          </div>{" "}
        </div>
      )}{" "}
    </nav>
  );
}
