"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
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
    <main className="min-h-screen bg-[#020617] text-slate-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white relative overflow-hidden">
      {/* Background Glow Accents */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-[32rem] h-[30rem] bg-blue-600/10 rounded-full blur-[130px]"></div>
        <div className="absolute top-1/3 -right-40 w-[32rem] h-[30rem] bg-violet-600/10 rounded-full blur-[130px]"></div>
      </div>

      <Header />

      {/* Hero & Content */}
      <div className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-12 space-y-12 relative z-10">
        {/* Hero Banner */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-100 leading-tight">
            Turn GitHub Activity Into{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-violet-400">
              Proof of Work
            </span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            GitProof analyzes real GitHub repositories, commits, pull requests, issues, source code, manifests, and project evidence to generate recruiter-friendly technical proof of work.
          </p>
        </div>

        {/* Input Form */}
        <SearchForm onSearch={handleAnalyze} isLoading={isLoading} />

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800/90 text-xs font-medium text-slate-300 flex items-center gap-1.5 shadow-sm">
            <span className="text-emerald-400 font-bold">✓</span> Real GitHub Data
          </div>
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800/90 text-xs font-medium text-slate-300 flex items-center gap-1.5 shadow-sm">
            <span className="text-blue-400 font-bold">✓</span> Repository Analysis
          </div>
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800/90 text-xs font-medium text-slate-300 flex items-center gap-1.5 shadow-sm">
            <span className="text-violet-400 font-bold">✓</span> Source Code Evidence
          </div>
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800/90 text-xs font-medium text-slate-300 flex items-center gap-1.5 shadow-sm">
            <span className="text-emerald-400 font-bold">✓</span> Verifiable Proof
          </div>
        </div>

        {/* Visual Workflow Pipeline */}
        <div className="p-6 rounded-2xl glass-card space-y-3">
          <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider font-mono block text-center">
            Evidence Translation Engine Workflow
          </span>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-center space-y-1">
              <span className="block font-bold text-slate-200">1. GitHub Profile</span>
              <span className="text-[10px] text-slate-500 font-sans block">Public Repos & Activity</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-center space-y-1">
              <span className="block font-bold text-blue-400">2. Repo Analysis</span>
              <span className="text-[10px] text-slate-500 font-sans block">Manifests & Code Tree</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-center space-y-1">
              <span className="block font-bold text-violet-400">3. Real Evidence</span>
              <span className="text-[10px] text-slate-500 font-sans block">PRs, Commits & Issues</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/80 border border-blue-500/30 text-center space-y-1">
              <span className="block font-bold text-emerald-400">4. Proof of Work</span>
              <span className="text-[10px] text-slate-500 font-sans block">Recruiter-Friendly Cards</span>
            </div>
          </div>
        </div>

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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <h2 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2.5">
                      <span>Verifiable Proof of Work</span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 font-mono">
                        {analysis.cards.length} Cards Verified
                      </span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Developer insights generated directly from real public GitHub data and backed by inspectable repository evidence
                    </p>
                  </div>

                  {/* Top Languages Breakdown Bar */}
                  {analysis.topLanguages.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2">
                      {analysis.topLanguages.slice(0, 4).map((lang) => (
                        <div
                          key={lang.language}
                          className="px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800/90 text-xs font-mono text-slate-300 flex items-center gap-2 shadow-sm"
                        >
                          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                          <span className="text-blue-400 font-bold">{lang.language}</span>
                          <span className="text-slate-500 font-semibold">{lang.percentage}%</span>
                        </div>
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
      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500 font-mono">
        GitProof &copy; {new Date().getFullYear()} — Evidence-based developer portfolio
      </footer>
    </main>
  );
}
