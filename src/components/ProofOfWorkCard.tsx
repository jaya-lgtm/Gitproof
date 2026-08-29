import { EvidenceCard } from "@/lib/analysis";

interface ProofOfWorkCardProps {
  card: EvidenceCard;
}

export function ProofOfWorkCard({ card }: ProofOfWorkCardProps) {
  const categoryBadges: Record<EvidenceCard["category"], { label: string; color: string }> = {
    languages: { label: "Tech Stack", color: "bg-blue-950/80 text-blue-400 border-blue-800/80" },
    impact: { label: "Community", color: "bg-violet-950/80 text-violet-400 border-violet-800/80" },
    activity: { label: "Activity", color: "bg-indigo-950/80 text-indigo-400 border-indigo-800/80" },
    repository: { label: "Portfolio", color: "bg-slate-900 text-slate-300 border-slate-700/80" },
  };

  const badge = categoryBadges[card.category] || categoryBadges.repository;

  return (
    <div className="glass-card glass-card-hover rounded-2xl p-6 flex flex-col justify-between group">
      <div>
        {/* Header Badge & Strength */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${badge.color}`}
          >
            {badge.label}
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-medium bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-800/40">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
            {card.evidenceStrength}
          </span>
        </div>

        {/* Title & Summary */}
        <h3 className="text-lg font-bold text-slate-100 group-hover:text-blue-400 transition-colors">
          {card.title}
        </h3>
        <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
          {card.summary}
        </p>

        {/* Supporting Evidence List */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-2">
          <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 font-mono">
            Verifiable Evidence Points
          </span>
          <ul className="space-y-1.5">
            {card.evidence.map((point, index) => (
              <li
                key={index}
                className="text-xs text-slate-300 flex items-start gap-2"
              >
                <span className="text-blue-400 mt-0.5 font-bold">•</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Supporting Repositories */}
      {card.supportingRepos.length > 0 && (
        <div className="mt-5 pt-4 border-t border-slate-800/80">
          <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 block mb-2 font-mono">
            Proof Repositories
          </span>
          <div className="flex flex-wrap gap-2">
            {card.supportingRepos.map((repo) => (
              <a
                key={repo.name}
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-blue-400 font-mono transition-all"
              >
                <span>{repo.name}</span>
                {repo.language && (
                  <span className="text-[10px] text-slate-500">({repo.language})</span>
                )}
                {repo.stars > 0 && (
                  <span className="text-[10px] text-amber-400 flex items-center gap-0.5">
                    ★{repo.stars}
                  </span>
                )}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
