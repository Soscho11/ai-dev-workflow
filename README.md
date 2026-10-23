# AI-Assisted Full-Stack Development Workflow

A structured, safe, and repeatable engineering workflow designed for full-stack JavaScript development (React, Node.js, Express, MySQL) using Antigravity on Windows 11.

---

## 🎯 Purpose & Goals

This workflow standardizes how you and your AI assistant collaborate across the seven key stages of software development:

1. **Project Analysis**: Quickly mapping existing codebases, schemas, routes, and dependencies.
2. **Bug Investigation**: Root-cause diagnostics with reproducible evidence and verification.
3. **Iterative Feature Implementation**: Breaking work into bite-sized, reviewable milestones.
4. **Automated Testing**: Writing and executing unit, integration, and API tests.
5. **Security & Vulnerability Reviews**: Auditing code for SQL injection, XSS, auth flaws, and leaked secrets.
6. **Documentation Generation**: Producing clear architectural diagrams and API references.
7. **Deployment Readiness**: Preparing environment configs, build artifacts, and database migrations.

---

## 📂 Repository Structure

```text
├── .gitignore                      # Git ignore rules for Node, React, and environment secrets
├── AGENTS.md                       # Mandatory rules of engagement and safety boundaries for the AI
├── README.md                       # This comprehensive workflow guide
│
├── checklists/                     # Practical step-by-step checklists
│   ├── 01-project-analysis.md      # Codebase discovery and architecture mapping
│   ├── 02-bug-investigation.md     # 5-step bug diagnostic & verification protocol
│   ├── 03-feature-implementation.md# Step-by-step incremental feature development
│   ├── 04-security-review.md       # Security audit checklist (SQLi, XSS, CORS, Secrets)
│   └── 05-deployment-readiness.md  # Production pre-flight checklist
│
├── templates/                      # Reusable engineering templates
│   ├── bug-report-template.md      # Standard format for bug diagnosis and resolution
│   ├── feature-plan-template.md    # Template for proposing changes before modifying code
│   └── architecture-doc-template.md# Blueprint for project architecture documentation
│
└── scripts/                        # Zero-dependency Node.js utilities
    ├── analyze-project.js          # Fast inspection script for directory trees and packages
    └── audit-secrets.js            # Scans for accidental secret leaks before committing
```

---

## 🛠️ The 7-Stage Workflow Guide

### Stage 1: Project Analysis
* **When to use**: When opening an existing or unfamiliar project.
* **How to run**:
  1. Ask the AI: *"Analyze this project using `checklists/01-project-analysis.md`"*.
  2. Or run the zero-dependency utility script:
     ```bash
     node scripts/analyze-project.js
     ```
  3. The AI will output an architectural summary covering tech stack, entry points, routes, and database models.

---

### Stage 2: Bug Investigation & Root Cause Analysis
* **When to use**: When facing an error, failed request, or unexpected behavior.
* **How to run**:
  1. Share the error message or symptom with the AI.
  2. Ask the AI to follow `checklists/02-bug-investigation.md`.
  3. The AI will:
     * Reproduce the issue or write a failing test.
     * Identify the exact file and lines responsible.
     * Explain the root cause in plain English.
     * Propose a minimal fix and test it.

---

### Stage 3: Step-by-Step Feature Implementation
* **When to use**: When building a new API route, React component, or database table.
* **How to run**:
  1. Describe the feature to the AI.
  2. The AI generates a plan using `templates/feature-plan-template.md`.
  3. Once approved, the feature is implemented incrementally:
     * Step 1: Database table / migration
     * Step 2: Backend API endpoint & validation
     * Step 3: Frontend component & state wiring
     * Step 4: Verification test

---

### Stage 4: Automated Testing
* **When to use**: After adding features or fixing bugs.
* **How to run**:
  1. Use standard npm test scripts (e.g., `npm test` with Jest, Vitest, or Supertest).
  2. The AI executes the test in the terminal and reports the real, unedited test output.

---

### Stage 5: Security Review
* **When to use**: Before committing code or deploying.
* **How to run**:
  1. Run the secrets auditor to catch uncommitted credentials:
     ```bash
     node scripts/audit-secrets.js
     ```
  2. Ask the AI: *"Review our recent changes against `checklists/04-security-review.md`"*.
  3. Verifies parameterized MySQL queries, sanitized inputs, and secure HTTP headers.

---

### Stage 6: Project Documentation
* **When to use**: When completing a feature or preparing a project handover.
* **How to run**:
  1. Instruct the AI: *"Generate an architecture document following `templates/architecture-doc-template.md`"*.
  2. The AI creates a comprehensive overview of routes, database schemas, and setup instructions.

---

### Stage 7: Deployment Readiness
* **When to use**: Before pushing to staging, production, or cloud hosting (e.g., Render, Railway, AWS).
* **How to run**:
  1. Walk through `checklists/05-deployment-readiness.md`.
  2. Verify `.env.example` has all required keys without real secrets.
  3. Run production build tests (`npm run build`).

---

## 🔒 Safety Guarantees (Antigravity & Windows 11)

* **No Destructive Actions**: Terminal commands that delete files, drop tables, or wipe git histories require your explicit confirmation.
* **Inspect Before Touch**: No guesswork. Code is read and verified before modifications are proposed.
* **Local & Contained**: All operations remain strictly inside the active project directory.

