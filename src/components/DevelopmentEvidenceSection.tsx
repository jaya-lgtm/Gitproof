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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
            <span>Verified Development Evidence</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs bg-blue-950/80 text-blue-400 border border-blue-800/80 font-mono">
              {evidences.length} Items
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Actual commits, pull requests, and issues translated into recruiter-friendly engineering accomplishments
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab("ALL")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "ALL"
                ? "bg-blue-600 text-white shadow border border-blue-500/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            All ({evidences.length})
          </button>
          <button
            onClick={() => setActiveTab("Pull Request")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
              activeTab === "Pull Request"
                ? "bg-emerald-950 text-emerald-400 shadow border border-emerald-800"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Pull Requests ({prCount})
          </button>
          <button
            onClick={() => setActiveTab("Issue")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
              activeTab === "Issue"
                ? "bg-violet-950 text-violet-400 shadow border border-violet-800"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Issues ({issueCount})
          </button>
          <button
            onClick={() => setActiveTab("Commit")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
              activeTab === "Commit"
                ? "bg-blue-950 text-blue-400 shadow border border-blue-800"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Commits ({commitCount})
          </button>
        </div>
      </div>

      {filteredEvidences.length === 0 ? (
        <div className="glass-card rounded-2xl p-8 text-center text-slate-400 text-sm">
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
