# Checklist 01: Project Analysis

Use this checklist whenever you open an unfamiliar project or want a complete health and architecture assessment of an existing codebase.

---

## Phase 1: Environment & Dependency Discovery

- [ ] **1.1 Inspect `package.json`**
  - Check project name, version, and module type (`"type": "module"` vs CommonJS).
  - List primary dependencies:
    - Web framework (Express, fastify, etc.)
    - Frontend framework/library (React, Vite, Next.js, Create React App)
    - Database drivers/ORMs (`mysql2`, `sequelize`, `prisma`, `knex`)
    - Authentication (`jsonwebtoken`, `bcrypt`, `passport`, `cookie-parser`)
  - Review scripts in `"scripts"`: `start`, `dev`, `build`, `test`, `lint`.

- [ ] **1.2 Check Environment Configuration**
  - Verify if `.env.example` exists.
  - Check what environment variables the app expects (`PORT`, `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME`, `JWT_SECRET`).
  - Confirm `.env` is listed in `.gitignore` and not tracked in git history.

- [ ] **1.3 Check Git Repository Status**
  - Run `git status` to see untracked files or pending changes.
  - Run `git branch` to check current branch.

---

## Phase 2: Architecture & Entry Points

- [ ] **2.1 Locate Server Entry Point**
  - Typical paths: `server.js`, `index.js`, `app.js`, `src/server.js`, `src/index.js`.
  - Identify port configuration and middleware stack:
    - Body parsers (`express.json()`, `express.urlencoded()`)
    - CORS configuration (`cors()`)
    - Security headers (`helmet()`)
    - Request logging (`morgan()`)

- [ ] **2.2 Map API Routes & Controllers**
  - Locate routing definitions (e.g., `routes/` or `api/`).
  - Map each endpoint:
    - HTTP method (`GET`, `POST`, `PUT`, `DELETE`)
    - Route URL (e.g., `/api/users`, `/api/products/:id`)
    - Controller / handler function
    - Authentication / authorization middleware applied

- [ ] **2.3 Map Database Connection & Models**
  - Locate database configuration (e.g., `config/db.js`, `models/`, `db.js`).
  - Check connection method:
    - Direct connection vs. Connection Pool (`mysql.createPool()`).
    - Promise-based wrapper (`mysql2/promise`).
  - Identify existing tables or schemas.

- [ ] **2.4 Locate Frontend Structure (React)**
  - Locate frontend entry point (`src/index.jsx`, `src/main.jsx`, `src/App.jsx`).
  - Identify routing library (`react-router-dom`).
  - Note state management strategy (React Context, Redux, Zustand, or component state).
  - Identify API communication layer (Axios instance, `fetch` wrappers).

---

## Phase 3: Quality & Test Readiness

- [ ] **3.1 Identify Existing Tests**
  - Look for `test/`, `tests/`, `__tests__/`, or files ending in `.test.js` or `.spec.js`.
  - Check testing runner (Jest, Vitest, Mocha, Supertest).
  - Run test suite if present (`npm test`) and record baseline status.

- [ ] **3.2 Identify Potential Tech Debt or Bottlenecks**
  - Are SQL queries written inline or separated in models/repositories?
  - Are errors handled gracefully with HTTP status codes, or do unhandled errors crash the process?
  - Are sensitive values hardcoded anywhere in the codebase?

---

## Analysis Output Template
After completing this checklist, generate a summary in this format:

```markdown
### Project Architecture Summary

* **Project Type**: Full-Stack (React Frontend + Express Backend + MySQL)
* **Module System**: [CommonJS / ES Modules]
* **Server Entry Point**: [path/to/entry.js]
* **Client Entry Point**: [path/to/entry.jsx]
* **Database Layer**: [mysql2 / pool / ORM]
* **Registered Endpoints**: [Count] routes found
* **Test Suite Status**: [Configured / Missing / Failing]
* **Key Observations**:
  1. [Observation 1]
  2. [Observation 2]
```

