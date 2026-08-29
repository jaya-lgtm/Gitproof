"use client";

import Link from "next/link";
import { Header } from "@/components/Header";
import { useAuth } from "@/context/AuthContext";
import { ProfileCard } from "@/components/ProfileCard";

export default function SavedProofsPage() {
  const { savedProofs, removeSavedProof } = useAuth();

  return (
    <main className="min-h-screen bg-[#080A0F] text-zinc-100 flex flex-col font-sans selection:bg-[#C8FF4A] selection:text-[#080A0F] relative overflow-hidden">
      <Header />

      <div className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-12 space-y-8 relative z-10">
        <div className="border-b border-[#1F2432] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-zinc-100 flex items-center gap-3">
              <span>Saved Proofs</span>
              <span className="px-2.5 py-0.5 rounded text-xs badge-lime font-mono">
                {savedProofs.length} Saved
              </span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Your bookmarked developer profiles and verified proof-of-work cards stored in local session
            </p>
          </div>
        </div>

        {savedProofs.length === 0 ? (
          <div className="card-surface rounded-2xl p-12 text-center space-y-4">
            <p className="text-zinc-400 text-sm">No saved profiles or proofs yet.</p>
            <Link
              href="/"
              className="inline-block px-4 py-2 rounded-xl btn-lime text-xs font-bold transition-colors"
            >
              Analyze & Save a Profile
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {savedProofs.map((item) => (
              <div
                key={item.username}
                className="relative card-surface rounded-2xl p-2 space-y-4"
              >
                <div className="flex items-center justify-between px-4 pt-2">
                  <span className="text-xs text-zinc-400 font-mono">
                    Saved on {new Date(item.savedAt).toLocaleDateString()}
                  </span>
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/?url=${encodeURIComponent(item.username)}`}
                      className="text-xs text-[#38BDF8] hover:underline font-semibold font-mono"
                    >
                      Analyze Fresh Proof
                    </Link>
                    <button
                      onClick={() => removeSavedProof(item.username)}
                      className="text-xs text-zinc-500 hover:text-rose-400 font-mono cursor-pointer"
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

      <footer className="border-t border-[#1F2432] py-6 text-center text-xs text-zinc-500 font-mono">
        GitProof &copy; {new Date().getFullYear()} — Saved Proofs
      </footer>
    </main>
  );
}
