import { GitHubRepository } from "./github";
import { RepositoryContentEvidence } from "./github-content";

export interface ExtractedJobRequirements {
  rawText: string;
  requiredSkills: string[];
  preferredSkills: string[];
  technologies: string[];
  frameworks: string[];
  languages: string[];
  keywords: string[];
}

export interface RankedProjectMatch {
  repository: GitHubRepository;
  matchScore: number; // 0 - 100
  scoreBreakdown: {
    implementationScore: number; // 35%
    manifestScore: number;       // 25%
    languageScore: number;       // 20%
    readmeScore: number;         // 15%
    activityScore: number;       // 5%
  };
  matchedSkills: string[];
  missingSkills: string[];
  matchReason: string;
  evidenceQuotes: Array<{ source: string; snippet: string }>;
}

export interface JobMatchResult {
  jobRequirements: ExtractedJobRequirements;
  rankedProjects: RankedProjectMatch[];
}

const COMMON_TECH_DICTIONARY = [
  "TypeScript", "JavaScript", "Python", "Java", "C++", "C#", "Go", "Golang", "Rust", "PHP", "Ruby", "Swift", "Kotlin",
  "React", "React Native", "Next.js", "Vue", "Nuxt", "Angular", "Svelte", "Node.js", "Express", "NestJS", "FastAPI", "Django", "Flask", "Spring Boot", ".NET", "ASP.NET", "Rails", "Laravel",
  "Tailwind CSS", "Tailwind", "CSS", "HTML", "Sass", "Bootstrap",
  "PostgreSQL", "Postgres", "MySQL", "MongoDB", "Redis", "SQLite", "DynamoDB", "Prisma", "TypeORM", "SQLAlchemy",
  "Docker", "Kubernetes", "AWS", "Azure", "GCP", "Serverless", "Terraform", "CI/CD", "GitHub Actions",
  "GraphQL", "REST API", "gRPC", "WebSockets", "Kafka", "RabbitMQ",
  "Jest", "Vitest", "Cypress", "Playwright", "PyTest",
  "JWT", "OAuth", "Zustand", "Redux", "Webpack", "Vite"
];

/**
 * Parses raw job description into structured technical requirements
 */
export function parseJobDescription(jobDescriptionText: string): ExtractedJobRequirements {
  const text = jobDescriptionText.trim();
  const lowerText = text.toLowerCase();

  const foundTechs = new Set<string>();

  COMMON_TECH_DICTIONARY.forEach((tech) => {
    const techLower = tech.toLowerCase();
    // Regex word boundary match
    const regex = new RegExp(`\\b${techLower.replace(".", "\\.")}\\b`, "i");
    if (regex.test(lowerText)) {
      foundTechs.add(tech);
    }
  });

  const extractedList = Array.from(foundTechs);

  // Divide extracted list into languages, frameworks, technologies
  const languagesList = ["TypeScript", "JavaScript", "Python", "Java", "C++", "C#", "Go", "Golang", "Rust", "PHP", "Ruby", "Swift", "Kotlin"];
  const frameworksList = ["React", "React Native", "Next.js", "Vue", "Angular", "Svelte", "Node.js", "Express", "NestJS", "FastAPI", "Django", "Flask", "Spring Boot", ".NET", "Rails", "Laravel", "Tailwind CSS", "Tailwind"];

  const languages = extractedList.filter((t) => languagesList.includes(t));
  const frameworks = extractedList.filter((t) => frameworksList.includes(t));
  const technologies = extractedList.filter((t) => !languages.includes(t) && !frameworks.includes(t));

  return {
    rawText: text,
    requiredSkills: extractedList.slice(0, 8),
    preferredSkills: extractedList.slice(8),
    technologies,
    frameworks,
    languages,
    keywords: extractedList,
  };
}

/**
 * Matches extracted Job Requirements against Repository Content Evidence
 * Weighted Scoring:
 * - 35%: Explicit implementation/source code evidence
 * - 25%: Dependency/manifest matches
 * - 20%: Language/framework matches
 * - 15%: README/description/topics matches
 * - 5%: Activity/recency
 */
