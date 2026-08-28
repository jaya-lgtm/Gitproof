/**
 * Parses and validates a GitHub username from various input formats:
 * - https://github.com/username
 * - http://github.com/username
 * - github.com/username
 * - @username
 * - username
 */

export interface ParseUsernameResult {
  success: boolean;
  username?: string;
  error?: string;
}

const GITHUB_USERNAME_REGEX = /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/;

export function parseGitHubUsername(input: string): ParseUsernameResult {
  if (!input || typeof input !== "string") {
    return {
      success: false,
      error: "Please enter a GitHub profile URL or username.",
    };
  }

  let cleaned = input.trim();

  // Remove leading @ if present
  if (cleaned.startsWith("@")) {
    cleaned = cleaned.slice(1).trim();
  }

  // Handle URL inputs
  if (cleaned.toLowerCase().includes("github.com")) {
    try {
      // Ensure protocol for URL parsing if missing
      const urlString = cleaned.match(/^https?:\/\//i)
        ? cleaned
        : `https://${cleaned}`;

      const url = new URL(urlString);

      if (!url.hostname.toLowerCase().endsWith("github.com")) {
        return {
          success: false,
          error: "URL must be a valid github.com link.",
        };
      }

      // Extract path segments (e.g., /octocat or /octocat/repo -> octocat)
      const segments = url.pathname.split("/").filter(Boolean);

      if (segments.length === 0) {
        return {
          success: false,
          error: "GitHub URL does not contain a username.",
        };
      }

      // Reserve non-username paths
      const reservedPaths = [
        "features",
        "enterprise",
        "pricing",
        "readme",
        "about",
        "contact",
        "careers",
        "press",
        "blog",
        "settings",
        "notifications",
        "login",
        "signup",
        "orgs",
        "repositories",
        "sponsors",
        "trending",
        "collections",
        "topics",
        "explore",
      ];

      const candidate = segments[0];

      if (reservedPaths.includes(candidate.toLowerCase())) {
        return {
          success: false,
          error: `'${candidate}' is a reserved GitHub path, not a user profile.`,
        };
      }

      cleaned = candidate;
    } catch {
      return {
        success: false,
        error: "Invalid GitHub URL format.",
      };
    }
  }

  // Validate GitHub username constraints
  if (!GITHUB_USERNAME_REGEX.test(cleaned)) {
    return {
      success: false,
      error:
        "Invalid GitHub username. Usernames may only contain alphanumeric characters or hyphens (max 39 chars) and cannot start or end with a hyphen.",
    };
  }

  return {
    success: true,
    username: cleaned,
  };
}
