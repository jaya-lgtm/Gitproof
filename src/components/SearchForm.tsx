"use client";

import { useState } from "react";

interface SearchFormProps {
  onSearch: (url: string) => void;
  isLoading: boolean;
}

export function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  const [inputUrl, setInputUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputUrl.trim() && !isLoading) {
      onSearch(inputUrl.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative flex flex-col sm:flex-row items-center gap-3 p-2 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-2xl backdrop-blur-xl">
        <div className="relative flex-1 w-full pl-3 pr-2 py-1">
          <input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="e.g. https://github.com/octocat or @octocat"
            className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-sm sm:text-base focus:outline-none"
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !inputUrl.trim()}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-semibold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin h-4 w-4 text-slate-950"
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
              <span>Analyzing...</span>
            </>
          ) : (
            <span>Analyze GitHub</span>
          )}
        </button>
      </div>
      <p className="mt-2 text-center text-xs text-slate-500">
        Supports full GitHub profile URLs, github.com/username, or @username
      </p>
    </form>
  );
}
