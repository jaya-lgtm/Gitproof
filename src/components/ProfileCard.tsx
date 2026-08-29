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
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-sm shadow-xl">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        {/* Avatar */}
        <div className="relative group shrink-0">
          <img
            src={user.avatar_url}
            alt={`${user.login}'s avatar`}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-2 border-emerald-500/30 object-cover shadow-md"
          />
        </div>

        {/* Info */}
        <div className="flex-1 text-center md:text-left space-y-3">
          <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div>
                <h2 className="text-2xl font-bold text-slate-100">
                  {user.name || user.login}
                </h2>
                <a
                  href={user.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 font-mono text-sm transition-colors inline-block"
                >
                  @{user.login}
                </a>
              </div>
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => saveProof(user)}
                  disabled={saved}
                  className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                    saved
                      ? "bg-emerald-950/80 text-emerald-400 border border-emerald-800 cursor-default"
                      : "bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20"
                  }`}
                >
                  <span>{saved ? "✓ Saved Proof" : "Save Proof"}</span>
                </button>
                <a
                  href={user.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-4 py-2 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all"
                >
                  View on GitHub
                </a>
              </div>
            </div>
          </div>

          {user.bio && (
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              {user.bio}
            </p>
          )}

          {/* Metadata badges */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-y-2 gap-x-4 text-xs text-slate-400">
            {user.company && (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                {user.company}
              </span>
            )}
            {user.location && (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                {user.location}
              </span>
            )}
            {user.blog && (
              <a
                href={user.blog.startsWith("http") ? user.blog : `https://${user.blog}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-emerald-400 transition-colors"
              >
                <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                Website
              </a>
            )}
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              Joined {joinedDate}
            </span>
          </div>

          {/* Stats Bar */}
          <div className="pt-4 grid grid-cols-3 gap-3 max-w-md mx-auto md:mx-0">
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 text-center">
              <span className="block text-xl font-bold text-slate-100">
                {user.public_repos}
              </span>
              <span className="text-[11px] uppercase tracking-wider text-slate-400">
                Repositories
              </span>
            </div>
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 text-center">
              <span className="block text-xl font-bold text-slate-100">
                {user.followers}
              </span>
              <span className="text-[11px] uppercase tracking-wider text-slate-400">
                Followers
              </span>
            </div>
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 text-center">
              <span className="block text-xl font-bold text-slate-100">
                {user.following}
              </span>
              <span className="text-[11px] uppercase tracking-wider text-slate-400">
                Following
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
