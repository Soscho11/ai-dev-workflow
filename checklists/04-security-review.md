# Checklist 04: Security & Vulnerability Review

Use this checklist before finalizing code changes, committing to git, or preparing a release. It focuses on the most common security vulnerabilities in the Node.js, Express, React, and MySQL stack.

---

## 1. Database & SQL Injection (SQLi) Defense

- [ ] **1.1 Zero SQL String Concatenation**
  - **Vulnerable**: `` `SELECT * FROM users WHERE email = '${req.body.email}'` ``
  - **Secure**: `db.execute('SELECT * FROM users WHERE email = ?', [req.body.email])`
  - Ensure **every single** dynamic value passed to MySQL utilizes parameterized queries or prepared statement placeholders (`?`).

- [ ] **1.2 Dynamic Column or Table Names (Whitelisting)**
  - If table or column names must be dynamic (e.g., sorting by `req.query.sort`), **never** pass user input directly into the query.
  - Match against a strict whitelist array (e.g., `const ALLOWED_COLUMNS = ['created_at', 'title', 'price'];`).

---

## 2. Backend & Express.js Hardening

- [ ] **2.1 HTTP Security Headers**
  - Is `helmet` enabled? (`app.use(helmet())`)
  - Ensures headers like `X-Content-Type-Options: nosniff` and `Strict-Transport-Security` are set.

- [ ] **2.2 CORS (Cross-Origin Resource Sharing)**
  - Is CORS restricted to trusted frontend origins?
  - Avoid wildcard `cors({ origin: '*' })` in production when credentials (cookies, auth headers) are transmitted.

- [ ] **2.3 Rate Limiting & DoS Protection**
  - Are public or sensitive endpoints (e.g., `/api/auth/login`, `/api/auth/register`, password resets) protected with rate limiting (`express-rate-limit`)?
  - Are request payload limits enforced (`express.json({ limit: '10kb' })`) to prevent memory exhaustion attacks?

- [ ] **2.4 Error Information Leakage**
  - Does the production error handler suppress detailed database errors and internal stack traces?
  - In production, return generic messages: `{ "message": "An unexpected error occurred" }` while logging the full error internally on the server.

---

## 3. Authentication & Password Security

- [ ] **3.1 Password Storage**
  - Are passwords hashed using `bcrypt` or `argon2` with an appropriate salt work factor (e.g., salt rounds $\ge 10$)?
  - Are plain-text passwords ever logged, printed, or returned in API responses? (Ensure `password` column is omitted from user query responses).

- [ ] **3.2 Token Management (JWT)**
  - Is the `JWT_SECRET` loaded from environment variables and sufficiently long/random?
  - Does the token have a defined expiration (`expiresIn: '1h'` or `'1d'`)?

---

## 4. Frontend & React Protection (XSS)

- [ ] **4.1 Avoid Dangerous DOM Injection**
  - Verify that `dangerouslySetInnerHTML` is **not** used with unsanitized user content.
  - If rich HTML must be rendered, ensure it is sanitized with a library like `DOMPurify`.

- [ ] **4.2 Safe Link Targets**
  - If rendering user-submitted URLs in `<a>` tags:
    - Ensure URL protocols are validated (allow only `http:` and `https:`, blocking `javascript:` URIs).
    - If `target="_blank"` is used, include `rel="noopener noreferrer"`.

---

## 5. Secrets & Environment Hygiene

- [ ] **5.1 Zero Hardcoded Secrets**
  - Run the secret auditor:
    ```bash
    node scripts/audit-secrets.js
    ```
  - Verify no API keys, private keys, database passwords, or JWT secrets are hardcoded in source files.
  - Confirm `.env` is listed in `.gitignore`.
  - Confirm `.env.example` contains variable names only, with dummy placeholder values.

