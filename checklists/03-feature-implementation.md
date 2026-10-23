# Checklist 03: Feature Implementation

Use this checklist when building a new capability, endpoint, or user-facing feature. Following this checklist ensures changes are broken into manageable, testable steps rather than high-risk, all-at-once modifications.

---

## Step 1: Feature Scoping & Architecture Proposal

- [ ] **1.1 Clarify User Requirements**
  - What is the user problem being solved?
  - What are the inputs, actions, and expected outputs?
  - What edge cases exist (e.g., duplicate entries, unauthorized access, missing inputs)?

- [ ] **1.2 Generate Feature Proposal**
  - Use `templates/feature-plan-template.md`.
  - Outline all affected files (new and modified).
  - List database changes (tables, columns, indexes).
  - List new API endpoints (method, URL, request/response format).
  - Present the plan to the user and **await approval before editing code**.

---

## Step 2: Database Layer (The Foundation)

- [ ] **2.1 Prepare Schema Migration**
  - Write SQL migration or table creation script.
  - Ensure correct data types (e.g., `INT UNSIGNED`, `VARCHAR`, `TEXT`, `DECIMAL(10,2)`).
  - Define primary keys, foreign key constraints, and indexes.
  - Include timestamps (`created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`).

- [ ] **2.2 Verify Query Operations**
  - Ensure queries use prepared statement placeholders (`?`).
  - Test query execution independently before wiring to Express controllers.

---

## Step 3: Backend API Layer (Express.js)

- [ ] **3.1 Request Validation**
  - Validate request payload (`req.body`, `req.query`, `req.params`).
  - Return clear, helpful `400 Bad Request` responses for missing or invalid parameters.

- [ ] **3.2 Controller & Service Implementation**
  - Keep controllers lean: extract params, call service/database, return HTTP response.
  - Wrap asynchronous calls in `try/catch` or pass errors to `next(err)`.
  - Return proper HTTP status codes:
    - `200 OK` (successful retrieval or update)
    - `201 Created` (new resource successfully created)
    - `400 Bad Request` (client input error)
    - `401 Unauthorized` (authentication required)
    - `403 Forbidden` (authenticated, but insufficient rights)
    - `404 Not Found` (resource does not exist)
    - `500 Internal Server Error` (unexpected server fault)

- [ ] **3.3 Wire Express Route**
  - Register route in appropriate router module.
  - Apply necessary auth/role middleware.
  - Test endpoint with a quick HTTP client request or unit test.

---

## Step 4: Frontend UI Layer (React)

- [ ] **4.1 API Communication Service**
  - Create or update the API client function (e.g., Axios or `fetch`).
  - Handle success and failure responses gracefully.

- [ ] **4.2 React Component Development**
  - Build UI components in isolation (clean props and state).
  - Implement the 3 Core UI States:
    1. **Loading state**: Spinner, skeleton, or disabled buttons while request is in flight.
    2. **Error state**: Clear, actionable error alert displayed to the user if the request fails.
    3. **Success/Empty state**: Content rendered or polite empty state message ("No items found").

---

## Step 5: Verification & End-to-End Walkthrough

- [ ] **5.1 End-to-End Test**
  - Perform the full flow: UI interaction $\rightarrow$ API call $\rightarrow$ MySQL storage $\rightarrow$ UI update.
- [ ] **5.2 Automated Tests**
  - Write or run automated tests covering the new endpoint or component.
- [ ] **5.3 Code Cleanup**
  - Remove debug `console.log` statements.
  - Verify formatting and adherence to existing project conventions.

