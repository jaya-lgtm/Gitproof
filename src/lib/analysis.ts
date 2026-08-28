import { GitHubUser, GitHubRepository } from "./github";

export interface EvidenceCard {
  id: string;
  category: "languages" | "impact" | "activity" | "repository";
  title: string;
  summary: string;
  evidence: string[];
  supportingRepos: Array<{
    name: string;
    url: string;
    stars: number;
    language?: string | null;
  }>;
  evidenceStrength: "Verified High" | "Verified Medium" | "Verified";
}

export interface AnalysisResult {
  topLanguages: Array<{ language: string; count: number; percentage: number }>;
  totalStars: number;
  totalForks: number;
  cards: EvidenceCard[];
}

export function generateProofOfWork(
  user: GitHubUser,
  repos: GitHubRepository[]
): AnalysisResult {
  // 1. Language Breakdown
  const languageCounts: Record<string, number> = {};
  let totalLangRepos = 0;

  repos.forEach((repo) => {
    if (repo.language) {
      languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
      totalLangRepos += 1;
    }
  });

  const topLanguages = Object.entries(languageCounts)
    .map(([language, count]) => ({
      language,
      count,
      percentage: totalLangRepos > 0 ? Math.round((count / totalLangRepos) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);

  // 2. Stars & Forks calculation
  const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
  const totalForks = repos.reduce((sum, repo) => sum + repo.forks_count, 0);

  const cards: EvidenceCard[] = [];

  // Card 1: Primary Technology Focus
  if (topLanguages.length > 0) {
    const primary = topLanguages[0];
    const primaryRepos = repos
      .filter((r) => r.language === primary.language)
      .slice(0, 3);

    cards.push({
      id: "primary-language",
      category: "languages",
      title: `Core Expertise in ${primary.language}`,
      summary: `Demonstrates repeated practical application of ${primary.language} across ${primary.count} public repository projects (${primary.percentage}% of categorized repos).`,
      evidence: [
        `${primary.count} repositories written primarily in ${primary.language}`,
        `Accounts for ${primary.percentage}% of all categorized public projects`,
      ],
      supportingRepos: primaryRepos.map((r) => ({
        name: r.name,
        url: r.html_url,
        stars: r.stargazers_count,
        language: r.language,
      })),
      evidenceStrength: primary.count >= 3 ? "Verified High" : "Verified",
    });
  }

  // Card 2: Multi-Language Capability (if user has 2+ languages)
  if (topLanguages.length >= 2) {
    const secondaryLangs = topLanguages.slice(1, 4);
    const langListStr = secondaryLangs.map((l) => l.language).join(", ");
    
    cards.push({
      id: "polyglot-stack",
      category: "languages",
      title: "Polyglot Engineering Skills",
      summary: `Active development presence across multiple technical stacks including ${langListStr}.`,
      evidence: topLanguages.slice(0, 4).map(
        (l) => `${l.language}: ${l.count} public ${l.count === 1 ? "repository" : "repositories"}`
      ),
      supportingRepos: repos
        .filter((r) => r.language && r.language !== topLanguages[0].language)
        .slice(0, 3)
        .map((r) => ({
          name: r.name,
          url: r.html_url,
          stars: r.stargazers_count,
          language: r.language,
        })),
      evidenceStrength: "Verified Medium",
    });
  }

  // Card 3: Notable / High Engagement Repositories
  const starredRepos = [...repos]
    .filter((r) => !r.fork && r.stargazers_count > 0)
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 3);

  if (starredRepos.length > 0) {
    cards.push({
      id: "community-engagement",
      category: "impact",
      title: "Public Project Engagement & Stars",
      summary: `Created public open-source software that earned community stars on GitHub.`,
      evidence: [
        `Accumulated ${totalStars} total stargazers across public repositories`,
        `Top project '${starredRepos[0].name}' earned ${starredRepos[0].stargazers_count} stars`,
      ],
      supportingRepos: starredRepos.map((r) => ({
        name: r.name,
        url: r.html_url,
        stars: r.stargazers_count,
        language: r.language,
      })),
      evidenceStrength: totalStars >= 5 ? "Verified High" : "Verified",
    });
  }

  // Card 4: Open Source Contributions / Forks
  const forkedRepos = [...repos]
    .filter((r) => r.fork)
    .slice(0, 3);

  if (forkedRepos.length > 0) {
    cards.push({
      id: "open-source-forks",
      category: "repository",
      title: "Open Source Collaboration & Upstream Forking",
      summary: `Maintains forks of external open-source repositories to study, modify, or contribute back.`,
      evidence: [
        `Maintains ${forkedRepos.length} public repository forks`,
        `Includes projects: ${forkedRepos.map((r) => r.name).join(", ")}`,
      ],
      supportingRepos: forkedRepos.map((r) => ({
        name: r.name,
        url: r.html_url,
        stars: r.stargazers_count,
        language: r.language,
      })),
      evidenceStrength: "Verified",
    });
  }

  // Card 5: Recent Engineering Activity
  const now = new Date();
  const sixMonthsAgo = new Date(now.setMonth(now.getMonth() - 6));
  const recentRepos = repos.filter(
    (r) => new Date(r.pushed_at || r.updated_at) >= sixMonthsAgo
  );

  if (recentRepos.length > 0) {
    cards.push({
      id: "recent-activity",
      category: "activity",
      title: "Active Code Maintenance",
      summary: `Pushed code to ${recentRepos.length} public ${
        recentRepos.length === 1 ? "repository" : "repositories"
      } within the past 6 months.`,
      evidence: [
        `${recentRepos.length} repositories with verified recent push events`,
        `Most recently active project: '${recentRepos[0].name}' (Updated ${new Date(
          recentRepos[0].pushed_at || recentRepos[0].updated_at
        ).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })})`,
      ],
      supportingRepos: recentRepos.slice(0, 3).map((r) => ({
        name: r.name,
        url: r.html_url,
        stars: r.stargazers_count,
        language: r.language,
      })),
      evidenceStrength: "Verified High",
    });
  }

  // Card 6: Project Scope & Volume
  if (user.public_repos > 0) {
    cards.push({
      id: "repository-volume",
      category: "repository",
      title: `Public Repository Portfolio (${user.public_repos} Projects)`,
      summary: `Maintains a public GitHub footprint of ${user.public_repos} total repositories.`,
      evidence: [
        `Total public repositories: ${user.public_repos}`,
        `Categorized languages across projects: ${topLanguages.length}`,
        `Total public forks created by others: ${totalForks}`,
      ],
      supportingRepos: repos.slice(0, 3).map((r) => ({
        name: r.name,
        url: r.html_url,
        stars: r.stargazers_count,
        language: r.language,
      })),
      evidenceStrength: "Verified",
    });
  }

  return {
    topLanguages,
    totalStars,
    totalForks,
    cards,
  };
}
