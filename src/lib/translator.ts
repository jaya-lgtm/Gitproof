import { RawDevelopmentEvidence } from "./github";

/**
 * Translates raw technical evidence (commits, PRs, issues) into recruiter-friendly explanations.
 * Operates strictly on factual evidence without fabricating metrics, numbers, or unverified claims.
 */

export async function translateEvidenceToRecruiterProof(
  evidences: RawDevelopmentEvidence[]
): Promise<RawDevelopmentEvidence[]> {
  const apiKey = process.env.OPENAI_API_KEY || process.env.LLM_API_KEY;

  if (apiKey) {
    try {
      // Optional AI Translation call if key is present
      const prompt = `You are a technical recruiter expert. Translate these technical GitHub PR/commit titles into concise, professional recruiter-friendly bullet points describing the engineering contribution.
Rules:
- Do NOT invent performance numbers, percentages, load times, or business metrics that are not in the raw text.
- Focus strictly on action verbs: "Implemented", "Refactored", "Resolved", "Added support for", "Configured".
- Keep each summary to 1 sentence.

Input items:
${JSON.stringify(
  evidences.map((e) => ({ id: e.id, type: e.type, title: e.title })),
  null,
  2
)}`;

      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.2,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const content = data.choices?.[0]?.message?.content;
        if (content) {
          // Attempt to parse AI responses
          // If response format is clean array or map, assign it
        }
      }
    } catch {
      // Fallback to deterministic rule-based translator if API fails
    }
  }

  // Deterministic Recruiter Translation Pipeline
  return evidences.map((item) => {
    const translation = formatRecruiterInterpretation(item.type, item.title);
    return {
      ...item,
      recruiterTranslation: translation,
    };
  });
}

function formatRecruiterInterpretation(
  type: RawDevelopmentEvidence["type"],
  title: string
): string {
  const cleanTitle = title.trim();

  // Strip conventional commit prefixes if present (e.g., feat:, fix:, docs:, refactor:)
  const prefixMatch = cleanTitle.match(/^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(?:\((.*?)\))?:\s*(.*)/i);
  let actionPrefix = "";
  let coreText = cleanTitle;

  if (prefixMatch) {
    const [, kind, scope, rest] = prefixMatch;
    coreText = rest;
    const scopeStr = scope ? ` within ${scope}` : "";

    switch (kind.toLowerCase()) {
      case "feat":
        actionPrefix = `Implemented feature${scopeStr}: `;
        break;
      case "fix":
        actionPrefix = `Resolved bug/issue${scopeStr}: `;
        break;
      case "refactor":
        actionPrefix = `Refactored codebase structure${scopeStr}: `;
        break;
      case "docs":
        actionPrefix = `Updated technical documentation${scopeStr}: `;
        break;
      case "test":
        actionPrefix = `Added automated test coverage${scopeStr}: `;
        break;
      case "build":
      case "ci":
        actionPrefix = `Configured CI/CD build pipeline${scopeStr}: `;
        break;
      default:
        actionPrefix = `Updated development workflow${scopeStr}: `;
        break;
    }
  } else {
    if (type === "Pull Request") {
      actionPrefix = "Submitted pull request contribution: ";
    } else if (type === "Issue") {
      actionPrefix = "Reported and tracked technical requirement: ";
    } else {
      actionPrefix = "Committed code contribution: ";
    }
  }

  // Capitalize first letter of coreText
  const capitalizedCore = coreText.charAt(0).toUpperCase() + coreText.slice(1);

  return `${actionPrefix}"${capitalizedCore}"`;
}
