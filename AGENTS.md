# Agent Rules of Engagement & Operational Guidelines

This document establishes the governing rules, responsibilities, and operating standards for any AI agent working within this workspace. All AI activities must strictly adhere to these protocols.

---

## 1. Core Operating Principles

### A. Safety & Permission Boundaries
1. **Never delete files or folders** without explicit, written confirmation from the user.
2. **Never run destructive or irreversible terminal commands** (e.g., `rmdir /s /q`, `git reset --hard`, `DROP DATABASE`, `TRUNCATE TABLE`) without explicit user consent.
3. **Never modify files outside the project root directory**.
4. **Zero credential leakage**: Never print, commit, or log sensitive secrets, passwords, database credentials, JWT secrets, or API keys. If a credential must be referenced, use dummy placeholders (e.g., `process.env.DB_PASSWORD`).

### B. Inspect Before Modifying
1. Always inspect existing code, directory structures, and configurations before proposing or executing edits.
2. Verify package dependencies in `package.json` before assuming libraries or tools exist.
3. Check existing coding styles, naming conventions, and linting rules, and preserve them.

### C. Propose Before Executing Major Changes
1. For multi-file refactors, database schema modifications, or new architecture setup, present a concise plan first using `templates/feature-plan-template.md`.
2. Wait for the user's approval before applying major file changes.
3. For small, single-file fixes or requested immediate edits, proceed directly while explaining the changes clearly.

### D. Honest Verification & Testing
1. **Never simulate, hallucinate, or assume test results**. Run the actual tests or build checks via the terminal.
2. If tests fail, report the exact failure output honestly. Do not claim a fix works until it has been verified by execution.
3. If no automated tests exist, run a syntax or build check (e.g., `node -c <file>` or `npm run build`) and propose a minimal test.

---

## 2. Technical Stack Standards

### A. Backend: Node.js & Express.js
* Use modern ES module (`import`/`export`) or CommonJS (`require`) consistently according to the target project's `package.json` (`"type": "module"`).
* Always handle asynchronous errors using `try/catch` or an async wrapper middleware to prevent uncaught promise rejections from crashing the server.
* Centralize error handling in an Express error middleware `(err, req, res, next)`.
* Keep controllers, route definitions, and service/database logic separated.

### B. Database: MySQL
* **Always use parameterized queries or prepared statements** (e.g., `mysql2/promise` with `connection.execute(query, [params])`). Never concatenate untrusted user input directly into SQL strings.
* Include migration scripts or schema definitions with explicit types (`VARCHAR(255)`, `INT AUTO_INCREMENT`, `TIMESTAMP DEFAULT CURRENT_TIMESTAMP`).
* Ensure database connection pools are cleanly closed during shutdown or testing.

### C. Frontend: React & JavaScript
* Use functional components with hooks (`useState`, `useEffect`, `useCallback`, `useMemo`).
* Keep component responsibilities focused: separate presentation from data fetching or complex state management.
* Avoid prop drilling: recommend Context API or lightweight state stores when appropriate.
* Prevent Cross-Site Scripting (XSS): avoid `dangerouslySetInnerHTML` unless strictly sanitized.

---

## 3. Communication & Explanations

1. **Step-by-step guidance**: Explain technical concepts in clear, beginner-friendly terms, providing the "why" behind every architectural decision.
2. **Clickable file paths**: Always link relevant files using markdown file links (e.g., `[server.js](file:///c:/Users/HP/Desktop/New/server.js)`).
3. **Preserve documentation**: Maintain existing comments and docstrings. Do not wipe out comments unless they are obsolete or explicitly requested to be removed.

