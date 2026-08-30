# GitProof

Turn GitHub activity into verifiable proof of work.

GitProof is a developer intelligence platform that analyzes public GitHub profiles, repositories, source code, dependencies, documentation, commits, pull requests, and issues to transform raw GitHub activity into structured, evidence-backed insights.

It helps recruiters understand what a developer has actually built and helps developers identify which of their projects best match a specific job description.

---

## Overview

A GitHub profile contains much more information than a contribution graph or repository count.

GitProof goes beyond basic GitHub statistics by examining the actual contents and development activity of repositories.

The platform can answer questions such as:

- What technologies has a developer actually used?
- Which repositories demonstrate those technologies?
- What development work has the developer performed?
- Which projects are most relevant to a particular job?
- What evidence supports each technical claim?
- How can a recruiter verify that evidence?

The core principle is simple:

> Every important technical claim should be backed by real, publicly verifiable GitHub evidence.

---

## Key Features

### 1. GitHub Profile Analysis

Users can analyze a GitHub profile using:

```text
octocat
@octocat
github.com/octocat
https://github.com/octocat
```

GitProof retrieves public profile information including:

- Name
- Username
- Avatar
- Bio
- Company
- Location
- Website
- Public repositories
- Followers
- Following
- Account creation date

---

### 2. Repository Analysis

GitProof analyzes public repositories and extracts metadata such as:

- Repository name
- Description
- Primary programming language
- Stars
- Forks
- Topics
- Repository URL
- Creation date
- Last update date
- Last push date
- Fork status

This provides an initial overview of a developer's public technical portfolio.

---

### 3. Deep Repository Analysis

GitProof does not rely only on repository metadata. For relevant repositories, the system performs deeper inspection of the actual repository contents.

It can inspect:

**Documentation**
```text
README.md
README.markdown
```

**Dependency Manifests**
```text
package.json
requirements.txt
pyproject.toml
Cargo.toml
go.mod
pom.xml
build.gradle
```

**Repository Structure**

GitProof examines the repository tree to understand how the project is organized.

**Source Code**

When README and dependency information are not sufficient, GitProof can inspect selected source files to find implementation-level evidence.

```text
.ts .tsx .js .jsx .py .c .cpp .rb
```

Large files, binaries, and irrelevant directories are filtered to keep the analysis efficient. Common excluded directories include:

```text
node_modules
.git
dist
build
vendor
.next
```

This means GitProof can determine not only what a repository claims to use, but also what its actual project structure and implementation indicate.

---

### 4. Proof of Work

GitProof converts GitHub evidence into structured Proof of Work cards covering:

- **Technical Stack** — programming languages and technologies represented across repositories
- **Community Impact** — publicly visible repository engagement such as stars
- **Engineering Activity** — repository activity and development history
- **Portfolio Evidence** — an overview of the developer's public project footprint

Each Proof of Work card contains:

- Category
- Summary
- Evidence
- Supporting repositories
- Evidence strength
- Direct GitHub verification links

The objective is to make technical claims easy to understand and easy to verify.

---

### 5. Verified Development Evidence

GitProof analyzes public development activity from GitHub, including commits, pull requests, and issues. For each activity item, GitProof preserves the underlying evidence:

```text
Event Type
Repository
Repository URL
Commit Message
Pull Request Title
Issue Title
Description
Timestamp
Status
GitHub Verification URL
```

Development activity can be filtered into: **All | Pull Requests | Issues | Commits**

---

### 6. Raw Evidence Transparency

GitProof separates interpretation from source evidence. A recruiter-friendly interpretation is displayed first. Users can then expand **"Show Raw GitHub Evidence"** to view the original information used to generate the interpretation, including the original commit message, PR title, issue title, description snippet, repository, date, status, and GitHub verification link.

This provides transparency instead of presenting AI-generated text as if it were the original source.

---

### 7. Recruiter-Friendly Interpretation

Technical GitHub activity can be difficult for non-technical recruiters to understand. For example:

```text
feat(auth): add JWT middleware
```

can be translated into a clearer interpretation such as:

```text
Implemented authentication functionality by adding JWT middleware.
```

The translation system uses technical patterns and action-oriented language (Implemented, Added, Fixed, Refactored, Configured, Improved, Resolved) to make development activity easier to understand.

The system does not intentionally create unsupported business metrics or performance claims. It does not invent revenue figures, time saved, performance percentages, users impacted, or business impact unless such information is explicitly supported by the underlying evidence.

