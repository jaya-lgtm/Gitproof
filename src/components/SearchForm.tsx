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
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto space-y-2">
      <div className="text-[10px] font-mono font-bold tracking-wider text-[#F9732F] uppercase flex items-center justify-between px-1">
        <span>ANALYZE DEVELOPER PROFILE</span>
        <span className="text-[#6B7280] font-sans font-normal text-[10px]">Command Console</span>
      </div>

      <div className="relative p-2 rounded-xl bg-[#181A1C] border border-[#2A2D30] shadow-2xl transition-all focus-within:border-[#F9732F] focus-within:ring-1 focus-within:ring-[#F9732F]/20">
        <div className="flex flex-col sm:flex-row items-center gap-2">
          {/* Input Field */}
          <div className="flex items-center gap-3 flex-1 w-full pl-3 pr-2 py-1">
            <svg
              className="w-4 h-4 text-[#9CA3AF] shrink-0"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.258-1.11-1.594-1.11-1.594-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              />
            </svg>
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="Paste GitHub URL or @username"
              className="w-full bg-transparent text-[#F5F2ED] placeholder-[#6B7280] text-sm focus:outline-none font-mono"
              disabled={isLoading}
            />
          </div>

          {/* Submit CTA Button */}
          <button
            type="submit"
            disabled={isLoading || !inputUrl.trim()}
            className="w-full sm:w-auto px-6 py-2.5 rounded-lg btn-orange text-xs font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 shrink-0 font-sans tracking-wide uppercase"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-3.5 w-3.5 text-[#0D0F10]"
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
                <span>Analyzing Evidence...</span>
              </>
            ) : (
              <span>Run Analysis</span>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
