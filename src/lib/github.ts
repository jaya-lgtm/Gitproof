export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  bio: string | null;
  twitter_username: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  html_url: string;
  description: string | null;
  fork: boolean;
  url: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  homepage: string | null;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  language: string | null;
  forks_count: number;
  open_issues_count: number;
  license: {
    key: string;
    name: string;
    spdx_id: string;
  } | null;
  topics?: string[];
  default_branch: string;
}

export interface RawDevelopmentEvidence {
  id: string;
  type: "Pull Request" | "Issue" | "Commit";
  repoName: string;
  repoUrl: string;
  title: string;
  description?: string;
  url: string;
  status?: string; // merged, open, closed
  createdAt: string;
  recruiterTranslation?: string;
}

export interface GitHubUserFetchResult {
  success: boolean;
  user?: GitHubUser;
  repos?: GitHubRepository[];
  evidences?: RawDevelopmentEvidence[];
  error?: string;
  isRateLimited?: boolean;
}

const GITHUB_API_BASE = "https://api.github.com";

const DEFAULT_HEADERS = {
  Accept: "application/vnd.github.v3+json",
  "User-Agent": "GitProof-App",
};

export async function fetchGitHubUserData(
  username: string
): Promise<GitHubUserFetchResult> {
  try {
    // 1. Fetch user profile, public repos, and public events concurrently
    const userPromise = fetch(
      `${GITHUB_API_BASE}/users/${encodeURIComponent(username)}`,
      {
        headers: DEFAULT_HEADERS,
        next: { revalidate: 1800 },
      }
    );

    const reposPromise = fetch(
      `${GITHUB_API_BASE}/users/${encodeURIComponent(username)}/repos?sort=pushed&per_page=100`,
      {
        headers: DEFAULT_HEADERS,
        next: { revalidate: 1800 },
      }
    );

    const eventsPromise = fetch(
      `${GITHUB_API_BASE}/users/${encodeURIComponent(username)}/events/public?per_page=50`,
      {
        headers: DEFAULT_HEADERS,
        next: { revalidate: 1800 },
      }
    );

    const issuesSearchPromise = fetch(
      `${GITHUB_API_BASE}/search/issues?q=author:${encodeURIComponent(username)}+type:pr&sort=created&order=desc&per_page=15`,
      {
        headers: DEFAULT_HEADERS,
        next: { revalidate: 1800 },
      }
    );

    const [userRes, reposRes, eventsRes, issuesSearchRes] = await Promise.all([
      userPromise,
      reposPromise,
      eventsPromise,
      issuesSearchPromise,
    ]);

    // Rate Limit Check
    if (
      userRes.status === 403 ||
      reposRes.status === 403 ||
      eventsRes.status === 403 ||
      issuesSearchRes.status === 403
    ) {
      const rateLimitReset = userRes.headers.get("x-ratelimit-reset");
      let resetTimeMsg = "";
      if (rateLimitReset) {
        const resetDate = new Date(parseInt(rateLimitReset, 10) * 1000);
        resetTimeMsg = ` Rate limit resets at ${resetDate.toLocaleTimeString()}.`;
      }
      return {
        success: false,
        error: `GitHub API rate limit exceeded.${resetTimeMsg} Please try again later.`,
        isRateLimited: true,
      };
    }

    if (userRes.status === 404) {
      return {
        success: false,
        error: `GitHub user '${username}' was not found.`,
      };
    }

    if (!userRes.ok) {
      return {
        success: false,
        error: `Failed to fetch GitHub profile (HTTP ${userRes.status}).`,
      };
    }

    const user: GitHubUser = await userRes.json();
    let repos: GitHubRepository[] = [];
    if (reposRes.ok) {
      repos = await reposRes.json();
    }

    const evidences: RawDevelopmentEvidence[] = [];
    const seenUrls = new Set<string>();

    // Process Pull Requests from Search API
    if (issuesSearchRes.ok) {
      const prSearchData = await issuesSearchRes.json();
      if (prSearchData.items && Array.isArray(prSearchData.items)) {
        for (const item of prSearchData.items) {
          if (!seenUrls.has(item.html_url)) {
            seenUrls.add(item.html_url);
            const repoFullName = item.repository_url
              ? item.repository_url.replace(`${GITHUB_API_BASE}/repos/`, "")
              : "GitHub Repository";

            evidences.push({
              id: `pr-${item.id}`,
              type: "Pull Request",
              repoName: repoFullName,
              repoUrl: `https://github.com/${repoFullName}`,
              title: item.title,
              description: item.body ? item.body.slice(0, 150) : undefined,
              url: item.html_url,
              status: item.pull_request?.merged_at
                ? "merged"
                : item.state,
              createdAt: item.created_at,
            });
          }
        }
      }
    }

    // Process Public Events (PushEvent, IssuesEvent, PullRequestEvent)
    if (eventsRes.ok) {
      const events = await eventsRes.json();
      if (Array.isArray(events)) {
        for (const event of events) {
          const repoName = event.repo?.name || "GitHub Repository";
          const repoUrl = `https://github.com/${repoName}`;

          if (event.type === "PushEvent" && event.payload?.commits) {
            for (const commit of event.payload.commits.slice(0, 2)) {
              const commitUrl = `${repoUrl}/commit/${commit.sha}`;
              if (!seenUrls.has(commitUrl) && commit.message) {
                seenUrls.add(commitUrl);
                evidences.push({
                  id: `commit-${commit.sha.slice(0, 7)}`,
                  type: "Commit",
                  repoName,
                  repoUrl,
                  title: commit.message.split("\n")[0],
                  url: commitUrl,
                  createdAt: event.created_at,
                });
              }
            }
          } else if (event.type === "IssuesEvent" && event.payload?.issue) {
            const issue = event.payload.issue;
            if (!seenUrls.has(issue.html_url)) {
              seenUrls.add(issue.html_url);
              evidences.push({
                id: `issue-${issue.id}`,
                type: "Issue",
                repoName,
                repoUrl,
                title: issue.title,
                description: issue.body ? issue.body.slice(0, 150) : undefined,
                url: issue.html_url,
                status: issue.state,
                createdAt: event.created_at,
              });
            }
          } else if (
            event.type === "PullRequestEvent" &&
            event.payload?.pull_request
          ) {
            const pr = event.payload.pull_request;
            if (!seenUrls.has(pr.html_url)) {
              seenUrls.add(pr.html_url);
              evidences.push({
                id: `pr-event-${pr.id}`,
                type: "Pull Request",
                repoName,
                repoUrl,
                title: pr.title,
                description: pr.body ? pr.body.slice(0, 150) : undefined,
                url: pr.html_url,
                status: pr.merged ? "merged" : pr.state,
                createdAt: event.created_at,
              });
            }
          }
        }
      }
    }

    return {
      success: true,
      user,
      repos,
      evidences: evidences.slice(0, 10), // Return top 10 recent evidence items
    };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Network error occurred.";
    return {
      success: false,
      error: `Could not connect to GitHub API: ${message}`,
    };
  }
}
