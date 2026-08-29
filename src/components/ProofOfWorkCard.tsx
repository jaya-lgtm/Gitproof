import { EvidenceCard } from "@/lib/analysis";

interface ProofOfWorkCardProps {
  card: EvidenceCard;
}

export function ProofOfWorkCard({ card }: ProofOfWorkCardProps) {
  const categoryBadges: Record<
    EvidenceCard["category"],
    { label: string; color: string; icon: React.ReactNode }
  > = {
    languages: {
      label: "Tech Stack",
      color: "bg-blue-950/80 text-blue-400 border-blue-800/80",
      icon: (
        <svg className="w-3.5 h-3.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
      ),
    },
    impact: {
      label: "Community Impact",
      color: "bg-violet-950/80 text-violet-400 border-violet-800/80",
      icon: (
        <svg className="w-3.5 h-3.5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
      ),
    },
    activity: {
      label: "Engineering Activity",
      color: "bg-indigo-950/80 text-indigo-400 border-indigo-800/80",
      icon: (
        <svg className="w-3.5 h-3.5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
      ),
    },
    repository: {
      label: "Portfolio Evidence",
      color: "bg-slate-900 text-slate-300 border-slate-700/80",
      icon: (
        <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H7a2 2 0 01-2-2V8zm0 0l2 4h10l2-4"></path></svg>
      ),
    },
  };

  const badge = categoryBadges[card.category] || categoryBadges.repository;

  return (
    <div className="glass-card glass-card-hover rounded-2xl p-6 flex flex-col justify-between group relative overflow-hidden transition-all duration-300">
      {/* Top Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500/50 via-indigo-500/50 to-violet-500/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>

      <div>
        {/* Category Badge & Verified Badge */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border flex items-center gap-1.5 ${badge.color}`}
          >
            {badge.icon}
            <span>{badge.label}</span>
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-medium bg-emerald-950/70 px-2.5 py-0.5 rounded-full border border-emerald-800/60 shadow-sm">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
            <span>{card.evidenceStrength}</span>
          </span>
        </div>

        {/* Title & Recruiter Summary */}
        <h3 className="text-lg font-bold text-slate-100 group-hover:text-blue-400 transition-colors tracking-tight">
          {card.title}
        </h3>
        <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
          {card.summary}
        </p>

        {/* Supporting Evidence Bulleted List */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-2">
          <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 font-mono flex items-center gap-1">
            <span className="text-emerald-400 font-bold">✓</span> Grounded Evidence Points
          </span>
          <ul className="space-y-1.5">
            {card.evidence.map((point, index) => (
              <li
                key={index}
                className="text-xs text-slate-300 flex items-start gap-2"
              >
                <span className="text-emerald-400 font-bold shrink-0 mt-0.5">✓</span>
                <span className="leading-snug">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Supporting Repository Links */}
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
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-900 border border-slate-800/90 text-xs text-slate-300 hover:text-blue-400 font-mono transition-all hover:border-blue-500/40"
              >
                <span>{repo.name}</span>
                {repo.language && (
                  <span className="text-[10px] text-slate-500 font-sans">({repo.language})</span>
                )}
                {repo.stars > 0 && (
                  <span className="text-[10px] text-amber-400 flex items-center gap-0.5 font-mono">
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
