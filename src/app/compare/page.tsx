"use client";

import { useState } from "react";
import Link from "next/link";
import { CompareSearchForm } from "@/components/CompareSearchForm";
import { CompareView, ProfileData } from "@/components/CompareView";

export default function ComparePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [comparisonData, setComparisonData] = useState<{
    profile1: ProfileData;
    profile2: ProfileData;
  } | null>(null);

  const handleCompare = async (url1: string, url2: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/compare", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url1, url2 }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.error || "Failed to compare GitHub profiles.");
        setComparisonData(null);
      } else {
        setComparisonData({
          profile1: data.profile1,
          profile2: data.profile2,
        });
      }
    } catch {
      setError("An unexpected network error occurred. Please try again.");
      setComparisonData(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Background Accent Gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Header with Navigation */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-black text-slate-950 text-base shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                GP
              </div>
              <span className="font-bold text-lg tracking-tight text-slate-100 group-hover:text-emerald-400 transition-colors">
                GitProof
              </span>
            </Link>
            <span className="px-2 py-0.5 text-[10px] uppercase font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800/60 rounded-full">
              Compare Mode
            </span>
          </div>

          <nav className="flex items-center gap-4 text-xs font-medium">
            <Link
              href="/"
              className="text-slate-400 hover:text-slate-200 transition-colors"
            >
              Single Analysis
            </Link>
            <Link
              href="/compare"
              className="text-emerald-400 font-semibold border-b-2 border-emerald-400 pb-0.5"
            >
              Compare Profiles
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero & Comparison Form */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-12 space-y-12 relative z-10">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-100">
            Compare <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">GitHub Developers</span> Side-by-Side
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Neutral, evidence-based comparison of public repositories, tech stacks, and development activity. Zero subjective rankings or AI fabrications.
          </p>
        </div>

        <CompareSearchForm onCompare={handleCompare} isLoading={isLoading} />

        {/* Error Banner */}
        {error && (
          <div className="max-w-2xl mx-auto bg-rose-950/50 border border-rose-800/80 rounded-xl p-4 text-center text-rose-300 text-sm flex items-center justify-center gap-2 shadow-lg">
            <svg className="w-5 h-5 text-rose-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span>{error}</span>
          </div>
        )}

        {/* Comparison Results */}
        {comparisonData && (
          <CompareView
            profile1={comparisonData.profile1}
            profile2={comparisonData.profile2}
          />
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        GitProof &copy; {new Date().getFullYear()} — Evidence-based developer portfolio comparison
      </footer>
    </main>
  );
}
