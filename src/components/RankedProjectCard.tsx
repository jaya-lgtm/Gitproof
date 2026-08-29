"use client";

import { useState } from "react";
import { RankedProjectMatch } from "@/lib/job-matcher";

interface RankedProjectCardProps {
  match: RankedProjectMatch;
  rank: number;
}

export function RankedProjectCard({ match, rank }: RankedProjectCardProps) {
  const [showEvidence, setShowEvidence] = useState(false);
  const repo = match.repository;

  const scoreColor =
    match.matchScore >= 70
      ? "text-emerald-400 bg-emerald-950/80 border-emerald-800/80"
      : match.matchScore >= 40
      ? "text-blue-400 bg-blue-950/80 border-blue-800/80"
      : "text-slate-400 bg-slate-900 border-slate-800";

  return (
    <div className="glass-card glass-card-hover rounded-2xl p-6 space-y-4">
      {/* Header: Rank, Repo Name, Match Score Badge */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-mono text-xs font-bold flex items-center justify-center shrink-0">
            #{rank}
          </span>
          <div>
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-bold text-slate-100 hover:text-blue-400 transition-colors inline-flex items-center gap-1.5 font-mono"
            >
              <span>{repo.name}</span>
              <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
            </a>
            {repo.description && (
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                {repo.description}
              </p>
            )}
          </div>
        </div>

        {/* Match Score Badge */}
        <div className={`px-3 py-1.5 rounded-xl border text-sm font-extrabold font-mono flex items-center gap-1.5 ${scoreColor}`}>
          <span>{match.matchScore}%</span>
          <span className="text-[10px] font-normal uppercase tracking-wider font-sans">Match</span>
        </div>
      </div>

      {/* Match Reason */}
      <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
        <span className="font-semibold text-blue-400">Match Analysis: </span>
        {match.matchReason}
      </div>

      {/* Skills Badges: Matched & Missing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        {/* Matched Skills */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400 block font-mono">
            Matched Skills ({match.matchedSkills.length})
          </span>
          <div className="flex flex-wrap gap-1">
            {match.matchedSkills.length > 0 ? (
              match.matchedSkills.map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/40 text-[11px] font-mono"
                >
                  ✓ {skill}
                </span>
              ))
            ) : (
              <span className="text-slate-500 text-xs italic">None matched</span>
            )}
          </div>
        </div>

        {/* Missing Skills */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block font-mono">
            Missing Skills ({match.missingSkills.length})
          </span>
          <div className="flex flex-wrap gap-1">
            {match.missingSkills.length > 0 ? (
              match.missingSkills.slice(0, 5).map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800 text-[11px] font-mono"
                >
                  ✕ {skill}
                </span>
              ))
            ) : (
              <span className="text-emerald-400 text-xs italic">All required skills present!</span>
            )}
          </div>
        </div>
      </div>

      {/* Weighted Score Breakdown */}
      <div className="pt-2 border-t border-slate-800/60 grid grid-cols-5 gap-1 text-[10px] text-slate-400 font-mono text-center">
        <div className="bg-slate-950 p-1.5 rounded border border-slate-800">
          <span className="block text-slate-200 font-bold">{match.scoreBreakdown.implementationScore}%</span>
          <span className="text-[9px] text-slate-500">Impl (35%)</span>
        </div>
        <div className="bg-slate-950 p-1.5 rounded border border-slate-800">
          <span className="block text-slate-200 font-bold">{match.scoreBreakdown.manifestScore}%</span>
          <span className="text-[9px] text-slate-500">Manifest (25%)</span>
        </div>
        <div className="bg-slate-950 p-1.5 rounded border border-slate-800">
          <span className="block text-slate-200 font-bold">{match.scoreBreakdown.languageScore}%</span>
          <span className="text-[9px] text-slate-500">Lang (20%)</span>
        </div>
        <div className="bg-slate-950 p-1.5 rounded border border-slate-800">
          <span className="block text-slate-200 font-bold">{match.scoreBreakdown.readmeScore}%</span>
          <span className="text-[9px] text-slate-500">Docs (15%)</span>
        </div>
        <div className="bg-slate-950 p-1.5 rounded border border-slate-800">
          <span className="block text-slate-200 font-bold">{match.scoreBreakdown.activityScore}%</span>
          <span className="text-[9px] text-slate-500">Activity (5%)</span>
        </div>
      </div>

      {/* Collapsible Evidence Section */}
      {match.evidenceQuotes.length > 0 && (
        <div className="pt-2">
          <button
            onClick={() => setShowEvidence(!showEvidence)}
            className="w-full flex items-center justify-between px-3 py-2 text-xs font-mono text-slate-400 hover:text-slate-200 bg-slate-950/60 hover:bg-slate-950 border border-slate-800/80 rounded-lg transition-all cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
              {showEvidence ? "Hide Deep Repository Evidence" : "Show Deep Repository Evidence"} ({match.evidenceQuotes.length} Points)
            </span>
            <svg
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                showEvidence ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>

          {showEvidence && (
            <div className="mt-2.5 p-3.5 bg-slate-950/90 rounded-xl border border-slate-800 space-y-2 text-xs animate-fade-in font-mono">
              <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider block">
                Source Code & Manifest Evidence Snippets
              </span>
              <div className="space-y-2">
                {match.evidenceQuotes.map((quote, idx) => (
                  <div key={idx} className="bg-slate-900 p-2.5 rounded border border-slate-800 space-y-1">
                    <span className="text-[10px] text-blue-400 font-semibold block">
                      [{quote.source}]
                    </span>
                    <p className="text-slate-300 break-words text-[11px]">
                      {quote.snippet}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
