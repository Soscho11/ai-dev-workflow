# Checklist 02: Bug Investigation & Root Cause Analysis

Follow this strict 5-phase protocol whenever an error, bug, or unexpected behavior is reported. Never jump straight to writing a fix without identifying the underlying root cause first.

---

## Phase 1: Symptom & Error Capture

- [ ] **1.1 Gather the Evidence**
  - Record exact error messages, stack traces, and HTTP status codes (e.g., 500 Internal Server Error, 404 Not Found, 401 Unauthorized).
  - Note the exact user action or API request that triggered the issue:
    - HTTP method and endpoint (`POST /api/auth/login`).
    - Request payload (`req.body`), query parameters (`req.query`), or URL params (`req.params`).
  - Check browser console logs (for React frontend) or terminal logs (for Express/Node).

- [ ] **1.2 Classify the Failure Domain**
  - [ ] **Database**: Connection timeout, syntax error in SQL, missing column, constraint violation.
  - [ ] **Backend Runtime**: `TypeError: Cannot read properties of undefined`, unhandled Promise rejection, missing middleware.
  - [ ] **Network / CORS**: Missing `Access-Control-Allow-Origin` header, wrong API base URL.
  - [ ] **Frontend**: Uncaught React rendering error, infinite re-render loop, state mismatch, stale closure in `useEffect`.

---

## Phase 2: Reproduce the Issue

- [ ] **2.1 Isolate Reproduction Steps**
  - Replicate the exact input and sequence of events that triggers the failure.
  - Can it be reproduced via an automated test, a `curl` / Postman command, or a minimal Node.js script?

- [ ] **2.2 Trace the Execution Flow**
  - Follow the data flow step-by-step:
    1. React User Event (e.g., button click, form submission).
    2. HTTP Request (payload structure).
    3. Express Route Middleware (auth checks, validation).
    4. Express Controller / Service.
    5. MySQL Query execution & returned result.
    6. HTTP Response returned to client.
    7. React State Update & DOM re-render.

---

## Phase 3: Root Cause Analysis (Explain the "Why")

- [ ] **3.1 Locate the Precise Failure Point**
  - Pinpoint the exact file name and line number(s) where the breakdown begins.

- [ ] **3.2 Answer the 3 Diagnostic Questions**:
  1. *What did the code expect to receive?* (e.g., An array with at least one record).
  2. *What did the code actually receive?* (e.g., `undefined` because the MySQL query returned empty rows).
  3. *Why did the existing checks fail to catch it?* (e.g., No conditional check before accessing `result[0].id`).

---

## Phase 4: Propose a Minimal, Surgical Fix

- [ ] **4.1 Avoid Collateral Damage**
  - Fix the root cause with the smallest, cleanest change possible.
  - Do not rewrite unrelated functions or refactor working code while fixing a bug.
  - Ensure defensive checks (e.g., optional chaining `user?.id`, input validation, or fallback defaults) are added.

- [ ] **4.2 Review Proposed Changes with the User**
  - Explain *what* will change, *why* it resolves the problem, and verify it does not break any existing contracts.

---

## Phase 5: Verification & Regression Check

- [ ] **5.1 Test the Fix**
  - Re-run the reproduction step that previously failed. Confirm it now succeeds with the expected output or HTTP status.

- [ ] **5.2 Check for Regressions**
  - Test valid input cases to ensure the normal happy path still works as expected.
  - Test edge cases (e.g., empty string, null, zero, special characters).
  - Run the test suite: `npm test`.
  - Report the actual test results honestly.

