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

  // Refined Match Score Color System
  const isHighMatch = match.matchScore >= 70;
  const isMediumMatch = match.matchScore >= 40;

  const scoreBadgeStyle = isHighMatch
    ? "badge-lime"
    : isMediumMatch
    ? "badge-sky"
    : "bg-[#0D1017] text-zinc-400 border border-[#1F2432]";

  const scoreProgressStyle = isHighMatch
    ? "bg-[#C8FF4A]"
    : isMediumMatch
    ? "bg-[#38BDF8]"
    : "bg-zinc-600";

  const formattedRank = `#${rank < 10 ? `0${rank}` : rank}`;

  return (
    <div className="card-surface card-surface-hover rounded-2xl p-6 space-y-4 relative overflow-hidden">
      {/* Top Bar: Rank, Repo Name, Score Badge & Progress Bar */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-[#0D1017] border border-[#1F2432] text-[#C8FF4A] font-mono text-xs font-bold flex items-center justify-center shrink-0">
              {formattedRank}
            </span>
            <div>
              <a
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-extrabold text-zinc-100 hover:text-[#C8FF4A] transition-colors inline-flex items-center gap-1.5 font-mono"
              >
                <span>{repo.name}</span>
                <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
              </a>
              {repo.description && (
                <p className="text-xs text-zinc-400 mt-0.5 line-clamp-2 font-sans">
                  {repo.description}
                </p>
              )}
            </div>
          </div>

          {/* Match Score Indicator */}
          <div className={`px-3 py-1.5 rounded-xl text-sm font-extrabold font-mono flex items-center gap-1.5 ${scoreBadgeStyle}`}>
            <span>{match.matchScore}%</span>
            <span className="text-[10px] font-normal uppercase tracking-wider font-sans">MATCH</span>
          </div>
        </div>

        {/* Technical Score Progress Bar */}
        <div className="w-full h-1.5 bg-[#0D1017] rounded-full overflow-hidden border border-[#1F2432]">
          <div
            className={`h-full transition-all duration-500 ${scoreProgressStyle}`}
            style={{ width: `${match.matchScore}%` }}
          ></div>
        </div>
      </div>

      {/* WHY IT MATCHED (AI Interpretation) */}
      <div className="p-3 bg.bg-purple bg-[#0D1017] rounded-xl border border-[#8B5CF6]/30 space-y-1">
        <span className="text-[10px] font-bold text-[#A78BFA] uppercase tracking-wider font-mono block">
          WHY IT MATCHED
        </span>
        <p className="text-xs text-zinc-200 leading-relaxed font-sans">
          {match.matchReason}
        </p>
      </div>

      {/* Skills Badges: Matched (Lime) & Missing (Muted) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        {/* Matched Skills */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#34D399] block font-mono">
            MATCHED SKILLS ({match.matchedSkills.length})
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
            MISSING SKILLS ({match.missingSkills.length})
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

      {/* VERIFIED EVIDENCE (Collapsible) */}
      {match.evidenceQuotes.length > 0 && (
        <div className="pt-2">
          <button
            onClick={() => setShowEvidence(!showEvidence)}
            className="w-full flex items-center justify-between px-3 py-2 text-xs font-mono text-zinc-400 hover:text-zinc-200 bg-[#0D1017] border border-[#1F2432] rounded-lg transition-all cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-[#38BDF8]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
              <span>VERIFIED EVIDENCE</span> ({match.evidenceQuotes.length} Points)
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
              <span className="text-[10px] uppercase font-bold text-[#38BDF8] tracking-wider block">
                SOURCE CODE & MANIFEST EVIDENCE SNIPPETS
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
