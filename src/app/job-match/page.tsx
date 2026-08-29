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
    <main className="min-h-screen bg-[#080A0F] text-zinc-100 flex flex-col font-sans selection:bg-[#C8FF4A] selection:text-[#080A0F] relative overflow-hidden">
      <Header />

      {/* Hero & Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-12 space-y-12 relative z-10">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-100">
            Job Match & <span className="text-[#C8FF4A]">Project Relevance Ranking</span>
          </h1>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Match a candidate&apos;s actual repository source code, manifests, and documentation against target job description requirements.
          </p>
        </div>

        {/* Input Form */}
        <JobMatchForm onMatch={handleMatch} isLoading={isLoading} />

        {/* Error Banner */}
        {error && (
          <div className="max-w-2xl mx-auto bg-rose-950/50 border border-rose-800/80 rounded-xl p-4 text-center text-rose-300 text-sm flex items-center justify-center gap-2 shadow-lg">
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
              <h2 className="text-xl font-extrabold text-zinc-100 pb-3 border-b border-[#1F2432] flex items-center justify-between">
                <span>Extracted Job Requirements</span>
                <span className="text-xs font-mono text-[#38BDF8]">
                  {jobRequirements.keywords.length} Target Skills Identified
                </span>
              </h2>

              <div className="flex flex-wrap gap-2">
                {jobRequirements.keywords.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 rounded bg-[#0D1017] border border-[#1F2432] text-xs font-mono font-semibold text-[#38BDF8]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>

            {/* Ranked Projects Section */}
            <section className="space-y-6">
              <div className="border-b border-[#1F2432] pb-4">
                <h2 className="text-2xl font-extrabold text-zinc-100 flex items-center gap-2">
                  <span>Ranked Relevant Repositories</span>
                  <span className="px-2.5 py-0.5 rounded text-xs badge-lime font-mono">
                    {rankedProjects.length} Projects Analyzed
                  </span>
                </h2>
                <p className="text-xs text-zinc-400 mt-1">
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
      <footer className="border-t border-[#1F2432] py-6 text-center text-xs text-zinc-500 font-mono">
        GitProof &copy; {new Date().getFullYear()} — Job Match & Deep Code Analysis
      </footer>
    </main>
  );
}
