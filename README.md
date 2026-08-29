# GitProof — Source-Grounded Developer Intelligence Platform

<div align="center">

### **Turn real GitHub activity into transparent, verified proof of what a developer can actually do.**

[![Next.js](https://img.shields.io/badge/Next.js-16.3-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-F9732F?style=for-the-badge)](LICENSE)

[Explore Features](#-core-capabilities) • [System Architecture](#-system-architecture--data-flow) • [Job Matching Engine](#-job-match--project-relevance-ranking) • [Getting Started](#-getting-started)

</div>

---

## 💡 Executive Summary

Traditional resume screeners and generic LLM-based profile evaluators suffer from a fundamental flaw: **hallucination and unverified claims**. They credit developers for technologies listed on bullet points without inspecting whether those tools were actually used in production, tested, or committed.

**GitProof solves this problem.** It is a high-performance **Source-Grounded Developer Intelligence Platform** that connects directly to the GitHub REST API and deep-inspects raw repository trees, `README.md` files, dependency manifests, commits, pull requests, and issues. 

> **GitProof's Core Directive:** Zero credited skills without verifiable GitHub evidence. No fake performance metrics, no fabricated load-time improvements, and no fluff.

---

## ⚡ Key Highlights & Innovation

- **100% Source-Grounded Analysis**: Every single claim on GitProof is backed by an inspectable link to GitHub source code, dependency manifests, or pull requests.
- **Deep Repository Inspection Engine**: Looks past profile metadata into actual codebases—parsing `package.json`, `requirements.txt`, `Cargo.toml`, `pyproject.toml`, `go.mod`, and source files (`.ts`, `.tsx`, `.py`, `.go`, `.rs`, `.c`).
- **Transparent 5-Part Weighted Scoring**: Evaluates candidate-to-job relevance using explicit mathematical weight distribution (35% implementation code, 25% manifests, 20% primary language, 15% docs, 5% activity).
- **Recruiter Translation Layer**: Uses conventional commit parsing and LLM translation to convert cryptic technical titles (e.g. `feat(auth): add JWT middleware`) into clear, recruiter-friendly accomplishment statements.
- **Neutral Side-by-Side Comparison**: Enables technical hiring managers to evaluate two candidates objectively without subjective or "gaming-style" leaderboard scores.
- **Dark Charcoal & Warm Orange Aesthetic**: Built for modern AI developer tool standards with dark solid surfaces (`#181A1C`), warm orange highlights (`#F9732F`), and crisp monospace typography for technical data.

---

## 🚀 Core Capabilities

### 1. 🔍 Single Profile Intelligence (`/`)
- Enter any GitHub profile handle (`@username`) or full URL (`https://github.com/username`).
- Fetches public profile metadata, public repositories, and recent events (PushEvents, IssueEvents, PullRequestEvents).
- Generates **Verifiable Proof of Work Cards**:
  - **Tech Stack**: Primary language distribution and repository counts.
  - **Community Impact**: Stargazers, forks, and open-source reach.
  - **Engineering Activity**: Code maintenance within the past 6 months.
  - **Portfolio Evidence**: Original non-forked repository scope.
- Displays a dedicated **Verified Development Evidence** timeline with filter tabs (*All*, *Pull Requests*, *Issues*, *Commits*) and collapsible raw commit message dropdowns.

### 2. ⚔️ Side-by-Side Profile Comparison (`/compare`)
- Concurrently analyzes two GitHub developers side-by-side using `Promise.all`.
- Outputs an **Objective Metric Comparison Report**:
  - Public Repository Count
  - Total Stargazers Earned
  - Followers & Following
  - Recent Verified Evidence Items
  - Primary Language Focus & Account Creation Year
- Renders dual-column profile cards, proof cards, and development activity lists.

### 3. 🎯 Job Match & Project Relevance Ranking (`/job-match`)
- Paste any target Job Description (JD) text (or use 1-click preset sample JDs).
- **Skill Extraction**: Parses required/preferred technical skills, frameworks, and languages using regex word-boundary isolation with special character escaping (`C++`, `.NET`, `C#`).
- **Lightweight Candidate Filter**: Passes all public repos through a lightweight keyword/topic filter to select the top 10–12 candidate repositories.
- **Deep Inspection Engine**: Inspects `README.md`, directory trees, dependency manifests, and up to 3–5 key source files per project.
- **Weighted Ranking**: Computes a transparent match score (`0–100%`) with visual progress bars and exact evidence snippets.

### 4. 🔐 Email Authentication (`/login`)
- Full user registration and sign-in (`src/app/api/auth/signup` and `/api/auth/login`).
- Hashed passwords using Node.js native `crypto` SHA-256 salting stored in a server-side JSON database (`gitproof_users.json`).
- Includes 1-click sample demo credentials for fast testing (`recruiter@gitproof.com` / `developer@gitproof.com`).

---

## 📐 System Architecture & Data Flow

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                             CLIENT / BROWSER LAYER                               │
│                                                                                  │
│   Single Analysis (/)        Compare Profiles (/compare)      Job Match (/job-match) │
└─────────┬─────────────────────────────────┬───────────────────────────────┬──────┘
          │                                 │                               │
          ▼                                 ▼                               ▼
┌──────────────────┐               ┌──────────────────┐           ┌──────────────────┐
│ POST /api/analyze│               │ POST /api/compare│           │POST /api/job-match│
└─────────┬────────┘               └────────┬─────────┘           └────────┬─────────┘
          │                                 │                              │
          └────────────────────────┬────────┴──────────────────────────────┘
                                   │
                                   ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                          GITPROOF BACKEND CORE ENGINE                            │
│                                                                                  │
│  ┌──────────────────────┐  Fetch Profile, Repos, Events ┌──────────────────────┐  │
│  │   src/lib/github.ts  │<─────────────────────────────>│   GitHub REST API    │  │
│  │   - Public API Fetch │                               │   (/users, /repos,   │  │
│  │   - PR Search Engine │<─────────────────────────────>│    /events, /search) │  │
│  └──────────┬───────────┘                               └──────────────────────┘  │
│             │                                                                    │
│             ├───> Candidate Selection ───> ┌──────────────────────────────────┐  │
│             │                              │   src/lib/github-content.ts      │  │
│             │                              │   - README & Tree Parser         │  │
│             │                              │   - Manifest Dependency Parser   │  │
│             │                              │   - Source Code Snippet Fetcher  │  │
│             │                              └────────────────┬─────────────────┘  │
│             │                                               │                    │
│             ▼                                               ▼                    │
│  ┌──────────────────────┐                       ┌──────────────────────────────┐ │
│  │  src/lib/analysis.ts │                       │    src/lib/job-matcher.ts    │ │
│  │  - Proof Card Engine │                       │    - JD Keyword Extractor    │ │
│  │  - Language Metrics  │                       │    - 5-Part Weighted Scoring │ │
│  └──────────┬───────────┘                       └──────────────┬───────────────┘ │
│             │                                                  │                 │
│             └─────────────────────────┬────────────────────────┘                 │
│                                       │                                          │
│                                       ▼                                          │
│                          ┌─────────────────────────┐                             │
│                          │  src/lib/translator.ts  │                             │
│                          │  - Conventional Commit  │                             │
│                          │    Recruiter Translator │                             │
│                          └────────────┬────────────┘                             │
└───────────────────────────────────────┼──────────────────────────────────────────┘
                                        │
                                        ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                              UI PRESENTATION LAYER                               │
│                                                                                  │
│  Profile Cards  │  Proof Cards  │  Development Evidence  │  Ranked Repositories  │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 📊 Transparent Weighted Scoring Formula

In the **Job Match & Project Ranking** engine, repositories are ranked according to the following mathematical weight distribution:

$$\text{Total Match Score} = (S_{\text{impl}} \times 0.35) + (S_{\text{manifest}} \times 0.25) + (S_{\text{lang}} \times 0.20) + (S_{\text{docs}} \times 0.15) + (S_{\text{activity}} \times 0.05)$$

| Component | Weight | Evidence Analyzed |
| :--- | :---: | :--- |
| **Implementation Score** | **35%** | Direct keyword matches inside source code files (`.ts`, `.tsx`, `.py`, `.go`, `.rs`, `.c`) |
| **Manifest Score** | **25%** | Explicit dependency packages inside `package.json`, `requirements.txt`, `Cargo.toml`, `go.mod`, `pom.xml` |
| **Language Score** | **20%** | Repository primary language matching target job requirements |
| **Documentation Score** | **15%** | `README.md` text, repository description, and topic tags |
| **Activity Score** | **5%** | Recency of commit pushes within the last 6 months |

---

## 🎨 Color-Coded Design System

GitProof implements a strict design token hierarchy built on a **Dark Charcoal (`#0D0F10`) & Warm Orange (`#F9732F`)** visual language:

| Design Token | Hex Code | Purpose / UI Placement |
| :--- | :---: | :--- |
| **Base Background** | `#0D0F10` | Main application canvas with subtle 32px blueprint grid pattern |
| **Secondary Background** | `#151719` | Inset containers, tables, command bars, and badge backgrounds |
| **Card Surface** | `#181A1C` | Primary glass-free solid surface with `#2A2D30` borders |
| **Elevated Surface** | `#1C1E20` | Hover states, code snippet containers, and secondary action buttons |
| **Brand Accent** | `#F9732F` | Primary CTAs, active page navigation tabs, main brand logo |
| **Verified / Success** | `#4ADE80` | Grounded evidence checkmarks, verified strength badges, profile status |
| **Technical Text** | `#F5F2ED` | Headings, primary text, and monospace code/repository tags |
| **Muted Text** | `#9CA3AF` | Supporting copy, timestamps, and secondary descriptions |

---

## 🛠️ Tech Stack & Dependencies

### Frontend Framework & Styling
- **Next.js 16.3.3**: App Router architecture with server-side API routes and static prerendering.
- **React 19**: Component state and client context hooks.
- **TypeScript 5**: Strict type safety across API interfaces, GitHub response models, and components.
- **Tailwind CSS 4**: Custom design tokens, utilities, and responsive breakpoints.
- **Typography**: `Geist Sans` for UI prose and `Geist Mono` for technical evidence data.

### Backend Services & Storage
- **GitHub REST API v3**: Live profile metadata, repository lists, public activity logs, and code search.
- **Node.js Native Crypto**: SHA-256 salted password hashing for database authentication.
- **Server File DB (`gitproof_users.json`)**: Lightweight, zero-dependency Node.js file database for user credentials.

---

## 📁 Repository Structure

```
gitproof/
├── gitproof_users.json          # Server-side user authentication file DB
├── next.config.ts               # Next.js configuration
├── package.json                 # Project dependencies
├── postcss.config.mjs           # PostCSS configuration
├── tsconfig.json                # TypeScript compiler configuration
└── src/
    ├── app/                     # Next.js App Router Pages & API Routes
    │   ├── api/
    │   │   ├── analyze/         # POST /api/analyze (Single Profile Analysis)
    │   │   ├── auth/            # POST /api/auth/login & /api/auth/signup
    │   │   ├── compare/         # POST /api/compare (Side-by-Side Dual Analysis)
    │   │   └── job-match/       # POST /api/job-match (Deep Code Job Match Engine)
    │   ├── compare/             # /compare page
    │   ├── job-match/           # /job-match page
    │   ├── login/               # /login page
    │   ├── globals.css          # Global Tailwind CSS 4 theme & design system
    │   ├── layout.tsx           # Root layout with AuthProvider wrapper
    │   └── page.tsx             # Main Analyze landing page
    ├── components/              # Reusable UI Components
    │   ├── CompareSearchForm.tsx # Dual username input form
    │   ├── CompareView.tsx       # Objective side-by-side comparison report
    │   ├── DevelopmentEvidenceCard.tsx    # Collapsible evidence card
    │   ├── DevelopmentEvidenceSection.tsx # Category filter tabs (PR/Issue/Commit)
    │   ├── Header.tsx           # Global responsive top navigation bar
    │   ├── JobMatchForm.tsx     # Job description textarea with preset samples
    │   ├── ProfileCard.tsx      # Developer identity dashboard panel
    │   ├── ProofOfWorkCard.tsx  # Verifiable proof card with category icons
    │   ├── RankedProjectCard.tsx# Project relevance card with 5-part score bar
    │   ├── RepositoryList.tsx   # Public repository grid
    │   └── SearchForm.tsx       # Main command console search input
    ├── context/
    │   └── AuthContext.tsx      # React Auth Context for user sessions
    └── lib/                     # Core Business Logic & Data Fetchers
        ├── analysis.ts          # Proof of Work generator algorithm
        ├── db.ts                # Server-side user DB & SHA-256 crypto hashing
        ├── github-content.ts    # Deep repository tree & manifest inspector
        ├── github.ts            # GitHub REST API client & event collector
        ├── job-matcher.ts       # JD skill extractor & weighted scoring engine
        ├── parser.ts            # GitHub username & URL parser utility
        └── translator.ts        # Conventional commit recruiter translator
```

---

## ⚡ Getting Started

### 1. Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher

### 2. Installation
Clone the repository and install dependencies:

```bash
git clone https://github.com/jaya-lgtm/Gitproof.git
cd Gitproof
npm install
```

### 3. Run Development Server
Start the Next.js development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your web browser.

### 4. Build for Production
To create an optimized production build:

```bash
npm run build
npm start
```

---

## 🧪 Testing Guide

You can test GitProof using the following sample accounts and workflows:

| Testing Workflow | Sample Input | Expected Output |
| :--- | :--- | :--- |
| **Single Analysis (`/`)** | `@octocat` or `github.com/gaearon` | Verifiable Proof Cards, Recruiter Translations, and Evidence Timeline |
| **Dual Compare (`/compare`)** | `octocat` vs `torvalds` | Neutral side-by-side metric comparison report |
| **Job Match (`/job-match`)** | `@octocat` + Click *Full Stack Engineer* sample | Ranked relevant repositories with 5-part score breakdown & evidence snippets |
| **Email Sign In (`/login`)** | Click *Recruiter Demo* (`recruiter@gitproof.com`) | Instant authenticated user session |

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for details.

---

<div align="center">
  <sub>Built with ❤️ for developers, recruiters, and technical hiring teams.</sub>
</div>
