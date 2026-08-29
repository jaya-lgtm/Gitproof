"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
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
    <main className="min-h-screen bg-[#020617] text-slate-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white relative overflow-hidden">
      {/* Background Accent Gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-[30rem] h-[30rem] bg-blue-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute top-1/3 -right-40 w-[30rem] h-[30rem] bg-violet-600/10 rounded-full blur-[120px]"></div>
      </div>

      <Header />

      {/* Hero & Comparison Form */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-12 space-y-12 relative z-10">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-100">
            Compare <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-violet-400">GitHub Developers</span> Side-by-Side
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
      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500 font-mono">
        GitProof &copy; {new Date().getFullYear()} — Evidence-based developer portfolio comparison
      </footer>
    </main>
  );
}
