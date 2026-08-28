import { NextRequest, NextResponse } from "next/server";
import { parseGitHubUsername } from "@/lib/parser";
import { fetchGitHubUserData } from "@/lib/github";
import {
  selectCandidateRepositories,
  fetchRepositoryDeepContent,
  RepositoryContentEvidence,
} from "@/lib/github-content";
import {
  parseJobDescription,
  rankRepositoriesForJob,
} from "@/lib/job-matcher";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, jobDescription } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { success: false, error: "GitHub profile URL or username is required." },
        { status: 400 }
      );
    }

    if (!jobDescription || typeof jobDescription !== "string" || !jobDescription.trim()) {
      return NextResponse.json(
        { success: false, error: "Job description text is required for matching." },
        { status: 400 }
      );
    }

    // 1. Parse GitHub Username
    const parseResult = parseGitHubUsername(url);
    if (!parseResult.success || !parseResult.username) {
      return NextResponse.json(
        { success: false, error: parseResult.error || "Invalid GitHub URL." },
        { status: 400 }
      );
    }

    // 2. Fetch User & Repositories
    const githubResult = await fetchGitHubUserData(parseResult.username);
    if (!githubResult.success || !githubResult.user) {
      const status = githubResult.isRateLimited ? 429 : 404;
      return NextResponse.json(
        { success: false, error: githubResult.error },
        { status }
      );
    }

    const repos = githubResult.repos || [];
    if (repos.length === 0) {
      return NextResponse.json({
        success: true,
        user: githubResult.user,
        jobRequirements: parseJobDescription(jobDescription),
        rankedProjects: [],
      });
    }

    // 3. Extract Job Description Skills
    const jobRequirements = parseJobDescription(jobDescription);

    // 4. Lightweight relevance analysis to pick top 10-15 candidate repos
    const candidateRepos = selectCandidateRepositories(
      repos,
      jobRequirements.keywords,
      12
    );

    // 5. Deep inspection of candidate repos (README, manifests, key source files)
    const deepEvidenceMap: Record<string, RepositoryContentEvidence> = {};

    const contentPromises = candidateRepos.map(async (repo) => {
      const deepContent = await fetchRepositoryDeepContent(
        githubResult.user!.login,
        repo
      );
      deepEvidenceMap[repo.name] = deepContent;
    });

    await Promise.all(contentPromises);

    // 6. Rank Repositories against Job Requirements
    const rankedProjects = rankRepositoriesForJob(
      jobRequirements,
      candidateRepos,
      deepEvidenceMap
    );

    return NextResponse.json({
      success: true,
      username: parseResult.username,
      user: githubResult.user,
      jobRequirements,
      rankedProjects,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { success: false, error: `An error occurred: ${message}` },
      { status: 500 }
    );
  }
}
