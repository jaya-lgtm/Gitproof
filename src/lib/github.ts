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

export interface GitHubUserFetchResult {
  success: boolean;
  user?: GitHubUser;
  repos?: GitHubRepository[];
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
    // Fetch profile and public repos concurrently
    const userPromise = fetch(`${GITHUB_API_BASE}/users/${encodeURIComponent(username)}`, {
      headers: DEFAULT_HEADERS,
      next: { revalidate: 3600 }, // cache for 1 hour
    });

    const reposPromise = fetch(
      `${GITHUB_API_BASE}/users/${encodeURIComponent(username)}/repos?sort=pushed&per_page=100`,
      {
        headers: DEFAULT_HEADERS,
        next: { revalidate: 3600 },
      }
    );

    const [userRes, reposRes] = await Promise.all([userPromise, reposPromise]);

    // Rate Limit Check
    if (userRes.status === 403 || reposRes.status === 403) {
      const rateLimitReset = userRes.headers.get("x-ratelimit-reset") || reposRes.headers.get("x-ratelimit-reset");
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

    // User Not Found Check
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

    return {
      success: true,
      user,
      repos,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Network error occurred.";
    return {
      success: false,
      error: `Could not connect to GitHub API: ${message}`,
    };
  }
}
