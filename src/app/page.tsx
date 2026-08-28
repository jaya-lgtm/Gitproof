"use client";

import { useState } from "react";
import { SearchForm } from "@/components/SearchForm";
import { ProfileCard } from "@/components/ProfileCard";
import { RepositoryList } from "@/components/RepositoryList";
import { GitHubUser, GitHubRepository } from "@/lib/github";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<GitHubRepository[]>([]);

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
      } else {
        setUser(data.user);
        setRepos(data.repos || []);
      }
    } catch {
      setError("An unexpected network error occurred. Please try again.");
      setUser(null);
      setRepos([]);
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

          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            Powered by GitHub Data
          </a>
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
          <div className="space-y-10 animate-fade-in">
            <ProfileCard user={user} />
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
