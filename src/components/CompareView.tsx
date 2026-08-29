"use client";

import { ProfileCard } from "@/components/ProfileCard";
import { ProofOfWorkCard } from "@/components/ProofOfWorkCard";
import { DevelopmentEvidenceSection } from "@/components/DevelopmentEvidenceSection";
import { RepositoryList } from "@/components/RepositoryList";
import { GitHubUser, GitHubRepository, RawDevelopmentEvidence } from "@/lib/github";
import { AnalysisResult } from "@/lib/analysis";

export interface ProfileData {
  username: string;
  user: GitHubUser;
  repos: GitHubRepository[];
  evidences: RawDevelopmentEvidence[];
  analysis: AnalysisResult;
}

interface CompareViewProps {
  profile1: ProfileData;
  profile2: ProfileData;
}

export function CompareView({ profile1, profile2 }: CompareViewProps) {
  const p1Repos = profile1.user.public_repos;
  const p2Repos = profile2.user.public_repos;

  const p1Followers = profile1.user.followers;
  const p2Followers = profile2.user.followers;

  const p1Stars = profile1.analysis?.totalStars || 0;
  const p2Stars = profile2.analysis?.totalStars || 0;

  const p1EvCount = profile1.evidences?.length || 0;
  const p2EvCount = profile2.evidences?.length || 0;

  return (
    <div className="space-y-12 animate-fade-in">
      {/* Neutral Side-by-Side Summary Table */}
      <section className="glass-card rounded-2xl p-6 shadow-2xl">
        <h2 className="text-xl font-bold text-slate-100 mb-4 pb-3 border-b border-slate-800 flex items-center justify-between">
          <span>Objective Metric Comparison</span>
          <span className="text-xs text-slate-400 font-mono font-normal">Factual GitHub Data</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-slate-800 text-xs uppercase text-slate-400 font-mono">
                <th className="py-3 px-4">Metric</th>
                <th className="py-3 px-4 text-blue-400 font-bold">
                  {profile1.user.name || profile1.user.login} (@{profile1.user.login})
                </th>
                <th className="py-3 px-4 text-violet-400 font-bold">
                  {profile2.user.name || profile2.user.login} (@{profile2.user.login})
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-slate-200">
              <tr>
                <td className="py-3 px-4 text-slate-400 font-sans">Public Repositories</td>
                <td className="py-3 px-4 font-semibold">{p1Repos}</td>
                <td className="py-3 px-4 font-semibold">{p2Repos}</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-slate-400 font-sans">Total Stargazers Earned</td>
                <td className="py-3 px-4 font-semibold">{p1Stars} ★</td>
                <td className="py-3 px-4 font-semibold">{p2Stars} ★</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-slate-400 font-sans">Followers</td>
                <td className="py-3 px-4 font-semibold">{p1Followers}</td>
                <td className="py-3 px-4 font-semibold">{p2Followers}</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-slate-400 font-sans">Recent Evidence Items</td>
                <td className="py-3 px-4 font-semibold">{p1EvCount}</td>
                <td className="py-3 px-4 font-semibold">{p2EvCount}</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-slate-400 font-sans">Primary Language Focus</td>
                <td className="py-3 px-4 font-semibold">
                  {profile1.analysis.topLanguages[0]?.language || "N/A"}
                </td>
                <td className="py-3 px-4 font-semibold">
                  {profile2.analysis.topLanguages[0]?.language || "N/A"}
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-slate-400 font-sans">GitHub Member Since</td>
                <td className="py-3 px-4 font-semibold">
                  {new Date(profile1.user.created_at).getFullYear()}
                </td>
                <td className="py-3 px-4 font-semibold">
                  {new Date(profile2.user.created_at).getFullYear()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Profiles Side by Side */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-100 border-b border-slate-800 pb-3">
          Profile Cards
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-2">
            <span className="text-xs font-mono font-semibold uppercase text-blue-400">
              Developer #1
            </span>
            <ProfileCard user={profile1.user} />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono font-semibold uppercase text-violet-400">
              Developer #2
            </span>
            <ProfileCard user={profile2.user} />
          </div>
        </div>
      </section>

      {/* Proof of Work Cards Comparison */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-100 border-b border-slate-800 pb-3">
          Verifiable Proof of Work Comparison
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile 1 Cards */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-blue-400">
              {profile1.user.login}&apos;s Proof Cards
            </h3>
            <div className="space-y-4">
              {profile1.analysis.cards.map((card) => (
                <ProofOfWorkCard key={`p1-${card.id}`} card={card} />
              ))}
            </div>
          </div>

          {/* Profile 2 Cards */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-violet-400">
              {profile2.user.login}&apos;s Proof Cards
            </h3>
            <div className="space-y-4">
              {profile2.analysis.cards.map((card) => (
                <ProofOfWorkCard key={`p2-${card.id}`} card={card} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Development Evidence Comparison */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-100 border-b border-slate-800 pb-3">
          Verified Development Evidence
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-bold text-blue-400 mb-4">
              {profile1.user.login}&apos;s Development Evidence
            </h3>
            <DevelopmentEvidenceSection evidences={profile1.evidences} />
          </div>

          <div>
            <h3 className="text-lg font-bold text-violet-400 mb-4">
              {profile2.user.login}&apos;s Development Evidence
            </h3>
            <DevelopmentEvidenceSection evidences={profile2.evidences} />
          </div>
        </div>
      </section>

      {/* Repositories Side by Side */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-100 border-b border-slate-800 pb-3">
          Public Repositories
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-bold text-blue-400 mb-4">
              {profile1.user.login}&apos;s Repositories
            </h3>
            <RepositoryList repos={profile1.repos} />
          </div>

          <div>
            <h3 className="text-lg font-bold text-violet-400 mb-4">
              {profile2.user.login}&apos;s Repositories
            </h3>
            <RepositoryList repos={profile2.repos} />
          </div>
        </div>
      </section>
    </div>
  );
}
