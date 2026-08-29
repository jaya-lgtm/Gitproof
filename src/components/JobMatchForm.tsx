"use client";

import { useState } from "react";

interface JobMatchFormProps {
  onMatch: (githubUrl: string, jobDescription: string) => void;
  isLoading: boolean;
}

const SAMPLE_JOB_DESCRIPTIONS = [
  {
    title: "Full Stack Engineer (React / Node.js)",
    text: `We are looking for a Full Stack Engineer proficient in TypeScript, React, Next.js, and Node.js. 
Requirements:
- Strong experience with Tailwind CSS, REST APIs, and PostgreSQL or MongoDB.
- Experience with Docker, CI/CD pipelines, and Jest/Vitest automated testing.
- Understanding of authentication (JWT / OAuth) and state management (Zustand / Redux).`,
  },
  {
    title: "Backend Engineer (Python / FastAPI)",
    text: `Looking for a Senior Backend Engineer to build high-performance data processing pipelines.
Requirements:
- Expert Python development experience with FastAPI, Django, or Flask.
- Deep knowledge of PostgreSQL, Redis caching, SQLAlchemy, and Docker containerization.
- Experience writing unit tests with PyTest and designing REST APIs.`,
  },
];

export function JobMatchForm({ onMatch, isLoading }: JobMatchFormProps) {
  const [githubUrl, setGithubUrl] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (githubUrl.trim() && jobDescription.trim() && !isLoading) {
      onMatch(githubUrl.trim(), jobDescription.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto space-y-6">
      <div className="space-y-4">
        {/* GitHub Profile URL */}
        <div className="p-3 rounded-2xl glass-card">
          <label className="block text-xs font-semibold uppercase text-blue-400 px-1 mb-1 font-mono">
            GitHub Profile URL or Username
          </label>
          <input
            type="text"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            placeholder="e.g. https://github.com/octocat or @octocat"
            className="w-full bg-transparent px-2 py-1 text-slate-100 placeholder-slate-500 text-sm focus:outline-none"
            disabled={isLoading}
          />
        </div>

        {/* Job Description Textarea */}
        <div className="p-4 rounded-2xl glass-card space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label className="block text-xs font-semibold uppercase text-blue-400 font-mono">
              Paste Job Description (JD)
            </label>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400 font-mono">Quick Samples:</span>
              {SAMPLE_JOB_DESCRIPTIONS.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setJobDescription(sample.text)}
                  className="text-[11px] px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors cursor-pointer"
                >
                  {sample.title}
                </button>
              ))}
            </div>
          </div>

          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={6}
            placeholder="Paste the job requirements, tech stack, and responsibilities here..."
            className="w-full bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500/50 resize-y font-sans leading-relaxed"
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="text-center">
        <button
          type="submit"
          disabled={isLoading || !githubUrl.trim() || !jobDescription.trim()}
          className="px-8 py-3.5 rounded-xl btn-primary text-sm font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer inline-flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>Analyzing Repo Deep Content & Matching...</span>
            </>
          ) : (
            <span>Match Job & Rank Projects</span>
          )}
        </button>
      </div>
    </form>
  );
}