export function rankRepositoriesForJob(
  jobRequirements: ExtractedJobRequirements,
  repositories: GitHubRepository[],
  deepEvidenceMap: Record<string, RepositoryContentEvidence>
): RankedProjectMatch[] {
  const targetSkills = jobRequirements.keywords;
  if (targetSkills.length === 0) {
    return repositories.map((repo) => ({
      repository: repo,
      matchScore: 0,
      scoreBreakdown: { implementationScore: 0, manifestScore: 0, languageScore: 0, readmeScore: 0, activityScore: 0 },
      matchedSkills: [],
      missingSkills: [],
      matchReason: "No technical keywords were identified in the job description.",
      evidenceQuotes: [],
    }));
  }

  const matches: RankedProjectMatch[] = [];

  for (const repo of repositories) {
    const deepData = deepEvidenceMap[repo.name] || {
      repoName: repo.name,
      repoUrl: repo.html_url,
      manifestDependencies: [],
      filePaths: [],
      keySourceSnippets: [],
    };

    const matchedSkillsSet = new Set<string>();
    const evidenceQuotes: Array<{ source: string; snippet: string }> = [];

    // 1. Implementation & Source Code Score (35%)
    let implMatchesCount = 0;
    deepData.keySourceSnippets.forEach((snippet) => {
      targetSkills.forEach((skill) => {
        const regex = new RegExp(`\\b${skill.toLowerCase().replace(".", "\\.")}\\b`, "i");
        if (regex.test(snippet.contentSnippet.toLowerCase())) {
          implMatchesCount += 1;
          matchedSkillsSet.add(skill);
          if (evidenceQuotes.length < 3) {
            const line = snippet.contentSnippet
              .split("\n")
              .find((l) => regex.test(l));
            if (line) {
              evidenceQuotes.push({
                source: `Source (${snippet.path})`,
                snippet: line.trim().slice(0, 100),
              });
            }
          }
        }
      });
    });
    const implementationScore = Math.min((implMatchesCount / targetSkills.length) * 100, 100);

    // 2. Dependency & Manifest Score (25%)
    let manifestMatchesCount = 0;
    deepData.manifestDependencies.forEach((dep) => {
      targetSkills.forEach((skill) => {
        if (dep.toLowerCase().includes(skill.toLowerCase())) {
          manifestMatchesCount += 1;
          matchedSkillsSet.add(skill);
          if (evidenceQuotes.length < 4) {
            evidenceQuotes.push({
              source: "Manifest Dependency",
              snippet: dep,
            });
          }
        }
      });
    });
    const manifestScore = Math.min((manifestMatchesCount / Math.max(targetSkills.length, 1)) * 100, 100);

    // 3. Language & Primary Stack Score (20%)
    let languageScore = 0;
    if (repo.language && targetSkills.some((s) => s.toLowerCase() === repo.language!.toLowerCase())) {
      languageScore = 100;
      matchedSkillsSet.add(repo.language);
      evidenceQuotes.push({
        source: "Primary Language",
        snippet: `Repository primary language: ${repo.language}`,
      });
    }

    // 4. README / Description / Topics Score (15%)
    let readmeMatchesCount = 0;
    const readmeLower = (deepData.readmeText || "").toLowerCase();
    const descLower = (repo.description || "").toLowerCase();
    const topicsLower = (repo.topics || []).map((t) => t.toLowerCase());

    targetSkills.forEach((skill) => {
      const sLower = skill.toLowerCase();
      if (readmeLower.includes(sLower) || descLower.includes(sLower) || topicsLower.includes(sLower)) {
        readmeMatchesCount += 1;
        matchedSkillsSet.add(skill);
        if (evidenceQuotes.length < 5 && readmeLower.includes(sLower)) {
          const matchedLine = (deepData.readmeText || "")
            .split("\n")
            .find((l) => l.toLowerCase().includes(sLower));
          if (matchedLine) {
            evidenceQuotes.push({
              source: "README Documentation",
              snippet: matchedLine.trim().slice(0, 100),
            });
          }
        }
      }
    });
    const readmeScore = Math.min((readmeMatchesCount / Math.max(targetSkills.length, 1)) * 100, 100);

    // 5. Activity & Recency Score (5%)
    const now = new Date();
    const lastPushed = new Date(repo.pushed_at || repo.updated_at);
    const monthsDiff = (now.getTime() - lastPushed.getTime()) / (1000 * 60 * 60 * 24 * 30);
    const activityScore = Math.max(100 - monthsDiff * 10, 0);

    // Weighted Total Score Calculation
    const totalScore = Math.round(
      implementationScore * 0.35 +
        manifestScore * 0.25 +
        languageScore * 0.2 +
        readmeScore * 0.15 +
        activityScore * 0.05
    );

    const matchedSkills = Array.from(matchedSkillsSet);
    const missingSkills = targetSkills.filter((s) => !matchedSkillsSet.has(s));

    // Reasoning statement
    let matchReason = "";
    if (matchedSkills.length > 0) {
      matchReason = `Matches ${matchedSkills.length} job skills (${matchedSkills.join(", ")}) backed by verified repo source files, dependencies, or README documentation.`;
    } else {
      matchReason = "No direct technology overlap identified in repository content or dependencies.";
    }

    matches.push({
      repository: repo,
      matchScore: totalScore,
      scoreBreakdown: {
        implementationScore: Math.round(implementationScore),
        manifestScore: Math.round(manifestScore),
        languageScore: Math.round(languageScore),
        readmeScore: Math.round(readmeScore),
        activityScore: Math.round(activityScore),
      },
      matchedSkills,
      missingSkills,
      matchReason,
      evidenceQuotes,
    });
  }

  // Rank descending by matchScore
  matches.sort((a, b) => b.matchScore - a.matchScore);

  return matches;
}
