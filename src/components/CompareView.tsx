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
      {/* Identity Panels Header */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
        <div className="p-4 rounded-xl bg-[#151719] border border-[#2A2D30] space-y-1">
          <span className="text-[10px] uppercase font-mono font-bold text-[#F9732F] block">
            DEVELOPER A
          </span>
          <h3 className="text-xl font-extrabold text-[#F5F2ED]">
            {profile1.user.name || profile1.user.login}
          </h3>
          <span className="text-xs font-mono text-[#9CA3AF]">@{profile1.user.login}</span>
        </div>

        <div className="p-4 rounded-xl bg-[#151719] border border-[#2A2D30] space-y-1">
          <span className="text-[10px] uppercase font-mono font-bold text-[#4ADE80] block">
            DEVELOPER B
          </span>
          <h3 className="text-xl font-extrabold text-[#F5F2ED]">
            {profile2.user.name || profile2.user.login}
          </h3>
          <span className="text-xs font-mono text-[#9CA3AF]">@{profile2.user.login}</span>
        </div>
      </div>

      {/* Neutral Side-by-Side Summary Table */}
      <section className="card-surface rounded-2xl p-6">
        <div className="flex items-center justify-between pb-3 border-b border-[#2A2D30] mb-4">
          <h2 className="text-sm font-mono font-bold text-[#9CA3AF] uppercase tracking-wider">
            OBJECTIVE METRIC COMPARISON REPORT
          </h2>
          <span className="text-[10px] text-[#6B7280] font-mono">Factual GitHub Data</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-[#2A2D30] text-xs uppercase text-[#9CA3AF] font-mono">
                <th className="py-3 px-4">Technical Signal</th>
                <th className="py-3 px-4 text-[#F9732F] font-bold">
                  {profile1.user.login}
                </th>
                <th className="py-3 px-4 text-[#4ADE80] font-bold">
                  {profile2.user.login}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2D30] font-mono text-[#F5F2ED]">
              <tr>
                <td className="py-3 px-4 text-[#9CA3AF] font-sans">Public Repositories</td>
                <td className="py-3 px-4 font-semibold">{p1Repos}</td>
                <td className="py-3 px-4 font-semibold">{p2Repos}</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-[#9CA3AF] font-sans">Total Stargazers Earned</td>
                <td className="py-3 px-4 font-semibold">{p1Stars} ★</td>
                <td className="py-3 px-4 font-semibold">{p2Stars} ★</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-[#9CA3AF] font-sans">Followers</td>
                <td className="py-3 px-4 font-semibold">{p1Followers}</td>
                <td className="py-3 px-4 font-semibold">{p2Followers}</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-[#9CA3AF] font-sans">Recent Verified Evidence Items</td>
                <td className="py-3 px-4 font-semibold">{p1EvCount}</td>
                <td className="py-3 px-4 font-semibold">{p2EvCount}</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-[#9CA3AF] font-sans">Primary Language Focus</td>
                <td className="py-3 px-4 font-semibold">
                  {profile1.analysis.topLanguages[0]?.language || "N/A"}
                </td>
                <td className="py-3 px-4 font-semibold">
                  {profile2.analysis.topLanguages[0]?.language || "N/A"}
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-[#9CA3AF] font-sans">GitHub Member Since</td>
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
        <h2 className="text-xl font-extrabold text-[#F5F2ED] border-b border-[#2A2D30] pb-3 font-mono">
          DEVELOPER PROFILES
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold uppercase text-[#F9732F]">
              DEVELOPER A
            </span>
            <ProfileCard user={profile1.user} />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono font-bold uppercase text-[#4ADE80]">
              DEVELOPER B
            </span>
            <ProfileCard user={profile2.user} />
          </div>
        </div>
      </section>

      {/* Proof of Work Cards Comparison */}
      <section className="space-y-6">
        <h2 className="text-xl font-extrabold text-[#F5F2ED] border-b border-[#2A2D30] pb-3 font-mono">
          PROOF OF WORK COMPARISON
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile 1 Cards */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold font-mono text-[#F9732F]">
              {profile1.user.login}&apos;S PROOF CARDS
            </h3>
            <div className="space-y-4">
              {profile1.analysis.cards.map((card) => (
                <ProofOfWorkCard key={`p1-${card.id}`} card={card} />
              ))}
            </div>
          </div>

          {/* Profile 2 Cards */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold font-mono text-[#4ADE80]">
              {profile2.user.login}&apos;S PROOF CARDS
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
        <h2 className="text-xl font-extrabold text-[#F5F2ED] border-b border-[#2A2D30] pb-3 font-mono">
          VERIFIED DEVELOPMENT EVIDENCE
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-sm font-bold font-mono text-[#F9732F] mb-4">
              {profile1.user.login}&apos;S EVIDENCE
            </h3>
            <DevelopmentEvidenceSection evidences={profile1.evidences} />
          </div>

          <div>
            <h3 className="text-sm font-bold font-mono text-[#4ADE80] mb-4">
              {profile2.user.login}&apos;S EVIDENCE
            </h3>
            <DevelopmentEvidenceSection evidences={profile2.evidences} />
          </div>
        </div>
      </section>

      {/* Repositories Side by Side */}
      <section className="space-y-6">
        <h2 className="text-xl font-extrabold text-[#F5F2ED] border-b border-[#2A2D30] pb-3 font-mono">
          PUBLIC REPOSITORIES
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-sm font-bold font-mono text-[#F9732F] mb-4">
              {profile1.user.login}&apos;S REPOSITORIES
            </h3>
            <RepositoryList repos={profile1.repos} />
          </div>

          <div>
            <h3 className="text-sm font-bold font-mono text-[#4ADE80] mb-4">
              {profile2.user.login}&apos;S REPOSITORIES
            </h3>
            <RepositoryList repos={profile2.repos} />
          </div>
        </div>
      </section>
    </div>
  );
}
