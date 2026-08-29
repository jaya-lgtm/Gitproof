"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { parseGitHubUsername } from "@/lib/parser";

export default function LoginPage() {
  const [inputUrl, setInputUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);

    const parseResult = parseGitHubUsername(inputUrl.trim());
    if (!parseResult.success || !parseResult.username) {
      setError(parseResult.error || "Please enter a valid GitHub username or URL.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: parseResult.username }),
      });

      const data = await res.json();

      if (!res.ok || !data.success || !data.user) {
        setError(data.error || `Could not verify GitHub profile '${parseResult.username}'.`);
      } else {
        login(data.user);
        router.push("/");
      }
    } catch {
      setError("An unexpected network error occurred while verifying the GitHub profile.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 font-sans selection:bg-emerald-500 selection:text-slate-950 relative overflow-hidden">
      {/* Background Accent Gradients */}
      <div className="absolute top-1/4 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-40 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-md w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-8 shadow-2xl backdrop-blur-xl relative z-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 mx-auto flex items-center justify-center font-black text-slate-950 text-xl shadow-lg shadow-emerald-500/20">
            GP
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100">Sign in to GitProof</h1>
          <p className="text-xs text-slate-400">
            Enter your GitHub username or profile URL to verify your identity and start saving proofs.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase text-emerald-400">
              GitHub Username or Profile URL
            </label>
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="e.g. octocat or https://github.com/octocat"
              className="w-full bg-slate-950/80 px-4 py-3 rounded-xl border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500/50"
              disabled={isLoading}
              autoFocus
            />
          </div>

          {error && (
            <div className="p-3 bg-rose-950/50 border border-rose-800/80 rounded-xl text-rose-300 text-xs flex items-center gap-2">
              <svg className="w-4 h-4 text-rose-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !inputUrl.trim()}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-slate-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Verifying GitHub Profile...</span>
              </>
            ) : (
              <span>Verify & Sign In</span>
            )}
          </button>
        </form>

        {/* Quick Demo Sign In Options */}
        <div className="pt-4 border-t border-slate-800 text-center space-y-2">
          <span className="text-[11px] text-slate-500 uppercase tracking-wider font-mono block">
            Demo Accounts
          </span>
          <div className="flex justify-center gap-2">
            <button
              type="button"
              onClick={() => setInputUrl("octocat")}
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors cursor-pointer"
            >
              @octocat
            </button>
            <button
              type="button"
              onClick={() => setInputUrl("gaearon")}
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors cursor-pointer"
            >
              @gaearon
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