---

### 8. Job Match and Project Ranking

One of GitProof's core features is **Job Match**. A user can provide a GitHub profile plus a job description, and GitProof analyzes the job requirements to determine which projects in the developer's GitHub profile are most relevant.

Instead of simply searching repository names, GitProof examines source code, dependencies, programming languages, README documentation, repository metadata, and activity. The result is a ranked list of projects.

**Job Description Analysis**

The job description is analyzed for technical requirements such as programming languages, frameworks, libraries, databases, cloud technologies, development tools, technical concepts, and domain keywords — e.g. React, TypeScript, Next.js, Node.js, Python, Docker, PostgreSQL, AWS, GraphQL, Tailwind CSS.

**Repository Candidate Selection**

Analyzing every file of every repository can be unnecessarily expensive, so GitProof uses a two-stage approach:

- **Stage 1 — Lightweight Candidate Selection:** All public repositories are initially evaluated using lightweight information (name, description, topics, primary language, keyword overlap). The most relevant repositories are selected as candidates.
- **Stage 2 — Deep Analysis:** Selected repositories are then inspected more deeply, fetching README, manifest, repository tree, and selected source files for stronger implementation-level evidence.

**Job Match Scoring**

The project ranking uses a transparent weighted scoring system:

| Evidence Type | Weight |
|---|---:|
| Implementation / Source Code Evidence | 35% |
| Dependency / Manifest Evidence | 25% |
| Language / Primary Stack | 20% |
| README / Documentation | 15% |
| Activity / Recency | 5% |
| **Total** | **100%** |

The final match score is always constrained between 0% and 100%.

**Match Results**

Each ranked project can display: rank, overall match score, score breakdown, matched skills, missing skills, match explanation, repository evidence, dependency evidence, source code evidence, README evidence, and a GitHub verification link.

Example:

```text
Project: Example App
Match Score: 87%

Matched Skills: React, TypeScript, Next.js, Tailwind CSS
Missing Skills: GraphQL, Redis

Reason: The project contains implementation and dependency evidence
for React, TypeScript, Next.js, and Tailwind CSS.
```

This makes the ranking explainable rather than producing an unexplained AI score.

---

### 9. GitHub Profile Comparison

GitProof includes a **Compare** mode. Two GitHub profiles can be analyzed side-by-side across public repositories, followers, following, programming languages, repository activity, stars, forks, technical stack, and project evidence. The comparison is based on public GitHub information rather than subjective judgments.

---

### 10. Authentication

GitProof includes a lightweight authentication system designed for the current hackathon implementation. Users can sign in using a public GitHub username; the system verifies the GitHub profile before creating the application session.

Authentication functionality includes: login page, user session, user avatar, GitHub handle, sign out, and saved proof access.

The current implementation does not require an external authentication provider or database.

---

### 11. Saved Proofs

Authenticated users can save analyzed developer profiles, accessible from `/saved`. Users can save a Proof of Work, remove a saved proof, check whether a proof is already saved, and revisit saved developer profiles.

The current implementation uses client-side session persistence for the hackathon demonstration.

---

## Application Architecture

GitProof is implemented as a Next.js application with a client-side interface, server-side API routes, analysis modules, and GitHub's public API.

```text
                         ┌─────────────────────┐
                         │        USER         │
                         └──────────┬──────────┘
                                    │
                                    ▼
                  ┌────────────────────────────────┐
                  │          GitProof UI           │
                  │                                │
                  │  Analyze │ Compare │ Job Match │
                  │  Saved Proofs │ Login          │
                  └───────────────┬────────────────┘
                                  │
                                  ▼
                  ┌────────────────────────────────┐
                  │       Next.js API Routes       │
                  │                                │
                  │  /api/analyze                  │
                  │  /api/compare                  │
                  │  /api/job-match                │
                  └───────────────┬────────────────┘
                                  │
                    ┌─────────────┼─────────────┐
                    │             │             │
                    ▼             ▼             ▼
             ┌────────────┐ ┌────────────┐ ┌──────────────┐
             │  Profile   │ │ Repository │ │ Development  │
             │  Analysis  │ │  Analysis  │ │   Evidence   │
             └─────┬──────┘ └─────┬──────┘ └──────┬───────┘
                   │              │               │
                   └──────────────┼───────────────┘
                                  │
                                  ▼
                    ┌──────────────────────────┐
                    │      Analysis Engine      │
                    │                           │
                    │ Proof of Work             │
                    │ Job Matcher               │
                    │ Technical Translator      │
                    │ Evidence Extraction       │
                    └────────────┬─────────────┘
                                 │
                                 ▼
                    ┌──────────────────────────┐
                    │     GitHub Public API    │
                    │                          │
                    │ Users                    │
                    │ Repositories             │
                    │ Events                   │
                    │ Pull Requests            │
                    │ Repository Trees         │
                    │ Repository Contents      │
                    └──────────────────────────┘
```

