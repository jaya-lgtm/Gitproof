"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export function Header() {
  const { user, isAuthenticated, logout, savedProofs } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Analyze", href: "/" },
    { label: "Compare", href: "/compare" },
    { label: "Job Match", href: "/job-match" },
    {
      label: "Saved Proofs",
      href: "/saved",
      badgeCount: savedProofs.length,
    },
  ];

  return (
    <header className="border-b border-slate-800/80 bg-[#020617]/85 backdrop-blur-2xl sticky top-0 z-50 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center font-black text-white text-base shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
              GP
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-slate-100 group-hover:text-blue-400 transition-colors">
                  GitProof
                </span>
                <span className="px-2 py-0.5 text-[9px] uppercase tracking-wider font-semibold bg-blue-950/80 text-blue-400 border border-blue-800/60 rounded-full font-mono">
                  Verified
                </span>
              </div>
              <span className="text-[10px] text-slate-500 hidden lg:inline-block tracking-tight font-sans">
                Turn GitHub activity into verifiable proof of work
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/60 border border-slate-800/80">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                  isActive
                    ? "bg-slate-900 text-blue-400 border border-blue-500/30 font-semibold shadow-sm shadow-blue-500/10"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"
                }`}
              >
                <span>{item.label}</span>
                {item.badgeCount !== undefined && item.badgeCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-blue-950 text-blue-400 border border-blue-800 font-mono">
                    {item.badgeCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Auth Badge / Login Button (Desktop) */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3 pl-3 pr-2 py-1 rounded-xl bg-slate-900/80 border border-slate-800/90 shadow-sm">
              <div className="flex items-center gap-2">
                <img
                  src={user.avatar_url}
                  alt={user.login}
                  className="w-7 h-7 rounded-lg border border-blue-500/40 object-cover"
                />
                <span className="text-xs font-semibold text-slate-200 font-mono">
                  @{user.login}
                </span>
              </div>
              <button
                onClick={logout}
                className="text-xs text-slate-400 hover:text-rose-400 transition-colors cursor-pointer font-mono pl-2 border-l border-slate-800"
                title="Sign Out"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-slate-100 transition-colors cursor-pointer"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          )}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-[#020617] px-4 py-4 space-y-3 animate-fade-in shadow-2xl">
          <nav className="flex flex-col gap-1.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                    isActive
                      ? "bg-slate-900 text-blue-400 border border-blue-500/30 font-semibold"
                      : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/60"
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badgeCount !== undefined && item.badgeCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-blue-950 text-blue-400 border border-blue-800 font-mono">
                      {item.badgeCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            {isAuthenticated && user ? (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <img
                    src={user.avatar_url}
                    alt={user.login}
                    className="w-8 h-8 rounded-lg border border-blue-500/40 object-cover"
                  />
                  <span className="text-xs font-semibold text-slate-200 font-mono">
                    @{user.login}
                  </span>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs text-rose-400 font-mono"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-semibold text-center block shadow-md"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
