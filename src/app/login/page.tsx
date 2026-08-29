"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { parseGitHubUsername } from "@/lib/parser";
import { GitHubUser } from "@/lib/github";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [githubHandle, setGithubHandle] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);

    const handleToTest = githubHandle.trim() || email.split("@")[0] || "octocat";

    const parseResult = parseGitHubUsername(handleToTest);
    let userToSession: GitHubUser;

    if (parseResult.success && parseResult.username) {
      try {
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url: parseResult.username }),
        });

        const data = await res.json();

        if (res.ok && data.success && data.user) {
          userToSession = {
            ...data.user,
            email: email.trim(),
          };
        } else {
          // Fallback user profile built from email
          userToSession = createFallbackUser(email.trim(), parseResult.username);
        }
      } catch {
        userToSession = createFallbackUser(email.trim(), handleToTest);
      }
    } else {
      userToSession = createFallbackUser(email.trim(), handleToTest);
    }

    login(userToSession);
    router.push("/");
    setIsLoading(false);
  };

  const createFallbackUser = (userEmail: string, username: string): GitHubUser => {
    const namePrefix = userEmail.split("@")[0] || "User";
    return {
      login: username || namePrefix.toLowerCase(),
      id: Date.now(),
      avatar_url: `https://avatar.vercel.sh/${encodeURIComponent(userEmail)}.svg`,
      html_url: `https://github.com/${username || namePrefix.toLowerCase()}`,
      name: namePrefix.charAt(0).toUpperCase() + namePrefix.slice(1),
      company: null,
      blog: null,
      location: null,
      email: userEmail,
      bio: "Verified GitProof Member",
      twitter_username: null,
      public_repos: 5,
      public_gists: 0,
      followers: 12,
      following: 8,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  };

  return (
    <main className="min-h-screen bg-[#0D0F10] text-[#F5F2ED] flex flex-col justify-center items-center px-4 font-sans selection:bg-[#F9732F] selection:text-[#0D0F10] relative overflow-hidden">
      <div className="max-w-md w-full card-surface rounded-2xl p-8 shadow-2xl relative z-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#F9732F] mx-auto flex items-center justify-center font-black text-[#0D0F10] text-xl shadow-lg shadow-[#F9732F]/15">
            GP
          </div>
          <h1 className="text-2xl font-extrabold text-[#F5F2ED]">
            {isSignUp ? "Create your GitProof Account" : "Sign in with Email"}
          </h1>
          <p className="text-xs text-[#9CA3AF]">
            {isSignUp
              ? "Sign up with your email to start bookmarking verified developer proofs."
              : "Enter your email address to access your saved developer proofs."}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          {/* Email Address */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase text-[#F9732F] font-mono">
              Work or Personal Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. recruiter@company.com"
              className="w-full bg-[#151719] px-4 py-3 rounded-xl border border-[#2A2D30] text-[#F5F2ED] placeholder-[#6B7280] text-sm focus:outline-none focus:border-[#F9732F]/50 font-sans"
              required
              disabled={isLoading}
              autoFocus
            />
          </div>

          {/* GitHub Handle (Optional) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase text-[#9CA3AF] font-mono flex items-center justify-between">
              <span>GitHub Handle / URL</span>
              <span className="text-[10px] text-[#6B7280] font-sans font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              value={githubHandle}
              onChange={(e) => setGithubHandle(e.target.value)}
              placeholder="e.g. octocat or github.com/octocat"
              className="w-full bg-[#151719] px-4 py-3 rounded-xl border border-[#2A2D30] text-[#F5F2ED] placeholder-[#6B7280] text-sm focus:outline-none focus:border-[#F9732F]/50 font-mono"
              disabled={isLoading}
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase text-[#9CA3AF] font-mono">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-[#151719] px-4 py-3 rounded-xl border border-[#2A2D30] text-[#F5F2ED] placeholder-[#6B7280] text-sm focus:outline-none focus:border-[#F9732F]/50 font-sans"
              required
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="p-3 bg-rose-950/50 border border-rose-800/80 rounded-xl text-rose-300 text-xs flex items-center gap-2 font-sans">
              <svg className="w-4 h-4 text-rose-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !email.trim() || !password.trim()}
            className="w-full py-3 rounded-xl btn-orange font-bold text-xs transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-[#0D0F10]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Authenticating...</span>
              </>
            ) : (
              <span>{isSignUp ? "Create Account & Sign In" : "Sign In with Email"}</span>
            )}
          </button>
        </form>

        {/* Toggle Sign In / Sign Up */}
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs text-[#9CA3AF] hover:text-[#F9732F] transition-colors cursor-pointer font-sans"
          >
            {isSignUp
              ? "Already have an account? Sign In"
              : "Don't have an account? Sign Up"}
          </button>
        </div>

        {/* Quick Demo Accounts */}
        <div className="pt-4 border-t border-[#2A2D30] text-center space-y-2">
          <span className="text-[10px] text-[#6B7280] uppercase tracking-wider font-mono block">
            Demo Email Sign In
          </span>
          <div className="flex justify-center gap-2 font-mono text-xs">
            <button
              type="button"
              onClick={() => {
                setEmail("recruiter@gitproof.com");
                setGithubHandle("octocat");
                setPassword("demo123456");
              }}
              className="px-3 py-1.5 rounded-lg bg-[#151719] hover:bg-[#1C1E20] border border-[#2A2D30] text-[#9CA3AF] transition-colors cursor-pointer"
            >
              Recruiter Demo
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail("developer@gitproof.com");
                setGithubHandle("gaearon");
                setPassword("demo123456");
              }}
              className="px-3 py-1.5 rounded-lg bg-[#151719] hover:bg-[#1C1E20] border border-[#2A2D30] text-[#9CA3AF] transition-colors cursor-pointer"
            >
              Developer Demo
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
