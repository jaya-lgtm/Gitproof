import { EvidenceCard } from "@/lib/analysis";

interface ProofOfWorkCardProps {
  card: EvidenceCard;
}

export function ProofOfWorkCard({ card }: ProofOfWorkCardProps) {
  const categoryBadges: Record<
    EvidenceCard["category"],
    { label: string; badgeClass: string; icon: React.ReactNode }
  > = {
    languages: {
      label: "Tech Stack",
      badgeClass: "badge-sky font-mono",
      icon: (
        <svg className="w-3.5 h-3.5 text-[#38BDF8]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
      ),
    },
    impact: {
      label: "Community Impact",
      badgeClass: "badge-purple font-mono",
      icon: (
        <svg className="w-3.5 h-3.5 text-[#8B5CF6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
      ),
    },
    activity: {
      label: "Engineering Activity",
      badgeClass: "badge-lime font-mono",
      icon: (
        <svg className="w-3.5 h-3.5 text-[#C8FF4A]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
      ),
    },
    repository: {
      label: "Portfolio Evidence",
      badgeClass: "bg-[#161B26] text-zinc-300 border border-[#1F2432] font-mono",
      icon: (
        <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H7a2 2 0 01-2-2V8zm0 0l2 4h10l2-4"></path></svg>
      ),
    },
  };

  const badge = categoryBadges[card.category] || categoryBadges.repository;

  return (
    <div className="card-surface card-surface-hover rounded-2xl p-6 flex flex-col justify-between group relative overflow-hidden space-y-4">
      <div className="space-y-3">
        {/* Category Badge & Verification Level */}
        <div className="flex items-center justify-between gap-2 border-b border-[#1F2432] pb-2.5">
          <span
            className={`px-2.5 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1.5 ${badge.badgeClass}`}
          >
            {badge.icon}
            <span>{badge.label}</span>
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold badge-emerald px-2.5 py-0.5 rounded font-mono">
            <svg className="w-3.5 h-3.5 text-[#34D399]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
            <span>{card.evidenceStrength}</span>
          </span>
        </div>

        {/* Title & Prominent Recruiter-Friendly Interpretation */}
        <div>
          <h3 className="text-lg font-extrabold text-zinc-100 group-hover:text-[#C8FF4A] transition-colors tracking-tight">
            {card.title}
          </h3>
          <div className="mt-2.5 p-3 rounded-xl bg-[#0D1017] border border-[#1F2432] space-y-1">
            <span className="text-[10px] font-bold text-[#A78BFA] uppercase tracking-wider font-mono block">
              AI RECRUITER INTERPRETATION
            </span>
            <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed font-sans font-medium">
              {card.summary}
            </p>
          </div>
        </div>

        {/* Supporting Evidence Points */}
        <div className="pt-2 space-y-2">
          <span className="text-[10px] uppercase tracking-wider font-bold text-[#34D399] font-mono flex items-center gap-1">
            <span>✓ VERIFIED SOURCE EVIDENCE</span>
          </span>
          <ul className="space-y-1.5">
            {card.evidence.map((point, index) => (
              <li
                key={index}
                className="text-xs text-zinc-300 flex items-start gap-2 bg-[#0D1017]/60 p-2 rounded border border-[#1F2432]"
              >
                <span className="text-[#34D399] font-bold shrink-0">✓</span>
                <span className="leading-snug">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Supporting Repository Links */}
      {card.supportingRepos.length > 0 && (
        <div className="pt-3 border-t border-[#1F2432]">
          <span className="text-[10px] uppercase tracking-wider font-bold text-[#38BDF8] block mb-2 font-mono">
            TECHNICAL / PROOF REPOSITORIES
          </span>
          <div className="flex flex-wrap gap-2">
            {card.supportingRepos.map((repo) => (
              <a
                key={repo.name}
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0D1017] border border-[#1F2432] text-xs text-zinc-300 hover:text-[#38BDF8] hover:border-[#38BDF8]/40 font-mono transition-all"
              >
                <span>{repo.name}</span>
                {repo.language && (
                  <span className="text-[10px] text-zinc-500 font-sans">({repo.language})</span>
                )}
                {repo.stars > 0 && (
                  <span className="text-[10px] text-[#FBBF24] flex items-center gap-0.5 font-mono">
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
