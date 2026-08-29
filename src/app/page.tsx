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
    <main className="min-h-screen bg-[#0D0F10] text-[#F5F2ED] flex flex-col font-sans selection:bg-[#F9732F] selection:text-[#0D0F10] relative overflow-hidden">
      <Header />

      {/* Main Content Area */}
      <div className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-12 space-y-10 relative z-10">
        {/* Eyebrow & Main Hero Heading */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-[11px] uppercase font-mono font-bold text-[#F9732F] tracking-widest bg-[#F9732F]/10 px-2.5 py-1 rounded border border-[#F9732F]/20">
            PUBLIC GITHUB INTELLIGENCE
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#F5F2ED] leading-tight">
            Your GitHub. <br className="hidden sm:inline" />
            <span className="text-[#F9732F]">Verified as Proof.</span>
          </h1>

          <p className="text-[#9CA3AF] text-sm sm:text-base leading-relaxed font-sans max-w-2xl mx-auto">
            GitProof analyzes real repositories, source code, commits, pull requests, and project evidence to reveal what you have actually built.
          </p>
        </div>

        {/* Central Search Command Console */}
        <SearchForm onSearch={handleAnalyze} isLoading={isLoading} />

        {/* Compact Status/Trust Line */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-[#9CA3AF] pt-1">
          <span className="flex items-center gap-1.5 text-[#4ADE80]">
            <span className="font-bold">✓</span> Public GitHub data only
          </span>
          <span className="text-[#2A2D30]">•</span>
          <span className="flex items-center gap-1.5 text-[#F5F2ED]">
            <span className="font-bold">✓</span> Source-grounded analysis
          </span>
          <span className="text-[#2A2D30]">•</span>
          <span className="flex items-center gap-1.5 text-[#F9732F]">
            <span className="font-bold">✓</span> No fabricated claims
          </span>
        </div>

        {/* System Status Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono pt-2">
          <div className="p-3 rounded-xl bg-[#151719] border border-[#2A2D30] space-y-1">
            <span className="text-[10px] text-[#6B7280] block uppercase">DATA SOURCE</span>
            <span className="font-bold text-[#F5F2ED] block">GitHub Public API</span>
          </div>
          <div className="p-3 rounded-xl bg-[#151719] border border-[#2A2D30] space-y-1">
            <span className="text-[10px] text-[#6B7280] block uppercase">REPOSITORY DEPTH</span>
            <span className="font-bold text-[#F5F2ED] block">Code + Manifests</span>
          </div>
          <div className="p-3 rounded-xl bg-[#151719] border border-[#2A2D30] space-y-1">
            <span className="text-[10px] text-[#6B7280] block uppercase">EVIDENCE</span>
            <span className="font-bold text-[#F9732F] block">Commits + PRs + Issues</span>
          </div>
          <div className="p-3 rounded-xl bg-[#151719] border border-[#2A2D30] space-y-1">
            <span className="text-[10px] text-[#6B7280] block uppercase">OUTPUT</span>
            <span className="font-bold text-[#4ADE80] block">Verified Proof</span>
          </div>
        </div>

        {/* Connected Evidence Pipeline Workflow */}
        <div className="p-6 rounded-2xl card-surface space-y-4">
          <div className="flex items-center justify-between border-b border-[#2A2D30] pb-3">
            <span className="text-xs uppercase font-bold text-[#9CA3AF] font-mono">
              EVIDENCE PIPELINE WORKFLOW
            </span>
            <span className="text-[10px] font-mono text-[#F9732F]">Automated Analysis</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-[#151719] border border-[#2A2D30] space-y-2 relative">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#F9732F]">01</span>
                <svg className="w-4 h-4 text-[#9CA3AF]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              </div>
              <h3 className="text-sm font-bold text-[#F5F2ED]">01 GitHub Profile</h3>
              <p className="text-xs text-[#9CA3AF] font-sans leading-relaxed">
                Connect public profile handles and repository history.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#151719] border border-[#2A2D30] space-y-2 relative">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#F9732F]">02</span>
                <svg className="w-4 h-4 text-[#9CA3AF]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
              </div>
              <h3 className="text-sm font-bold text-[#F5F2ED]">02 Repository Inspection</h3>
              <p className="text-xs text-[#9CA3AF] font-sans leading-relaxed">
                Parse READMEs, dependency manifests, and source trees.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#151719] border border-[#2A2D30] space-y-2 relative">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#F9732F]">03</span>
                <svg className="w-4 h-4 text-[#9CA3AF]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <h3 className="text-sm font-bold text-[#F5F2ED]">03 Evidence Extraction</h3>
              <p className="text-xs text-[#9CA3AF] font-sans leading-relaxed">
                Extract verified commits, PRs, issues, and tech stack points.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#151719] border border-[#F9732F]/40 space-y-2 relative">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#F9732F]">04</span>
                <svg className="w-4 h-4 text-[#F9732F]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path></svg>
              </div>
              <h3 className="text-sm font-bold text-[#F5F2ED]">04 Proof Generation</h3>
              <p className="text-xs text-[#9CA3AF] font-sans leading-relaxed">
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2A2D30] pb-4">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-[#F9732F] tracking-wider uppercase block mb-1">
                      TECHNICAL SIGNALS
                    </span>
                    <h2 className="text-2xl font-extrabold text-[#F5F2ED] flex items-center gap-2.5">
                      <span>Verifiable Proof of Work</span>
                      <span className="px-2.5 py-0.5 rounded text-xs badge-emerald font-mono">
                        {analysis.cards.length} Cards Verified
                      </span>
                    </h2>
                    <p className="text-xs text-[#9CA3AF] mt-1 font-sans">
                      Developer insights generated directly from real public GitHub data and backed by inspectable repository evidence
                    </p>
                  </div>

                  {/* Top Languages Breakdown Bar */}
                  {analysis.topLanguages.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2">
                      {analysis.topLanguages.slice(0, 4).map((lang) => (
                        <div
                          key={lang.language}
                          className="px-3 py-1.5 rounded bg-[#151719] border border-[#2A2D30] text-xs font-mono text-[#F5F2ED] flex items-center gap-2 shadow-sm"
                        >
                          <span className="w-2 h-2 rounded-full bg-[#F9732F]"></span>
                          <span className="text-[#F9732F] font-bold">{lang.language}</span>
                          <span className="text-[#9CA3AF] font-semibold">{lang.percentage}%</span>
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
      <footer className="border-t border-[#2A2D30] py-6 text-center text-xs text-[#6B7280] font-mono">
        GitProof &copy; {new Date().getFullYear()} — Source-Grounded Developer Intelligence
      </footer>
    </main>
  );
}
