# Checklist 05: Deployment Readiness

Use this checklist before deploying an application or service to staging or production environments (e.g., cloud VMs, Render, Railway, AWS, or Docker containers).

---

## 1. Environment & Configuration Check

- [ ] **1.1 Environment Variable Audit**
  - Verify every required variable from `.env.example` is configured in the production hosting dashboard or production `.env` file:
    - `NODE_ENV=production`
    - `PORT`
    - `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
    - `JWT_SECRET` (unique, cryptographically random string)
    - `CLIENT_ORIGIN` (production frontend domain for CORS)
  - Verify that sensitive credentials are never baked into container images or client-side bundles.

- [ ] **1.2 React Environment Prefix Check**
  - Verify frontend environment variables only expose public client keys (e.g., `VITE_*` or `REACT_APP_*`).
  - Double check that backend secrets are NOT prefixed with client variable names.

---

## 2. Build & Asset Verification

- [ ] **2.1 Production Build Success**
  - Run the production build command locally or in CI:
    ```bash
    npm run build
    ```
  - Confirm the build completes without warnings or fatal errors.
  - Inspect output directory (`dist/` or `build/`) to ensure static assets (HTML, CSS, JS chunks) are generated properly.

- [ ] **2.2 Dependency Audit**
  - Check that all build tools (Vite, Webpack, Babel, ESLint, test runners) are listed under `devDependencies`.
  - Check that all runtime necessities (Express, MySQL driver, CORS) are in `dependencies`.
  - Run `npm audit` to check for known high-severity vulnerabilities.

---

## 3. Database & Migration Preparedness

- [ ] **3.1 Schema & Migration Scripts**
  - Confirm all new tables, columns, and foreign key indexes have corresponding migration scripts.
  - Test running migrations on a staging/test database before running on production.
  - Ensure a rollback strategy exists for any destructive schema adjustments.

- [ ] **3.2 Connection Pooling & Resiliency**
  - Ensure MySQL connection pool settings are configured for production:
    - Connection limit appropriate for hosting tier (`connectionLimit: 10`).
    - Keepalive / reconnect handling enabled.

---

## 4. Operational & Observability Checks

- [ ] **4.1 Health Check Endpoint**
  - Ensure a dedicated health check route exists (e.g., `GET /api/health` or `GET /health`):
    - Returns HTTP `200 OK` with JSON `{ "status": "ok", "uptime": process.uptime() }`.
    - Can perform a lightweight database ping (`SELECT 1`) to confirm database connectivity.

- [ ] **4.2 Graceful Process Shutdown**
  - Verify the server handles termination signals (`SIGTERM`, `SIGINT`):
    - Stops accepting new incoming HTTP connections.
    - Closes active database pools cleanly.
    - Exits process with code 0.

- [ ] **4.3 Process Manager / Hosting Setup**
  - Ensure the app is managed by a process manager (e.g., PM2, systemd, or container orchestrator) to auto-restart on unexpected failures.

