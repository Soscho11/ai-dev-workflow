# Project Architecture & System Documentation

## 1. Executive Overview
* **Project Name**: [Project Name]
* **Version**: [1.0.0]
* **Description**: [High-level summary of what the system does]
* **Primary Tech Stack**:
  * **Frontend**: React, React Router, Vite / CRA
  * **Backend**: Node.js, Express.js
  * **Database**: MySQL 8.x
  * **Authentication**: JWT / bcrypt

---

## 2. Directory Layout & Key Modules

```text
├── src/
│   ├── client/                  # React Frontend
│   │   ├── components/          # Reusable UI components
│   │   ├── pages/               # Route views
│   │   ├── services/            # API integration modules
│   │   └── App.jsx              # Main React routing and layout
│   │
│   └── server/                  # Express Backend
│       ├── config/              # Database and environment configs
│       ├── controllers/         # Business logic and request handlers
│       ├── middleware/          # Auth, CORS, error handling
│       ├── routes/              # Express route declarations
│       └── server.js            # Server entry point
```

---

## 3. Database Schema Reference (MySQL)

### Table: `users`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `INT UNSIGNED` | `AUTO_INCREMENT, PRIMARY KEY` | Unique user identifier |
| `email` | `VARCHAR(255)` | `NOT NULL, UNIQUE` | User login email |
| `password_hash` | `VARCHAR(255)` | `NOT NULL` | Bcrypt hashed password |
| `created_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Account creation timestamp |

---

## 4. REST API Endpoint Catalog

### Authentication Endpoints
* **`POST /api/auth/register`**
  * **Description**: Registers a new user account.
  * **Request Body**:
    ```json
    { "email": "user@example.com", "password": "securePassword123" }
    ```
  * **Response (201 Created)**:
    ```json
    { "id": 1, "email": "user@example.com" }
    ```

* **`POST /api/auth/login`**
  * **Description**: Authenticates user and returns JWT token.
  * **Response (200 OK)**:
    ```json
    { "token": "eyJhbGciOi..." }
    ```

---

## 5. Local Setup & Running Instructions

### Prerequisites
* Node.js $\ge 18$
* MySQL Server running locally or in Docker

### Step-by-Step Installation
1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd <project-folder>
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   * Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   * Fill in your MySQL credentials and local port in `.env`.
4. Run migrations:
   ```bash
   npm run db:migrate
   ```
5. Start development servers:
   ```bash
   npm run dev
   ```

