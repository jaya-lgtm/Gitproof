# GitProof — Source-Grounded Developer Intelligence Platform

> **Turn real GitHub activity into transparent, verified proof of what a developer can actually do.**

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=flat-square&logo=react)](https://react.js.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.style=flat-square)](LICENSE)

---

## 📌 Overview

**GitProof** is a developer intelligence platform that converts public GitHub evidence (commits, pull requests, issues, READMEs, manifest dependencies, and source code) into recruiter-friendly **Proof of Work Cards** and job-relevant project rankings.

Unlike generic resume parsers or LLM evaluators that hallucinate non-existent experience, **GitProof enforces 100% source-grounded evidence**. No technology is credited unless verified by raw GitHub activity, manifest dependencies, or source code snippets.

---

## ✨ Core Features

### 1. 🔍 Single Profile Analysis
- Enter any public GitHub profile handle (`@username`) or URL.
- Fetches public repositories, user-authored pull requests, commits, and issue contributions.
- Generates **Verifiable Proof of Work Cards** categorized by *Tech Stack*, *Community Impact*, *Engineering Activity*, and *Portfolio Evidence*.
- Translates complex technical commit messages into recruiter-friendly explanations with a single click to inspect raw source evidence.

### 2. ⚔️ Side-by-Side Profile Comparison (`/compare`)
- Concurrently fetches and analyzes two developer profiles side-by-side using `Promise.all`.
- Generates a **Neutral Metric Comparison Report** (public repos, stargazers, followers, activity depth, primary languages, member since).
- Strictly objective — zero subjective rankings or "leaderboard gaming" scores.

### 3. 🎯 Job Match & Project Ranking Engine (`/job-match`)
- Paste any target Job Description (JD) text.
- Parses JD into required/preferred skills, languages, frameworks, and domain keywords.
- Performs lightweight candidate filtering, then conducts **Deep Inspection** on top candidate repositories:
  - `README.md` documentation
  - Dependency manifests (`package.json`, `requirements.txt`, `pyproject.toml`, `Cargo.toml`, `go.mod`, `pom.xml`)
  - Target source code files (3–5 key files per repository)
- Calculates a transparent **0–100% Match Score** using weighted evaluation:
  - **35%**: Explicit implementation / source code evidence
  - **25%**: Dependency / manifest matches
  - **20%**: Language / primary stack matches
  - **15%**: README / documentation matches
  - **5%**: Activity / recency
- Ranks candidate projects and outputs exact evidence snippets supporting each matched skill.

### 4. 🔐 Email Authentication
- Clean, database-backed user authentication (Email & Password).
- Hashed passwords saved using Node.js native SHA-256 crypto salting.

---

## 📐 System Architecture & Data Flow

```
[ User Input / Client Browser ]
      │
      ├──> Single Profile URL  ──>  POST /api/analyze
      ├──> Dual Compare URLs   ──>  POST /api/compare
      └──> Job Description     ──>  POST /api/job-match
                                         │
                                         ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        GitProof Backend Services                       │
│                                                                        │
│  ┌────────────────────┐     ┌───────────────────────────────────────┐  │
│  │  GitHub REST API   │<───>│  src/lib/github.ts                    │  │
│  │  (/users, /repos,  │     │  - Profile & Repo Fetcher             │  │
│  │   /events, /search)│     │  - Event & PR Search Collector        │  │
│  └────────────────────┘     └───────────────────────────────────────┘  │
│                                                │                       │
│  ┌────────────────────┐     ┌──────────────────▼────────────────────┐  │
│  │ GitHub Content API │<───>│  src/lib/github-content.ts            │  │
│  │ (README, Manifests,│     │  - Candidate Repo Selector            │  │
│  │  Source Code Trees)│     │  - Deep Inspection Engine             │  │
│  └────────────────────┘     └───────────────────────────────────────┘  │
│                                                │                       │
│                             ┌──────────────────▼────────────────────┐  │
│                             │  src/lib/job-matcher.ts               │  │
│                             │  - JD Skill Extractor                 │  │
│                             │  - 5-Part Weighted Scoring (0-100%)   │  │
│                             └───────────────────────────────────────┘  │
│                                                │                       │
│                             ┌──────────────────▼────────────────────┐  │
│                             │  src/lib/translator.ts                │  │
│                             │  - Conventional Commit Parser         │  │
│                             │  - Recruiter Translation Engine       │  │
│                             └───────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
                                         │
                                         ▼
[ UI Dashboard: Profile / Proof Cards / Evidence / Ranked Repositories ]
```

---

## 🛠️ Tech Stack

### Frontend & Framework
- **Framework**: Next.js 16.3 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 (Custom Dark Charcoal `#0D0F10` & Warm Orange `#F9732F` Design System)
- **Typography**: Geist Sans & Geist Mono

### Backend & API
- **API Routes**: Next.js Route Handlers (`src/app/api/*`)
- **Data Source**: GitHub REST API v3
- **Authentication**: Custom Server-Side API (`/api/auth/login`, `/api/auth/signup`)
- **Security**: SHA-256 password salting via Node.js native `crypto` module

---

## 🎨 Color-Coded Evidence System

GitProof uses a strict color-coded design language to maintain transparency:

| Accent | Color | Meaning |
| :--- | :--- | :--- |
| **Primary Brand** | Warm Orange (`#F9732F`) | Primary CTAs, active navigation, key highlights |
| **AI Interpretation** | Warm Orange / Dark Charcoal | Recruiter-friendly translations |
| **Verified Evidence** | Emerald Green (`#4ADE80`) | Verified source evidence, checkmarks, profile status |
| **Technical Data** | Primary Text (`#F5F2ED`) / Mono | Handles, repositories, code lines, file paths, scores |

---

## 🚀 Getting Started

### Prerequisites
- Node.js `v18.0.0` or higher
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/gitproof.git
   cd gitproof
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🧪 Building for Production

To create an optimized production build:

```bash
npm run build
```

To start the production server:

```bash
npm start
```

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
