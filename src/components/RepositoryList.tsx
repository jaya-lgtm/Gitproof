import { GitHubRepository } from "@/lib/github";

interface RepositoryListProps {
  repos: GitHubRepository[];
}

export function RepositoryList({ repos }: RepositoryListProps) {
  if (repos.length === 0) {
    return (
      <div className="card-surface rounded-2xl p-8 text-center text-zinc-400 font-sans">
        No public repositories found for this user.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-extrabold text-zinc-100 flex items-center gap-2">
          <span>Public Repositories</span>
          <span className="px-2.5 py-0.5 rounded text-xs bg-[#0D1017] text-[#38BDF8] border border-[#1F2432] font-mono">
            {repos.length}
          </span>
        </h3>
        <span className="text-xs text-zinc-400 font-mono">Sorted by recent activity</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {repos.map((repo) => {
          const updatedDate = new Date(repo.pushed_at || repo.updated_at).toLocaleDateString(
            "en-US",
            {
              month: "short",
              day: "numeric",
              year: "numeric",
            }
          );

          return (
            <div
              key={repo.id}
              className="card-surface card-surface-hover rounded-xl p-5 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base font-semibold text-zinc-100 group-hover:text-[#C8FF4A] transition-colors flex items-center gap-1.5 line-clamp-1 font-mono"
                  >
                    <span>{repo.name}</span>
                    {repo.fork && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-[#0D1017] text-zinc-400 border border-[#1F2432] font-normal font-sans">
                        Fork
                      </span>
                    )}
                  </a>
                </div>

                <p className="mt-2 text-xs text-zinc-400 line-clamp-2 min-h-[2.25rem] font-sans">
                  {repo.description || "No description provided."}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#1F2432] flex items-center justify-between text-xs text-zinc-400 font-mono">
                <div className="flex items-center gap-3">
                  {repo.language && (
                    <span className="flex items-center gap-1.5 font-medium text-zinc-300">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#38BDF8]"></span>
                      {repo.language}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 text-[#FBBF24]" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                    {repo.stargazers_count}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 text-zinc-400" fill="currentColor" viewBox="0 0 16 16"><path fillRule="evenodd" d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5A2.25 2.25 0 0012.5 6.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zM11 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm-3 9.5a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"></path></svg>
                    {repo.forks_count}
                  </span>
                </div>
                <span>Updated {updatedDate}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
