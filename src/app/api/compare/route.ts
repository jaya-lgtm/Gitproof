import { NextRequest, NextResponse } from "next/server";
import { parseGitHubUsername } from "@/lib/parser";
import { fetchGitHubUserData } from "@/lib/github";
import { generateProofOfWork } from "@/lib/analysis";
import { translateEvidenceToRecruiterProof } from "@/lib/translator";

async function analyzeSingleProfile(url: string) {
  const parseResult = parseGitHubUsername(url);
  if (!parseResult.success || !parseResult.username) {
    return {
      success: false,
      error: parseResult.error || `Invalid GitHub URL/username: '${url}'`,
    };
  }

  const githubResult = await fetchGitHubUserData(parseResult.username);
  if (!githubResult.success || !githubResult.user) {
    return {
      success: false,
      error: githubResult.error || `Failed to fetch data for '${parseResult.username}'`,
      isRateLimited: githubResult.isRateLimited,
    };
  }

  const repos = githubResult.repos || [];
  const rawEvidences = githubResult.evidences || [];

  const [analysis, translatedEvidences] = await Promise.all([
    generateProofOfWork(githubResult.user, repos),
    translateEvidenceToRecruiterProof(rawEvidences),
  ]);

  return {
    success: true,
    username: parseResult.username,
    user: githubResult.user,
    repos,
    evidences: translatedEvidences,
    analysis,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url1, url2 } = body;

    if (!url1 || typeof url1 !== "string" || !url2 || typeof url2 !== "string") {
      return NextResponse.json(
        { success: false, error: "Two GitHub profile URLs or usernames are required for comparison." },
        { status: 400 }
      );
    }

    // Process both profiles concurrently
    const [profile1Result, profile2Result] = await Promise.all([
      analyzeSingleProfile(url1),
      analyzeSingleProfile(url2),
    ]);

    if (!profile1Result.success) {
      return NextResponse.json(
        { success: false, error: `Profile 1 error: ${profile1Result.error}` },
        { status: profile1Result.isRateLimited ? 429 : 400 }
      );
    }

    if (!profile2Result.success) {
      return NextResponse.json(
        { success: false, error: `Profile 2 error: ${profile2Result.error}` },
        { status: profile2Result.isRateLimited ? 429 : 400 }
      );
    }

    return NextResponse.json({
      success: true,
      profile1: profile1Result,
      profile2: profile2Result,
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
