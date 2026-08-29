"use client";

import { useState } from "react";
import { RawDevelopmentEvidence } from "@/lib/github";
import { DevelopmentEvidenceCard } from "./DevelopmentEvidenceCard";

interface DevelopmentEvidenceSectionProps {
  evidences: RawDevelopmentEvidence[];
}

export function DevelopmentEvidenceSection({
  evidences,
}: DevelopmentEvidenceSectionProps) {
  const [activeTab, setActiveTab] = useState<
    "ALL" | "Pull Request" | "Issue" | "Commit"
  >("ALL");

  const prCount = evidences.filter((e) => e.type === "Pull Request").length;
  const issueCount = evidences.filter((e) => e.type === "Issue").length;
  const commitCount = evidences.filter((e) => e.type === "Commit").length;

  const filteredEvidences = evidences.filter((e) => {
    if (activeTab === "ALL") return true;
    return e.type === activeTab;
  });

  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1F2432] pb-4">
        <div>
          <h2 className="text-2xl font-extrabold text-zinc-100 flex items-center gap-2">
            <span>Verified Development Evidence</span>
            <span className="px-2.5 py-0.5 rounded text-xs badge-sky font-mono">
              {evidences.length} Items
            </span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Actual commits, pull requests, and issues translated into recruiter-friendly engineering accomplishments
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#0D1017] p-1.5 rounded-xl border border-[#1F2432]">
          <button
            onClick={() => setActiveTab("ALL")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "ALL"
                ? "bg-[#161B26] text-[#C8FF4A] border border-[#C8FF4A]/20"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            All ({evidences.length})
          </button>
          <button
            onClick={() => setActiveTab("Pull Request")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
              activeTab === "Pull Request"
                ? "badge-emerald font-mono"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Pull Requests ({prCount})
          </button>
          <button
            onClick={() => setActiveTab("Issue")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
              activeTab === "Issue"
                ? "badge-purple font-mono"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Issues ({issueCount})
          </button>
          <button
            onClick={() => setActiveTab("Commit")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
              activeTab === "Commit"
                ? "badge-sky font-mono"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Commits ({commitCount})
          </button>
        </div>
      </div>

      {filteredEvidences.length === 0 ? (
        <div className="card-surface rounded-2xl p-8 text-center text-zinc-400 text-sm font-sans">
          No verified evidence found for category &apos;{activeTab}&apos;.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredEvidences.map((ev) => (
            <DevelopmentEvidenceCard key={ev.id} evidence={ev} />
          ))}
        </div>
      )}
    </section>
  );
}
