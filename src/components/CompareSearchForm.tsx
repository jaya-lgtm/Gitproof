"use client";

import { useState } from "react";

interface CompareSearchFormProps {
  onCompare: (url1: string, url2: string) => void;
  isLoading: boolean;
}

export function CompareSearchForm({ onCompare, isLoading }: CompareSearchFormProps) {
  const [url1, setUrl1] = useState("");
  const [url2, setUrl2] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url1.trim() && url2.trim() && !isLoading) {
      onCompare(url1.trim(), url2.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Profile 1 Input */}
        <div className="p-3 rounded-2xl glass-card">
          <label className="block text-xs font-semibold uppercase text-blue-400 px-1 mb-1 font-mono">
            Developer Profile #1
          </label>
          <input
            type="text"
            value={url1}
            onChange={(e) => setUrl1(e.target.value)}
            placeholder="e.g. github.com/octocat or @octocat"
            className="w-full bg-transparent px-2 py-1 text-slate-100 placeholder-slate-500 text-sm focus:outline-none"
            disabled={isLoading}
          />
        </div>

        {/* Profile 2 Input */}
        <div className="p-3 rounded-2xl glass-card">
          <label className="block text-xs font-semibold uppercase text-violet-400 px-1 mb-1 font-mono">
            Developer Profile #2
          </label>
          <input
            type="text"
            value={url2}
            onChange={(e) => setUrl2(e.target.value)}
            placeholder="e.g. github.com/torvalds or @torvalds"
            className="w-full bg-transparent px-2 py-1 text-slate-100 placeholder-slate-500 text-sm focus:outline-none"
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="text-center">
        <button
          type="submit"
          disabled={isLoading || !url1.trim() || !url2.trim()}
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
              <span>Fetching Both Profiles...</span>
            </>
          ) : (
            <span>Compare Profiles Side-by-Side</span>
          )}
        </button>
      </div>
    </form>
  );
}
