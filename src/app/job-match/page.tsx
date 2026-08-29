"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { JobMatchForm } from "@/components/JobMatchForm";
import { RankedProjectCard } from "@/components/RankedProjectCard";
import { ProfileCard } from "@/components/ProfileCard";
import { GitHubUser } from "@/lib/github";
import { ExtractedJobRequirements, RankedProjectMatch } from "@/lib/job-matcher";

export default function JobMatchPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [jobRequirements, setJobRequirements] = useState<ExtractedJobRequirements | null>(null);
  const [rankedProjects, setRankedProjects] = useState<RankedProjectMatch[]>([]);

  const handleMatch = async (githubUrl: string, jobDescription: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/job-match", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: githubUrl, jobDescription }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.error || "Failed to perform job match analysis.");
        setUser(null);
        setJobRequirements(null);
        setRankedProjects([]);
      } else {
        setUser(data.user);
        setJobRequirements(data.jobRequirements);
        setRankedProjects(data.rankedProjects || []);
      }
    } catch {
      setError("An unexpected network error occurred. Please try again.");
      setUser(null);
      setJobRequirements(null);
      setRankedProjects([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0D0F10] text-[#F5F2ED] flex flex-col font-sans selection:bg-[#F9732F] selection:text-[#0D0F10] relative overflow-hidden">
      <Header />

      {/* Hero & Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-12 space-y-10 relative z-10">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-[11px] uppercase font-mono font-bold text-[#F9732F] tracking-widest bg-[#F9732F]/10 px-2.5 py-1 rounded border border-[#F9732F]/20">
            RELEVANCE EVALUATION
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#F5F2ED]">
            Job Match & <span className="text-[#F9732F]">Project Relevance Ranking</span>
          </h1>
          <p className="text-[#9CA3AF] text-sm leading-relaxed font-sans">
            Match a candidate&apos;s actual repository source code, manifests, and documentation against target job description requirements.
          </p>
        </div>

        {/* Top Matching Engine Pipeline Diagram */}
        <div className="p-4 rounded-xl card-surface max-w-3xl mx-auto font-mono text-xs text-center space-y-2">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="px-3 py-1 rounded bg-[#151719] border border-[#2A2D30] text-[#9CA3AF]">
              Developer GitHub Profile + Job Description
            </span>
            <span className="text-[#F9732F]">↓</span>
            <span className="px-3 py-1 rounded bg-[#F9732F]/10 border border-[#F9732F]/30 text-[#F9732F] font-bold">
              MATCH ENGINE
            </span>
            <span className="text-[#F9732F]">↓</span>
            <span className="px-3 py-1 rounded bg-[#151719] border border-[#2A2D30] text-[#F5F2ED] font-bold">
              Ranked Relevant Projects
            </span>
          </div>
        </div>

        {/* Input Form */}
        <JobMatchForm onMatch={handleMatch} isLoading={isLoading} />

        {/* Error Banner */}
        {error && (
          <div className="max-w-2xl mx-auto bg-rose-950/50 border border-rose-800/80 rounded-xl p-4 text-center text-rose-300 text-sm flex items-center justify-center gap-2 shadow-lg font-sans">
            <svg className="w-5 h-5 text-rose-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span>{error}</span>
          </div>
        )}

        {/* Results View */}
        {user && jobRequirements && (
          <div className="space-y-10 animate-fade-in">
            {/* User Profile */}
            <ProfileCard user={user} />

            {/* Extracted Job Requirements Breakdown */}
            <section className="card-surface rounded-2xl p-6 shadow-xl space-y-4">
              <h2 className="text-sm font-mono font-bold text-[#F5F2ED] uppercase tracking-wider pb-3 border-b border-[#2A2D30] flex items-center justify-between">
                <span>EXTRACTED JOB REQUIREMENTS</span>
                <span className="text-xs font-mono text-[#F9732F]">
                  {jobRequirements.keywords.length} Target Skills Identified
                </span>
              </h2>

              <div className="flex flex-wrap gap-2">
                {jobRequirements.keywords.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 rounded bg-[#151719] border border-[#2A2D30] text-xs font-mono font-semibold text-[#F9732F]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>

            {/* Ranked Projects Section */}
            <section className="space-y-6">
              <div className="border-b border-[#2A2D30] pb-4">
                <h2 className="text-2xl font-extrabold text-[#F5F2ED] flex items-center gap-2">
                  <span>Ranked Relevant Repositories</span>
                  <span className="px-2.5 py-0.5 rounded text-xs badge-orange font-mono">
                    {rankedProjects.length} Projects Analyzed
                  </span>
                </h2>
                <p className="text-xs text-[#9CA3AF] mt-1 font-sans">
                  Ranked by implementation code evidence (35%), manifests (25%), language (20%), README (15%), and activity (5%)
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {rankedProjects.map((match, idx) => (
                  <RankedProjectCard
                    key={match.repository.id}
                    match={match}
                    rank={idx + 1}
                  />
                ))}
              </div>
            </section>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-[#2A2D30] py-6 text-center text-xs text-[#6B7280] font-mono">
        GitProof &copy; {new Date().getFullYear()} — Job Match & Deep Code Analysis
      </footer>
    </main>
  );
}
