"use client";

import Link from "next/link";
import { Header } from "@/components/Header";
import { useAuth } from "@/context/AuthContext";
import { ProfileCard } from "@/components/ProfileCard";

export default function SavedProofsPage() {
  const { savedProofs, removeSavedProof } = useAuth();

  return (
    <main className="min-h-screen bg-[#020617] text-slate-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white relative overflow-hidden">
      {/* Background Accent Gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-[30rem] h-[30rem] bg-blue-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute top-1/3 -right-40 w-[30rem] h-[30rem] bg-violet-600/10 rounded-full blur-[120px]"></div>
      </div>

      <Header />

      <div className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-12 space-y-8 relative z-10">
        <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-100 flex items-center gap-3">
              <span>Saved Proofs</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs bg-blue-950/80 text-blue-400 border border-blue-800/80 font-mono">
                {savedProofs.length} Saved
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Your bookmarked developer profiles and verified proof-of-work cards stored in local session
            </p>
          </div>
        </div>

        {savedProofs.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center space-y-4">
            <p className="text-slate-400 text-sm">No saved profiles or proofs yet.</p>
            <Link
              href="/"
              className="inline-block px-4 py-2 rounded-xl btn-primary font-bold text-xs transition-colors"
            >
              Analyze & Save a Profile
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {savedProofs.map((item) => (
              <div
                key={item.username}
                className="relative glass-card rounded-2xl p-2 space-y-4"
              >
                <div className="flex items-center justify-between px-4 pt-2">
                  <span className="text-xs text-slate-400 font-mono">
                    Saved on {new Date(item.savedAt).toLocaleDateString()}
                  </span>
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/?url=${encodeURIComponent(item.username)}`}
                      className="text-xs text-blue-400 hover:underline font-semibold font-mono"
                    >
                      Analyze Fresh Proof
                    </Link>
                    <button
                      onClick={() => removeSavedProof(item.username)}
                      className="text-xs text-slate-500 hover:text-rose-400 font-mono cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <ProfileCard user={item.user} />
              </div>
            ))}
          </div>
        )}
      </div>

      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500 font-mono">
        GitProof &copy; {new Date().getFullYear()} — Saved Proofs
      </footer>
    </main>
  );
}
