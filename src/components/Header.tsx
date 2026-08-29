"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export function Header() {
  const { user, isAuthenticated, logout, savedProofs } = useAuth();
  const pathname = usePathname();

  return (
    <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-black text-slate-950 text-base shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              GP
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-100 group-hover:text-emerald-400 transition-colors">
              GitProof
            </span>
          </Link>
          <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] uppercase font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800/60 rounded-full">
            MVP
          </span>
        </div>

        {/* Navigation & Auth Badge */}
        <div className="flex items-center gap-6">
          <nav className="flex items-center gap-4 text-xs font-medium">
            <Link
              href="/"
              className={`transition-colors ${
                pathname === "/"
                  ? "text-emerald-400 font-semibold border-b-2 border-emerald-400 pb-0.5"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Single Analysis
            </Link>
            <Link
              href="/compare"
              className={`transition-colors ${
                pathname === "/compare"
                  ? "text-emerald-400 font-semibold border-b-2 border-emerald-400 pb-0.5"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Compare Profiles
            </Link>
            <Link
              href="/job-match"
              className={`transition-colors ${
                pathname === "/job-match"
                  ? "text-emerald-400 font-semibold border-b-2 border-emerald-400 pb-0.5"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Job Match
            </Link>
            {savedProofs.length > 0 && (
              <Link
                href="/saved"
                className={`transition-colors flex items-center gap-1 ${
                  pathname === "/saved"
                    ? "text-emerald-400 font-semibold border-b-2 border-emerald-400 pb-0.5"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <span>Saved Proofs</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono">
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
                  className="w-7 h-7 rounded-lg border border-emerald-500/40 object-cover"
                />
                <span className="text-xs font-semibold text-slate-200 hidden md:inline-block">
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
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs text-emerald-400 font-semibold transition-all cursor-pointer"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
