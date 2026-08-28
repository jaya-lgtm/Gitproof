"use client";

import { useState } from "react";
import Link from "next/link";
import { SearchForm } from "@/components/SearchForm";
import { ProfileCard } from "@/components/ProfileCard";
import { RepositoryList } from "@/components/RepositoryList";
import { ProofOfWorkCard } from "@/components/ProofOfWorkCard";
import { DevelopmentEvidenceSection } from "@/components/DevelopmentEvidenceSection";
import { GitHubUser, GitHubRepository, RawDevelopmentEvidence } from "@/lib/github";
import { AnalysisResult } from "@/lib/analysis";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<GitHubRepository[]>([]);
  const [evidences, setEvidences] = useState<RawDevelopmentEvidence[]>([]);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async (url: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.error || "Failed to fetch GitHub profile.");
        setUser(null);
        setRepos([]);
        setEvidences([]);
        setAnalysis(null);
      } else {
        setUser(data.user);
        setRepos(data.repos || []);
        setEvidences(data.evidences || []);
        setAnalysis(data.analysis || null);
      }
    } catch {
      setError("An unexpected network error occurred. Please try again.");
      setUser(null);
      setRepos([]);
      setEvidences([]);
      setAnalysis(null);
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

      {/* Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-black text-slate-950 text-base shadow-md shadow-emerald-500/20">
              GP
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-100">
              GitProof
            </span>
            <span className="px-2 py-0.5 text-[10px] uppercase font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800/60 rounded-full">
              MVP
            </span>
          </div>

          <nav className="flex items-center gap-4 text-xs font-medium">
            <Link
              href="/"
              className="text-emerald-400 font-semibold border-b-2 border-emerald-400 pb-0.5"
            >
              Single Analysis
            </Link>
            <Link
              href="/compare"
              className="text-slate-400 hover:text-slate-200 transition-colors"
            >
              Compare Profiles
            </Link>
            <Link
              href="/job-match"
              className="text-slate-400 hover:text-slate-200 transition-colors"
            >
              Job Match
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero & Content */}
      <div className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-12 space-y-12 relative z-10">
        {/* Hero Banner */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-100">
            Verifiable <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Proof of Work</span> from GitHub
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Convert real GitHub evidence into recruiter-friendly technical proof. Enter any public GitHub profile to get started.
          </p>

          {/* Workflow Pipeline */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs font-mono text-slate-400">
            <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">GitHub Profile</span>
            <span>→</span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">Repositories</span>
            <span>→</span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">Recent Development Evidence</span>
            <span>→</span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-emerald-400">AI Interpretation</span>
            <span>→</span>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-950 border border-emerald-800 text-emerald-300 font-bold">Recruiter Proof</span>
          </div>
        </div>

        {/* Input Form */}
        <SearchForm onSearch={handleAnalyze} isLoading={isLoading} />

        {/* Error Banner */}
        {error && (
          <div className="max-w-2xl mx-auto bg-rose-950/50 border border-rose-800/80 rounded-xl p-4 text-center text-rose-300 text-sm flex items-center justify-center gap-2 shadow-lg">
            <svg className="w-5 h-5 text-rose-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span>{error}</span>
          </div>
        )}

        {/* Profile and Repositories View */}
        {user && (
          <div className="space-y-12 animate-fade-in">
            {/* Profile Info */}
            <ProfileCard user={user} />

            {/* Proof of Work Section */}
            {analysis && analysis.cards.length > 0 && (
              <section className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
                      <span>Verifiable Proof of Work</span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono">
                        {analysis.cards.length} Cards
                      </span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Technical claims backed 100% by public GitHub activity and repository metadata
                    </p>
                  </div>

                  {/* Top languages overview pills */}
                  {analysis.topLanguages.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5">
                      {analysis.topLanguages.slice(0, 3).map((lang) => (
                        <span
                          key={lang.language}
                          className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300"
                        >
                          <span className="text-emerald-400 font-semibold">
                            {lang.language}
                          </span>{" "}
                          ({lang.percentage}%)
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {analysis.cards.map((card) => (
                    <ProofOfWorkCard key={card.id} card={card} />
                  ))}
                </div>
              </section>
            )}

            {/* Verified Development Evidence Section */}
            {evidences.length > 0 && (
              <DevelopmentEvidenceSection evidences={evidences} />
            )}

            {/* Repositories */}
            <RepositoryList repos={repos} />
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        GitProof &copy; {new Date().getFullYear()} — Evidence-based developer portfolio
      </footer>
    </main>
  );
}
