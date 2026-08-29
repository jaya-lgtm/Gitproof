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

  // Score Color System
  const isHighMatch = match.matchScore >= 70;
  const isMediumMatch = match.matchScore >= 40;

  const scoreBadgeStyle = isHighMatch
    ? "badge-orange"
    : isMediumMatch
    ? "badge-charcoal text-[#F5F2ED]"
    : "bg-[#151719] text-[#6B7280] border border-[#2A2D30]";

  const scoreProgressStyle = isHighMatch
    ? "bg-[#F9732F]"
    : isMediumMatch
    ? "bg-[#9CA3AF]"
    : "bg-[#2A2D30]";

  const formattedRank = `#${rank < 10 ? `0${rank}` : rank}`;

  return (
    <div className="card-surface card-surface-hover rounded-2xl p-6 space-y-4 relative overflow-hidden">
      {/* Top Bar: Rank, Repo Name, Score Badge & Progress Bar */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-[#151719] border border-[#2A2D30] text-[#F9732F] font-mono text-xs font-bold flex items-center justify-center shrink-0">
              {formattedRank}
            </span>
            <div>
              <a
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-extrabold text-[#F5F2ED] hover:text-[#F9732F] transition-colors inline-flex items-center gap-1.5 font-mono"
              >
                <span>{repo.name}</span>
                <svg className="w-4 h-4 text-[#6B7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
              </a>
              {repo.description && (
                <p className="text-xs text-[#9CA3AF] mt-0.5 line-clamp-2 font-sans">
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
        <div className="w-full h-1.5 bg-[#151719] rounded-full overflow-hidden border border-[#2A2D30]">
          <div
            className={`h-full transition-all duration-500 ${scoreProgressStyle}`}
            style={{ width: `${match.matchScore}%` }}
          ></div>
        </div>
      </div>

      {/* WHY IT MATCHED */}
      <div className="p-3 bg-[#151719] rounded-xl border border-[#2A2D30] space-y-1">
        <span className="text-[10px] font-bold text-[#F9732F] uppercase tracking-wider font-mono block">
          WHY IT MATCHED
        </span>
        <p className="text-xs text-[#F5F2ED] leading-relaxed font-sans">
          {match.matchReason}
        </p>
      </div>

      {/* Skills Badges: Matched & Missing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        {/* Matched Skills */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#4ADE80] block font-mono">
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
              <span className="text-[#6B7280] text-xs italic font-sans">None matched</span>
            )}
          </div>
        </div>

        {/* Missing Skills */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] block font-mono">
            MISSING SKILLS ({match.missingSkills.length})
          </span>
          <div className="flex flex-wrap gap-1">
            {match.missingSkills.length > 0 ? (
              match.missingSkills.slice(0, 5).map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-0.5 rounded bg-[#151719] text-[#9CA3AF] border border-[#2A2D30] text-[11px] font-mono"
                >
                  ✕ {skill}
                </span>
              ))
            ) : (
              <span className="text-[#4ADE80] text-xs italic font-sans">All required skills present!</span>
            )}
          </div>
        </div>
      </div>

      {/* Weighted Score Breakdown */}
      <div className="pt-2 border-t border-[#2A2D30] grid grid-cols-5 gap-1 text-[10px] text-[#9CA3AF] font-mono text-center">
        <div className="bg-[#151719] p-1.5 rounded border border-[#2A2D30]">
          <span className="block text-[#F5F2ED] font-bold">{match.scoreBreakdown.implementationScore}%</span>
          <span className="text-[9px] text-[#6B7280] font-sans">Impl (35%)</span>
        </div>
        <div className="bg-[#151719] p-1.5 rounded border border-[#2A2D30]">
          <span className="block text-[#F5F2ED] font-bold">{match.scoreBreakdown.manifestScore}%</span>
          <span className="text-[9px] text-[#6B7280] font-sans">Manifest (25%)</span>
        </div>
        <div className="bg-[#151719] p-1.5 rounded border border-[#2A2D30]">
          <span className="block text-[#F5F2ED] font-bold">{match.scoreBreakdown.languageScore}%</span>
          <span className="text-[9px] text-[#6B7280] font-sans">Lang (20%)</span>
        </div>
        <div className="bg-[#151719] p-1.5 rounded border border-[#2A2D30]">
          <span className="block text-[#F5F2ED] font-bold">{match.scoreBreakdown.readmeScore}%</span>
          <span className="text-[9px] text-[#6B7280] font-sans">Docs (15%)</span>
        </div>
        <div className="bg-[#151719] p-1.5 rounded border border-[#2A2D30]">
          <span className="block text-[#F5F2ED] font-bold">{match.scoreBreakdown.activityScore}%</span>
          <span className="text-[9px] text-[#6B7280] font-sans">Activity (5%)</span>
        </div>
      </div>

      {/* VERIFIED EVIDENCE (Collapsible) */}
      {match.evidenceQuotes.length > 0 && (
        <div className="pt-2">
          <button
            onClick={() => setShowEvidence(!showEvidence)}
            className="w-full flex items-center justify-between px-3 py-2 text-xs font-mono text-[#9CA3AF] hover:text-[#F5F2ED] bg-[#151719] border border-[#2A2D30] rounded-lg transition-all cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-[#F9732F]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
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
            <div className="mt-2.5 p-3.5 bg-[#151719] rounded-xl border border-[#2A2D30] space-y-2 text-xs font-mono">
              <span className="text-[10px] uppercase font-bold text-[#F9732F] tracking-wider block">
                SOURCE CODE & MANIFEST EVIDENCE SNIPPETS
              </span>
              <div className="space-y-2">
                {match.evidenceQuotes.map((quote, idx) => (
                  <div key={idx} className="bg-[#1C1E20] p-2.5 rounded border border-[#2A2D30] space-y-1">
                    <span className="text-[10px] text-[#F9732F] font-semibold block">
                      [{quote.source}]
                    </span>
                    <p className="text-[#F5F2ED] break-words text-[11px]">
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
