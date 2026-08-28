import { NextRequest, NextResponse } from "next/server";
import { parseGitHubUsername } from "@/lib/parser";
import { fetchGitHubUserData } from "@/lib/github";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { success: false, error: "GitHub URL or username is required." },
        { status: 400 }
      );
    }

    const parseResult = parseGitHubUsername(url);
    if (!parseResult.success || !parseResult.username) {
      return NextResponse.json(
        { success: false, error: parseResult.error || "Invalid GitHub URL." },
        { status: 400 }
      );
    }

    const githubResult = await fetchGitHubUserData(parseResult.username);

    if (!githubResult.success) {
      const status = githubResult.isRateLimited ? 429 : 404;
      return NextResponse.json(
        { success: false, error: githubResult.error },
        { status }
      );
    }

    return NextResponse.json({
      success: true,
      username: parseResult.username,
      user: githubResult.user,
      repos: githubResult.repos,
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
