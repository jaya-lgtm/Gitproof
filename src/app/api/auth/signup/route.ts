import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail, createUserInDB, hashPassword } from "@/lib/db";

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

    if (!password || typeof password !== "string" || password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    const existingUser = findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "An account with this email already exists. Please sign in." },
        { status: 400 }
      );
    }

    const passwordHash = hashPassword(password);
    const newUser = createUserInDB(email, passwordHash);

    const namePrefix = email.split("@")[0] || "User";
    const userSession = {
      login: namePrefix.toLowerCase(),
      id: Date.now(),
      avatar_url: `https://avatar.vercel.sh/${encodeURIComponent(email)}.svg`,
      html_url: `https://github.com/${namePrefix.toLowerCase()}`,
      name: namePrefix.charAt(0).toUpperCase() + namePrefix.slice(1),
      email: newUser.email,
      bio: "Verified GitProof Member",
      public_repos: 0,
      followers: 0,
      following: 0,
      created_at: newUser.createdAt,
      updated_at: newUser.createdAt,
    };

    return NextResponse.json({
      success: true,
      user: userSession,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { success: false, error: `Sign up failed: ${message}` },
      { status: 500 }
    );
  }
}