---

## Data Flow

**Profile Analysis**

```text
GitHub Username / URL
        ↓
Username Parser
        ↓
GitHub Profile API
        ↓
Repository API
        ↓
Public Events / PR Search
        ↓
Profile + Repository Analysis
        ↓
Proof of Work
        ↓
Development Evidence
        ↓
GitProof Dashboard
```

**Job Match**

```text
GitHub Profile + Job Description
        ↓
Job Requirement Extraction
        ↓
Lightweight Repository Selection
        ↓
Deep Repository Analysis
        ↓
README + Manifest + Source Code
        ↓
Evidence Matching
        ↓
Weighted Scoring
        ↓
Ranked Projects
```

---

## Project Structure

```text
gitproof/
│
├── src/
│   │
│   ├── app/
│   │   ├── api/
│   │   │   ├── analyze/
│   │   │   │   └── route.ts
│   │   │   ├── compare/
│   │   │   │   └── route.ts
│   │   │   └── job-match/
│   │   │       └── route.ts
│   │   │
│   │   ├── compare/
│   │   │   └── page.tsx
│   │   ├── job-match/
│   │   │   └── page.tsx
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── saved/
│   │   │   └── page.tsx
│   │   └── page.tsx
│   │
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── SearchForm.tsx
│   │   ├── ProfileCard.tsx
│   │   ├── RepositoryList.tsx
│   │   ├── ProofOfWorkCard.tsx
│   │   ├── DevelopmentEvidenceCard.tsx
│   │   ├── DevelopmentEvidenceSection.tsx
│   │   ├── JobMatchForm.tsx
│   │   ├── JobMatchSection.tsx
│   │   └── RankedProjectCard.tsx
│   │
│   ├── context/
│   │   └── AuthContext.tsx
│   │
│   └── lib/
│       ├── parser.ts
│       ├── github.ts
│       ├── github-content.ts
│       ├── analysis.ts
│       ├── translator.ts
│       ├── job-matcher.ts
│       └── auth.ts
│
├── public/
│
├── package.json
├── tsconfig.json
├── next.config.*
├── tailwind.config.*
└── README.md
```

---


## GitHub API Endpoints

| Purpose | Endpoint |
|---|---|
| User Information | `GET https://api.github.com/users/{username}` |
| Repositories | `GET https://api.github.com/users/{username}/repos` |
| Public Events | `GET https://api.github.com/users/{username}/events/public` |
| Pull Request Search | `GET https://api.github.com/search/issues?q=author:{username}+type:pr` |
| Repository Tree | `GET https://api.github.com/repos/{owner}/{repo}/git/trees/{branch}` |
| Repository Contents | `GET https://api.github.com/repos/{owner}/{repo}/contents/{path}` |

---

## Technology Stack

| Layer | Technology |
|---|---|
| Framework | Next.js |
| UI | React |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Data Source | GitHub REST API |
| Authentication | Lightweight client-side session |
| Repository Analysis | GitHub Repository Contents API |
| Job Matching | Custom weighted matching engine |
| Technical Translation | Rule-based / optional LLM |
| Code Review | `code-review-3` from SkillPatch |
| Deployment Target | Suitable for Next.js hosting |

| Code Review | `code-review-3` from SkillPatch for code quality, specification verification, and grounded evidence auditing |

---

## Local Development

**Prerequisites:** Node.js, npm, Git

**Installation**

```bash
git clone <your-github-repository-url>
cd gitproof
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

**Production Build**

```bash
npm run build
```

The project has been verified with successful Next.js production builds during development.

---

## Available Routes

| Route | Purpose |
|---|---|
| `/` | GitHub profile analysis |
| `/compare` | Compare two GitHub profiles |
| `/job-match` | Match GitHub projects against a job description |
| `/login` | Authentication |
| `/saved` | Saved developer proofs |

## API Routes

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/analyze` | Analyze a GitHub profile |
| POST | `/api/compare` | Compare GitHub profiles |
| POST | `/api/job-match` | Rank repositories against a job description |

