import { GitHubUser } from "@/lib/github";
import { useAuth } from "@/context/AuthContext";

interface ProfileCardProps {
  user: GitHubUser;
}

export function ProfileCard({ user }: ProfileCardProps) {
  const { saveProof, isProofSaved } = useAuth();
  const saved = isProofSaved(user.login);

  const joinedDate = new Date(user.created_at).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  return (
    <div className="card-surface rounded-2xl p-6 sm:p-8 space-y-6">
      {/* Eyebrow Header */}
      <div className="flex items-center justify-between border-b border-[#1F2432] pb-3 text-xs font-mono">
        <span className="text-[10px] font-bold text-zinc-400 tracking-wider uppercase">
          DEVELOPER PROFILE
        </span>
        <span className="badge-emerald px-2 py-0.5 rounded text-[10px] font-bold">
          ✓ PUBLIC PROFILE VERIFIED
        </span>
      </div>

      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8">
        {/* Avatar */}
        <div className="relative group shrink-0">
          <img
            src={user.avatar_url}
            alt={`${user.login}'s avatar`}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl border border-[#1F2432] object-cover shadow-xl group-hover:border-[#C8FF4A]/50 transition-colors"
          />
          <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#34D399] border-2 border-[#080A0F] rounded-full"></span>
        </div>

        {/* Info & Technical Metrics */}
        <div className="flex-1 text-center md:text-left space-y-4 w-full">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-100 tracking-tight">
                  {user.name || user.login}
                </h2>
                <a
                  href={user.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#38BDF8] hover:underline font-mono text-xs transition-colors inline-flex items-center gap-1 mt-1"
                >
                  <span>@{user.login}</span>
                  <svg className="w-3.5 h-3.5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                </a>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-center gap-2.5 shrink-0">
                <button
                  onClick={() => saveProof(user)}
                  disabled={saved}
                  className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                    saved
                      ? "badge-emerald cursor-default font-mono"
                      : "btn-lime shadow-sm"
                  }`}
                >
                  <span>{saved ? "✓ Saved Proof" : "+ Save Proof"}</span>
                </button>
                <a
                  href={user.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-3.5 py-2 text-xs font-semibold text-zinc-200 btn-secondary rounded-lg"
                >
                  View on GitHub
                </a>
              </div>
            </div>
          </div>

          {user.bio && (
            <p className="text-zinc-300 text-xs sm:text-sm max-w-2xl leading-relaxed font-sans">
              {user.bio}
            </p>
          )}

          {/* Metadata Badges */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-y-2 gap-x-3 text-xs text-zinc-400 font-sans">
            {user.company && (
              <span className="flex items-center gap-1.5 bg-[#0D1017] px-2.5 py-1 rounded border border-[#1F2432]">
                <svg className="w-3.5 h-3.5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                <span>{user.company}</span>
              </span>
            )}
            {user.location && (
              <span className="flex items-center gap-1.5 bg-[#0D1017] px-2.5 py-1 rounded border border-[#1F2432]">
                <svg className="w-3.5 h-3.5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                <span>{user.location}</span>
              </span>
            )}
            {user.blog && (
              <a
                href={user.blog.startsWith("http") ? user.blog : `https://${user.blog}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 bg-[#0D1017] px-2.5 py-1 rounded border border-[#1F2432] hover:text-[#38BDF8] transition-colors"
              >
                <svg className="w-3.5 h-3.5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                <span>Website</span>
              </a>
            )}
            <span className="flex items-center gap-1.5 bg-[#0D1017] px-2.5 py-1 rounded border border-[#1F2432] font-mono text-[11px]">
              <svg className="w-3.5 h-3.5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              <span>Joined {joinedDate}</span>
            </span>
          </div>

          {/* Technical Metric Indicators */}
          <div className="pt-2 grid grid-cols-3 gap-2.5 max-w-md mx-auto md:mx-0 font-mono text-left">
            <div className="bg-[#0D1017] p-2.5 rounded-lg border border-[#1F2432]">
              <span className="text-[10px] uppercase font-bold text-zinc-500 block">REPOSITORIES</span>
              <span className="text-lg font-extrabold text-zinc-100 block">{user.public_repos}</span>
            </div>
            <div className="bg-[#0D1017] p-2.5 rounded-lg border border-[#1F2432]">
              <span className="text-[10px] uppercase font-bold text-zinc-500 block">FOLLOWERS</span>
              <span className="text-lg font-extrabold text-zinc-100 block">{user.followers}</span>
            </div>
            <div className="bg-[#0D1017] p-2.5 rounded-lg border border-[#1F2432]">
              <span className="text-[10px] uppercase font-bold text-zinc-500 block">FOLLOWING</span>
              <span className="text-lg font-extrabold text-zinc-100 block">{user.following}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
