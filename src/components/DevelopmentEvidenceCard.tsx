"use client";

import { useState } from "react";
import { RawDevelopmentEvidence } from "@/lib/github";

interface DevelopmentEvidenceCardProps {
  evidence: RawDevelopmentEvidence;
}

export function DevelopmentEvidenceCard({ evidence }: DevelopmentEvidenceCardProps) {
  const [showRawEvidence, setShowRawEvidence] = useState(false);

  const typeBadges: Record<
    RawDevelopmentEvidence["type"],
    { label: string; badgeClass: string }
  > = {
    "Pull Request": {
      label: "Pull Request",
      badgeClass: "badge-emerald font-mono",
    },
    Issue: {
      label: "Issue",
      badgeClass: "badge-purple font-mono",
    },
    Commit: {
      label: "Commit",
      badgeClass: "badge-sky font-mono",
    },
  };

  const badge = typeBadges[evidence.type];
  const createdDate = new Date(evidence.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="card-surface card-surface-hover rounded-2xl p-6 flex flex-col justify-between">
      <div className="space-y-4">
        {/* Top bar: Type badge, Repo, Status, Date */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-0.5 rounded text-xs font-semibold ${badge.badgeClass}`}
            >
              {badge.label}
            </span>
            <a
              href={evidence.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono text-zinc-400 hover:text-[#38BDF8] transition-colors"
            >
              {evidence.repoName}
            </a>
          </div>

          <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
            {evidence.status && (
              <span className="capitalize px-2 py-0.5 rounded bg-[#0D1017] text-zinc-300 font-mono text-[10px] border border-[#1F2432]">
                {evidence.status}
              </span>
            )}
            <span>{createdDate}</span>
          </div>
        </div>

        {/* AI Recruiter-Friendly Interpretation */}
        <div className="p-4 bg-[#0D1017] rounded-xl border border-[#8B5CF6]/30 space-y-1">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#A78BFA] uppercase tracking-wider font-mono">
              <svg className="w-3.5 h-3.5 text-[#8B5CF6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
              <span>AI Recruiter Interpretation</span>
            </div>
            <span className="text-[10px] text-[#34D399] font-mono">✓ Grounded</span>
          </div>
          <p className="text-sm font-medium text-zinc-100 leading-relaxed">
            {evidence.recruiterTranslation}
          </p>
        </div>

        {/* Collapsible Show Raw Evidence */}
        <div className="pt-1">
          <button
            onClick={() => setShowRawEvidence(!showRawEvidence)}
            className="w-full flex items-center justify-between px-3 py-2 text-xs font-mono text-zinc-400 hover:text-zinc-200 bg-[#0D1017] border border-[#1F2432] rounded-lg transition-all cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
              </svg>
              {showRawEvidence ? "Hide Raw GitHub Evidence" : "Show Raw GitHub Evidence"}
            </span>
            <svg
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                showRawEvidence ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>

          {showRawEvidence && (
            <div className="mt-2.5 p-3.5 bg-[#0D1017] rounded-xl border border-[#1F2432] space-y-2 text-xs font-mono">
              <div>
                <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider block">
                  Raw Title / Commit Message
                </span>
                <p className="text-zinc-200 bg-[#161B26] p-2 rounded border border-[#1F2432] break-words mt-1">
                  {evidence.title}
                </p>
              </div>

              {evidence.description && (
                <div>
                  <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider block font-sans">
                    Description Snippet
                  </span>
                  <p className="text-zinc-300 italic bg-[#161B26] p-2 rounded mt-1 line-clamp-3 font-sans">
                    &quot;{evidence.description}&quot;
                  </p>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-[11px] text-zinc-400 border-t border-[#1F2432]">
                <span>Repository: <code className="text-zinc-300">{evidence.repoName}</code></span>
                <span>Date: {createdDate}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Direct GitHub Verification Link */}
      <div className="mt-5 pt-3 border-t border-[#1F2432] flex justify-end">
        <a
          href={evidence.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-[#38BDF8] hover:underline font-mono font-semibold transition-colors"
        >
          <span>Verify on GitHub</span>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
          </svg>
        </a>
      </div>
    </div>
  );
}
