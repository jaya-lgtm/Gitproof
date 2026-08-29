import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail, hashPassword } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { success: false, error: "Please enter your password." },
        { status: 400 }
      );
    }

    const user = findUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid email address or password." },
        { status: 401 }
      );
    }

    const passwordHash = hashPassword(password);
    if (user.passwordHash !== passwordHash) {
      return NextResponse.json(
        { success: false, error: "Invalid email address or password." },
        { status: 401 }
      );
    }

    const namePrefix = email.split("@")[0] || "User";
    const userSession = {
      login: namePrefix.toLowerCase(),
      id: Date.now(),
      avatar_url: `https://avatar.vercel.sh/${encodeURIComponent(email)}.svg`,
      html_url: `https://github.com/${namePrefix.toLowerCase()}`,
      name: namePrefix.charAt(0).toUpperCase() + namePrefix.slice(1),
      email: user.email,
      bio: "Verified GitProof Member",
      public_repos: 0,
      followers: 0,
      following: 0,
      created_at: user.createdAt,
      updated_at: user.createdAt,
    };

    return NextResponse.json({
      success: true,
      user: userSession,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { success: false, error: `Login failed: ${message}` },
      { status: 500 }
    );
  }
}
