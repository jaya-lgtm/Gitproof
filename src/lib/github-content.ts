import { GitHubRepository } from "./github";

export interface RepositoryContentEvidence {
  repoName: string;
  repoUrl: string;
  readmeText?: string;
  manifestDependencies: string[];
  filePaths: string[];
  keySourceSnippets: Array<{ path: string; contentSnippet: string }>;
}

const GITHUB_API_BASE = "https://api.github.com";
const DEFAULT_HEADERS = {
  Accept: "application/vnd.github.v3+json",
  "User-Agent": "GitProof-App",
};

/**
 * Step 1: Lightweight candidate filter across all user repositories
 * Selects top 10-15 candidate repositories based on language, topics, stars, and recency.
 */
export function selectCandidateRepositories(
  repos: GitHubRepository[],
  jobKeywords: string[],
  limit = 12
): GitHubRepository[] {
  if (repos.length <= limit) return repos;

  const lowercaseKeywords = jobKeywords.map((k) => k.toLowerCase());

  const scoredRepos = repos.map((repo) => {
    let relevanceScore = 0;

    // Language match
    if (repo.language && lowercaseKeywords.some((k) => k.includes(repo.language!.toLowerCase()))) {
      relevanceScore += 5;
    }

    // Topics match
    if (repo.topics) {
      repo.topics.forEach((topic) => {
        if (lowercaseKeywords.some((k) => k.includes(topic.toLowerCase()))) {
          relevanceScore += 3;
        }
      });
    }

    // Description match
    if (repo.description) {
      const descLower = repo.description.toLowerCase();
      lowercaseKeywords.forEach((k) => {
        if (descLower.includes(k)) {
          relevanceScore += 2;
        }
      });
    }

    // Stars & activity boost
    relevanceScore += Math.min(repo.stargazers_count, 5);

    return { repo, relevanceScore };
  });

  // Sort by relevance score descending, then by last updated
  scoredRepos.sort((a, b) => {
    if (b.relevanceScore !== a.relevanceScore) {
      return b.relevanceScore - a.relevanceScore;
    }
    return new Date(b.repo.pushed_at || b.repo.updated_at).getTime() -
      new Date(a.repo.pushed_at || a.repo.updated_at).getTime();
  });

  return scoredRepos.slice(0, limit).map((item) => item.repo);
}

/**
 * Step 2: Deep inspection of selected repository files (README, manifests, file tree, key source files)
 */
export async function fetchRepositoryDeepContent(
  owner: string,
  repo: GitHubRepository
): Promise<RepositoryContentEvidence> {
  const repoName = repo.name;
  const repoUrl = repo.html_url;
  const defaultBranch = repo.default_branch || "main";

  let readmeText: string | undefined = undefined;
  const manifestDependencies: string[] = [];
  let filePaths: string[] = [];
  const keySourceSnippets: Array<{ path: string; contentSnippet: string }> = [];

  try {
    // 1. Fetch README.md
    const readmeRes = await fetch(
      `${GITHUB_API_BASE}/repos/${owner}/${repoName}/readme`,
      { headers: DEFAULT_HEADERS, next: { revalidate: 3600 } }
    );
    if (readmeRes.ok) {
      const readmeData = await readmeRes.json();
      if (readmeData.content && readmeData.encoding === "base64") {
        const decoded = Buffer.from(readmeData.content, "base64").toString("utf-8");
        readmeText = decoded.slice(0, 5000); // Max 5000 chars
      }
    }

    // 2. Fetch Repository Tree (directory structure)
    const treeRes = await fetch(
      `${GITHUB_API_BASE}/repos/${owner}/${repoName}/git/trees/${defaultBranch}?recursive=1`,
      { headers: DEFAULT_HEADERS, next: { revalidate: 3600 } }
    );

    if (treeRes.ok) {
      const treeData = await treeRes.json();
      if (Array.isArray(treeData.tree)) {
        filePaths = treeData.tree
          .filter((item: { type: string }) => item.type === "blob")
          .map((item: { path: string }) => item.path)
          .filter(
            (p: string) =>
              !p.includes("node_modules/") &&
              !p.includes("dist/") &&
              !p.includes("build/") &&
              !p.includes(".next/") &&
              !p.includes("vendor/")
          );
      }
    }

    // 3. Fetch Manifests (package.json, requirements.txt, Cargo.toml, etc.)
    const manifestCandidates = [
      "package.json",
      "requirements.txt",
      "pyproject.toml",
      "Cargo.toml",
      "go.mod",
      "pom.xml",
    ];

    const foundManifests = filePaths.filter((p) =>
      manifestCandidates.some((m) => p.endsWith(m))
    );

    for (const manifestPath of foundManifests.slice(0, 3)) {
      const mRes = await fetch(
        `${GITHUB_API_BASE}/repos/${owner}/${repoName}/contents/${manifestPath}`,
        { headers: DEFAULT_HEADERS, next: { revalidate: 3600 } }
      );
      if (mRes.ok) {
        const mData = await mRes.json();
        if (mData.content && mData.encoding === "base64") {
          const content = Buffer.from(mData.content, "base64").toString("utf-8");
          if (manifestPath.endsWith("package.json")) {
            try {
              const parsed = JSON.parse(content);
              const deps = {
                ...parsed.dependencies,
                ...parsed.devDependencies,
              };
              Object.keys(deps).forEach((d) => manifestDependencies.push(d));
            } catch {
              // Ignore JSON parse errors
            }
          } else {
            // Text manifest lines
            content.split("\n").forEach((line) => {
              const trimmed = line.trim();
              if (trimmed && !trimmed.startsWith("#")) {
                manifestDependencies.push(trimmed.slice(0, 40));
              }
            });
          }
        }
      }
    }

    // 4. Fetch up to 3-5 relevant source files if README/manifests are insufficient
    const sourceCandidates = filePaths
      .filter((p) =>
        /\.(ts|tsx|js|jsx|py|go|rs|java|cpp|cs|rb)$/i.test(p) &&
        !p.includes(".test.") &&
        !p.includes(".spec.") &&
        !p.endsWith(".d.ts")
      )
      .slice(0, 4);

    for (const sourcePath of sourceCandidates) {
      const sRes = await fetch(
        `${GITHUB_API_BASE}/repos/${owner}/${repoName}/contents/${sourcePath}`,
        { headers: DEFAULT_HEADERS, next: { revalidate: 3600 } }
      );
      if (sRes.ok) {
        const sData = await sRes.json();
        if (sData.content && sData.encoding === "base64" && sData.size < 50000) {
          const content = Buffer.from(sData.content, "base64").toString("utf-8");
          keySourceSnippets.push({
            path: sourcePath,
            contentSnippet: content.slice(0, 1500),
          });
        }
      }
    }
  } catch {
    // Return gracefully on fetch error
  }

  return {
    repoName,
    repoUrl,
    readmeText,
    manifestDependencies,
    filePaths,
    keySourceSnippets,
  };
}
