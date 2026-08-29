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
    <main className="min-h-screen bg-[#080A0F] text-zinc-100 flex flex-col font-sans selection:bg-[#C8FF4A] selection:text-[#080A0F] relative overflow-hidden">
      <Header />

      {/* Main Content Area */}
      <div className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-12 space-y-10 relative z-10">
        {/* Eyebrow & Main Hero Heading */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-[11px] uppercase font-mono font-bold text-[#C8FF4A] tracking-widest bg-[#C8FF4A]/10 px-2.5 py-1 rounded border border-[#C8FF4A]/20">
            PUBLIC GITHUB INTELLIGENCE
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-zinc-100 leading-tight">
            Your GitHub. <br className="hidden sm:inline" />
            <span className="text-[#C8FF4A]">Verified as Proof.</span>
          </h1>

          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed font-sans max-w-2xl mx-auto">
            GitProof analyzes real repositories, source code, commits, pull requests, and project evidence to reveal what you have actually built.
          </p>
        </div>

        {/* Central Search Command Console */}
        <SearchForm onSearch={handleAnalyze} isLoading={isLoading} />

        {/* Compact Status/Trust Line */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-zinc-400 pt-1">
          <span className="flex items-center gap-1.5 text-[#34D399]">
            <span className="font-bold">✓</span> Public GitHub data only
          </span>
          <span className="text-zinc-600">•</span>
          <span className="flex items-center gap-1.5 text-[#38BDF8]">
            <span className="font-bold">✓</span> Source-grounded analysis
          </span>
          <span className="text-zinc-600">•</span>
          <span className="flex items-center gap-1.5 text-[#C8FF4A]">
            <span className="font-bold">✓</span> No fabricated claims
          </span>
        </div>

        {/* System Status Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono pt-2">
          <div className="p-3 rounded-xl bg-[#0D1017] border border-[#1F2432] space-y-1">
            <span className="text-[10px] text-zinc-500 block uppercase">DATA SOURCE</span>
            <span className="font-bold text-zinc-200 block">GitHub Public API</span>
          </div>
          <div className="p-3 rounded-xl bg-[#0D1017] border border-[#1F2432] space-y-1">
            <span className="text-[10px] text-zinc-500 block uppercase">REPOSITORY DEPTH</span>
            <span className="font-bold text-[#38BDF8] block">Code + Manifests</span>
          </div>
          <div className="p-3 rounded-xl bg-[#0D1017] border border-[#1F2432] space-y-1">
            <span className="text-[10px] text-zinc-500 block uppercase">EVIDENCE</span>
            <span className="font-bold text-[#A78BFA] block">Commits + PRs + Issues</span>
          </div>
          <div className="p-3 rounded-xl bg-[#0D1017] border border-[#1F2432] space-y-1">
            <span className="text-[10px] text-zinc-500 block uppercase">OUTPUT</span>
            <span className="font-bold text-[#C8FF4A] block">Verified Proof</span>
          </div>
        </div>

        {/* Connected Evidence Pipeline Workflow */}
        <div className="p-6 rounded-2xl bg-[#0D1017] border border-[#1F2432] space-y-4">
          <div className="flex items-center justify-between border-b border-[#1F2432] pb-3">
            <span className="text-xs uppercase font-bold text-zinc-400 font-mono">
              EVIDENCE PIPELINE WORKFLOW
            </span>
            <span className="text-[10px] font-mono text-[#C8FF4A]">Automated Analysis</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-[#11151F] border border-[#1F2432] space-y-2 relative">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-zinc-500">01</span>
                <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              </div>
              <h3 className="text-sm font-bold text-zinc-100">GitHub Profile</h3>
              <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                Connect public profile handles and repository history.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#11151F] border border-[#1F2432] space-y-2 relative">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#38BDF8]">02</span>
                <svg className="w-4 h-4 text-[#38BDF8]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
              </div>
              <h3 className="text-sm font-bold text-zinc-100">Repository Inspection</h3>
              <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                Parse READMEs, dependency manifests, and source trees.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#11151F] border border-[#1F2432] space-y-2 relative">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#A78BFA]">03</span>
                <svg className="w-4 h-4 text-[#A78BFA]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <h3 className="text-sm font-bold text-zinc-100">Evidence Extraction</h3>
              <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                Extract verified commits, PRs, issues, and tech stack points.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#11151F] border border-[#C8FF4A]/40 space-y-2 relative">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#C8FF4A]">04</span>
                <svg className="w-4 h-4 text-[#C8FF4A]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path></svg>
              </div>
              <h3 className="text-sm font-bold text-zinc-100">Proof Generation</h3>
              <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                Produce recruiter-friendly, source-grounded proof cards.
              </p>
            </div>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="max-w-2xl mx-auto bg-rose-950/50 border border-rose-800/80 rounded-xl p-4 text-center text-rose-300 text-sm flex items-center justify-center gap-2 shadow-lg font-sans">
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1F2432] pb-4">
                  <div>
                    <h2 className="text-2xl font-extrabold text-zinc-100 flex items-center gap-2.5">
                      <span>Verifiable Proof of Work</span>
                      <span className="px-2.5 py-0.5 rounded text-xs badge-emerald font-mono">
                        {analysis.cards.length} Cards Verified
                      </span>
                    </h2>
                    <p className="text-xs text-zinc-400 mt-1 font-sans">
                      Developer insights generated directly from real public GitHub data and backed by inspectable repository evidence
                    </p>
                  </div>

                  {/* Top Languages Breakdown Bar */}
                  {analysis.topLanguages.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2">
                      {analysis.topLanguages.slice(0, 4).map((lang) => (
                        <div
                          key={lang.language}
                          className="px-3 py-1.5 rounded bg-[#0D1017] border border-[#1F2432] text-xs font-mono text-zinc-300 flex items-center gap-2 shadow-sm"
                        >
                          <span className="w-2 h-2 rounded-full bg-[#38BDF8]"></span>
                          <span className="text-[#38BDF8] font-bold">{lang.language}</span>
                          <span className="text-zinc-500 font-semibold">{lang.percentage}%</span>
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
      <footer className="border-t border-[#1F2432] py-6 text-center text-xs text-zinc-500 font-mono">
        GitProof &copy; {new Date().getFullYear()} — Source-Grounded Developer Intelligence
      </footer>
    </main>
  );
}
