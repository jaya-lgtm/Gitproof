"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export function Header() {
  const { user, isAuthenticated, logout, savedProofs } = useAuth();
  const pathname = usePathname();

  return (
    <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center font-black text-white text-sm shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
              GP
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-100 group-hover:text-blue-400 transition-colors">
              GitProof
            </span>
          </Link>
          <span className="hidden sm:inline-block px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-semibold bg-blue-950/60 text-blue-400 border border-blue-800/50 rounded-full font-mono">
            Verified Proof
          </span>
        </div>

        {/* Navigation & Auth Badge */}
        <div className="flex items-center gap-6">
          <nav className="flex items-center gap-2 sm:gap-4 text-xs font-medium">
            <Link
              href="/"
              className={`px-3 py-1.5 rounded-lg transition-all ${
                pathname === "/"
                  ? "bg-slate-900 text-blue-400 border border-blue-500/30 font-semibold"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
              }`}
            >
              Single Analysis
            </Link>
            <Link
              href="/compare"
              className={`px-3 py-1.5 rounded-lg transition-all ${
                pathname === "/compare"
                  ? "bg-slate-900 text-blue-400 border border-blue-500/30 font-semibold"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
              }`}
            >
              Compare
            </Link>
            <Link
              href="/job-match"
              className={`px-3 py-1.5 rounded-lg transition-all ${
                pathname === "/job-match"
                  ? "bg-slate-900 text-blue-400 border border-blue-500/30 font-semibold"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
              }`}
            >
              Job Match
            </Link>
            {savedProofs.length > 0 && (
              <Link
                href="/saved"
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  pathname === "/saved"
                    ? "bg-slate-900 text-blue-400 border border-blue-500/30 font-semibold"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
                }`}
              >
                <span>Saved</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-blue-950 text-blue-400 border border-blue-800/80 font-mono">
                  {savedProofs.length}
                </span>
              </Link>
            )}
          </nav>

          {/* User Auth Badge / Login Button */}
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3 pl-4 border-l border-slate-800">
              <div className="flex items-center gap-2">
                <img
                  src={user.avatar_url}
                  alt={user.login}
                  className="w-7 h-7 rounded-lg border border-blue-500/40 object-cover"
                />
                <span className="text-xs font-semibold text-slate-200 hidden md:inline-block font-mono">
                  @{user.login}
                </span>
              </div>
              <button
                onClick={logout}
                className="text-xs text-slate-400 hover:text-rose-400 transition-colors cursor-pointer font-mono"
                title="Sign Out"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs text-blue-400 font-semibold transition-all cursor-pointer"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
