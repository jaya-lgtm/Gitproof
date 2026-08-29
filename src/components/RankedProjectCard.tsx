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
      ? "text-[#C8FF4A] bg-[#C8FF4A]/10 border-[#C8FF4A]/30"
      : match.matchScore >= 40
      ? "text-[#38BDF8] bg-[#38BDF8]/10 border-[#38BDF8]/30"
      : "text-zinc-400 bg-[#0D1017] border-[#1F2432]";

  return (
    <div className="card-surface card-surface-hover rounded-2xl p-6 space-y-4">
      {/* Header: Rank, Repo Name, Match Score Badge */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="w-7 h-7 rounded-lg bg-[#0D1017] border border-[#1F2432] text-zinc-300 font-mono text-xs font-bold flex items-center justify-center shrink-0">
            #{rank}
          </span>
          <div>
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-bold text-zinc-100 hover:text-[#C8FF4A] transition-colors inline-flex items-center gap-1.5 font-mono"
            >
              <span>{repo.name}</span>
              <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
            </a>
            {repo.description && (
              <p className="text-xs text-zinc-400 mt-1 line-clamp-2 font-sans">
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
      <div className="p-3 bg-[#0D1017] rounded-xl border border-[#1F2432] text-xs text-zinc-300 leading-relaxed font-sans">
        <span className="font-semibold text-[#38BDF8]">Match Analysis: </span>
        {match.matchReason}
      </div>

      {/* Skills Badges: Matched & Missing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        {/* Matched Skills */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#34D399] block font-mono">
            Matched Skills ({match.matchedSkills.length})
          </span>
          <div className="flex flex-wrap gap-1">
            {match.matchedSkills.length > 0 ? (
              match.matchedSkills.map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-0.5 rounded badge-emerald text-[11px] font-mono"
                >
                  ✓ {skill}
                </span>
              ))
            ) : (
              <span className="text-zinc-500 text-xs italic font-sans">None matched</span>
            )}
          </div>
        </div>

        {/* Missing Skills */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block font-mono">
            Missing Skills ({match.missingSkills.length})
          </span>
          <div className="flex flex-wrap gap-1">
            {match.missingSkills.length > 0 ? (
              match.missingSkills.slice(0, 5).map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-0.5 rounded bg-[#0D1017] text-zinc-400 border border-[#1F2432] text-[11px] font-mono"
                >
                  ✕ {skill}
                </span>
              ))
            ) : (
              <span className="text-[#34D399] text-xs italic font-sans">All required skills present!</span>
            )}
          </div>
        </div>
      </div>

      {/* Weighted Score Breakdown */}
      <div className="pt-2 border-t border-[#1F2432] grid grid-cols-5 gap-1 text-[10px] text-zinc-400 font-mono text-center">
        <div className="bg-[#0D1017] p-1.5 rounded border border-[#1F2432]">
          <span className="block text-zinc-200 font-bold">{match.scoreBreakdown.implementationScore}%</span>
          <span className="text-[9px] text-zinc-500 font-sans">Impl (35%)</span>
        </div>
        <div className="bg-[#0D1017] p-1.5 rounded border border-[#1F2432]">
          <span className="block text-zinc-200 font-bold">{match.scoreBreakdown.manifestScore}%</span>
          <span className="text-[9px] text-zinc-500 font-sans">Manifest (25%)</span>
        </div>
        <div className="bg-[#0D1017] p-1.5 rounded border border-[#1F2432]">
          <span className="block text-zinc-200 font-bold">{match.scoreBreakdown.languageScore}%</span>
          <span className="text-[9px] text-zinc-500 font-sans">Lang (20%)</span>
        </div>
        <div className="bg-[#0D1017] p-1.5 rounded border border-[#1F2432]">
          <span className="block text-zinc-200 font-bold">{match.scoreBreakdown.readmeScore}%</span>
          <span className="text-[9px] text-zinc-500 font-sans">Docs (15%)</span>
        </div>
        <div className="bg-[#0D1017] p-1.5 rounded border border-[#1F2432]">
          <span className="block text-zinc-200 font-bold">{match.scoreBreakdown.activityScore}%</span>
          <span className="text-[9px] text-zinc-500 font-sans">Activity (5%)</span>
        </div>
      </div>

      {/* Collapsible Evidence Section */}
      {match.evidenceQuotes.length > 0 && (
        <div className="pt-2">
          <button
            onClick={() => setShowEvidence(!showEvidence)}
            className="w-full flex items-center justify-between px-3 py-2 text-xs font-mono text-zinc-400 hover:text-zinc-200 bg-[#0D1017] border border-[#1F2432] rounded-lg transition-all cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
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
            <div className="mt-2.5 p-3.5 bg-[#0D1017] rounded-xl border border-[#1F2432] space-y-2 text-xs font-mono">
              <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider block">
                Source Code & Manifest Evidence Snippets
              </span>
              <div className="space-y-2">
                {match.evidenceQuotes.map((quote, idx) => (
                  <div key={idx} className="bg-[#161B26] p-2.5 rounded border border-[#1F2432] space-y-1">
                    <span className="text-[10px] text-[#38BDF8] font-semibold block">
                      [{quote.source}]
                    </span>
                    <p className="text-zinc-300 break-words text-[11px]">
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
