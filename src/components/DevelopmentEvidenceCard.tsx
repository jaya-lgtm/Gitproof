import { RawDevelopmentEvidence } from "@/lib/github";

interface DevelopmentEvidenceCardProps {
  evidence: RawDevelopmentEvidence;
}

export function DevelopmentEvidenceCard({ evidence }: DevelopmentEvidenceCardProps) {
  const typeBadges: Record<
    RawDevelopmentEvidence["type"],
    { label: string; bg: string; text: string; border: string }
  > = {
    "Pull Request": {
      label: "Pull Request",
      bg: "bg-emerald-950/80",
      text: "text-emerald-400",
      border: "border-emerald-800/80",
    },
    Issue: {
      label: "Issue",
      bg: "bg-amber-950/80",
      text: "text-amber-400",
      border: "border-amber-800/80",
    },
    Commit: {
      label: "Commit",
      bg: "bg-sky-950/80",
      text: "text-sky-400",
      border: "border-sky-800/80",
    },
  };

  const badge = typeBadges[evidence.type];
  const createdDate = new Date(evidence.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-6 transition-all duration-200 shadow-xl flex flex-col justify-between">
      <div className="space-y-4">
        {/* Top bar: Type badge, Repo, Status */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badge.bg} ${badge.text} ${badge.border}`}
            >
              {badge.label}
            </span>
            <a
              href={evidence.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono text-slate-400 hover:text-emerald-400 transition-colors"
            >
              {evidence.repoName}
            </a>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            {evidence.status && (
              <span className="capitalize px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px] border border-slate-700">
                {evidence.status}
              </span>
            )}
            <span>{createdDate}</span>
          </div>
        </div>

        {/* AI Recruiter Translation */}
        <div className="p-4 bg-slate-950/80 rounded-xl border border-emerald-500/20 space-y-1">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            Recruiter-Friendly Interpretation
          </div>
          <p className="text-sm font-medium text-slate-100 leading-relaxed">
            {evidence.recruiterTranslation}
          </p>
        </div>

        {/* Raw Technical Evidence */}
        <div className="space-y-1">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">
            Raw Technical Evidence
          </span>
          <p className="text-xs font-mono text-slate-300 bg-slate-950/50 p-2.5 rounded-lg border border-slate-800/80 break-words">
            {evidence.title}
          </p>
          {evidence.description && (
            <p className="text-xs text-slate-400 line-clamp-2 mt-1 italic">
              &quot;{evidence.description}&quot;
            </p>
          )}
        </div>
      </div>

      {/* Verification Link */}
      <div className="mt-5 pt-3 border-t border-slate-800/80 flex justify-end">
        <a
          href={evidence.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
        >
          <span>Verify on GitHub</span>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
        </a>
      </div>
    </div>
  );
}