---

## Example Workflow

**Example 1: Profile Analysis**

Input: `https://github.com/octocat`

```text
1. Parses username
2. Fetches profile
3. Fetches repositories
4. Fetches public activity
5. Analyzes repositories
6. Generates Proof of Work
7. Displays development evidence
```

**Example 2: Job Match**

Input:

```text
GitHub: https://github.com/example

Job Description:
We are looking for a frontend developer with experience in
React, TypeScript, Next.js, Tailwind CSS and REST APIs.
```

```text
1. Extracts job requirements
2. Selects relevant repositories
3. Fetches README files
4. Fetches manifests
5. Inspects repository structure
6. Inspects selected source files
7. Finds technology evidence
8. Calculates weighted scores
9. Ranks projects
```

Result:

```text
1. Project A       91%
2. Project B       78%
3. Project C       64%
```

---

## Evidence and Trust Model

GitProof is designed around evidence rather than unsupported claims. A technology can be supported by different evidence levels:

- **Strong Evidence** — actual source code implementation
- **Dependency Evidence** — package.json, requirements.txt, pyproject.toml, Cargo.toml, go.mod, pom.xml
- **Language Evidence** — repository primary language
- **Documentation Evidence** — README
- **Activity Evidence** — commit, pull request, issue, public event

The Job Match engine gives stronger weight to implementation-level evidence than simple README mentions.

---

## Transparency

GitProof separates **real GitHub evidence** from **interpretation**. For example:

```text
REAL EVIDENCE
-------------
Commit: feat(auth): add JWT middleware
Repository: example-project
Date: 2026-08-29
```

```text
INTERPRETATION
--------------
Implemented authentication functionality by adding JWT middleware.
```

The raw GitHub evidence remains available for verification.

---

## Limitations

GitProof currently analyzes publicly available GitHub information. Therefore:

- Private repositories and private activity cannot be analyzed.
- GitHub API rate limits can affect requests.
- Repository content may not always provide enough evidence.
- Commit messages may not completely describe implementation.
- Public GitHub activity does not represent all professional experience.
- The current authentication implementation is intended for hackathon demonstration rather than enterprise identity management.
- Saved proofs currently use client-side persistence rather than a production database.

---

## Security Considerations

- Do not provide GitHub passwords or sensitive credentials.
- API keys should never be placed in client-side code.
- If an LLM API is configured, requests flow **Browser → Next.js Server → LLM API**, and the API key remains on the server.
- Never expose `OPENAI_API_KEY` or `LLM_API_KEY` to the browser.

---

## Design Philosophy

GitProof is designed around three principles:

- **Evidence First** — Technical claims should originate from actual GitHub evidence.
- **Transparent** — Users should be able to see the evidence behind an interpretation.
- **Relevant** — Instead of treating every repository equally, GitProof identifies which projects are most relevant to a particular job.

---

## Why GitProof?

Traditional GitHub profile analysis often focuses on repositories, stars, followers, and the contribution graph.

GitProof goes deeper — combining profile, repositories, README, dependencies, repository structure, source code, commits, pull requests, issues, and job description into a single evidence pipeline.

This allows GitProof to move from *"What is on this GitHub profile?"* to *"What evidence demonstrates this developer's technical capabilities?"* and finally *"Which projects best demonstrate the capabilities required for this job?"*

---

## Hackathon

GitProof was developed during **BuildSprint 2026**. The project focuses on converting public GitHub activity into verifiable proof of technical work and making that evidence useful for both developers and recruiters. It was built within the BuildSprint development window and is designed as a functional technical demonstration.

---

## Future Improvements

- Persistent database-backed accounts
- GitHub OAuth
- Persistent saved analyses
- Shareable Proof of Work links
- PDF recruiter reports
- Advanced contribution analysis
- More detailed source-code analysis
- Repository architecture visualization
- Historical developer activity analysis
- Resume-to-GitHub matching
- Interview question generation from verified projects
- Organization and team analysis
- More advanced semantic job matching

---

## License

This project was created as a BuildSprint 2026 hackathon project. Add an appropriate open-source license before distributing the project publicly.

---

## Author

**Jayakrishna Gude**

GitProof was built as a hackathon project focused on evidence-based developer analysis.
