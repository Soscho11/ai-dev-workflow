# Deployment Guide: Vercel (Frontend) + Render (Backend)

This guide walks you step-by-step through deploying your full-stack application completely on free tiers.

```text
┌─────────────────────────┐         ┌─────────────────────────┐
│     Vercel (Free)       │  HTTP   │      Render (Free)      │
│  React (Vite) Frontend  │ ──────> │   Node / Express API    │
│  my-app.vercel.app      │         │   my-api.onrender.com   │
└─────────────────────────┘         └────────────┬────────────┘
                                                 │
                                                 ▼
                                    ┌─────────────────────────┐
                                    │  In-Memory / Cloud MySQL│
                                    │  (Fallback or Aiven DB) │
                                    └─────────────────────────┘
```

---

## Part 1: Deploy the Backend to Render (Free)

### 1. Create a New Web Service
1. Go to [dashboard.render.com](https://dashboard.render.com) and sign in with GitHub.
2. Click **"New +"** (top right) $\rightarrow$ **"Web Service"**.
3. Select **"Build and deploy from a Git repository"** and choose:
   `Soscho11/ai-dev-workflow`

### 2. Configure the Web Service
Configure the settings with these exact values:
* **Name**: `task-manager-api` (or any custom name)
* **Region**: Choose the closest region (e.g., *Singapore* or *Frankfurt*)
* **Branch**: `main`
* **Root Directory**: `sample-app` *(CRITICAL: don't leave this empty)*
* **Runtime**: `Node`
* **Build Command**: `npm install`
* **Start Command**: `npm start`
* **Instance Type**: **Free**

### 3. Add Environment Variables
Scroll down to the **Environment Variables** section and add:
| Key | Value | Notes |
|---|---|---|
| `NODE_ENV` | `production` | Enables production mode |
| `CLIENT_ORIGIN` | `*` | Or specify your Vercel domain later |

*(Note on Database: If you don't provide MySQL credentials, the backend automatically uses its resilient built-in in-memory fallback store so your API works immediately without crashing).*

### 4. Deploy & Copy URL
1. Click **"Create Web Service"**.
2. Wait 1–2 minutes for the build to finish.
3. Once it says **"Live"**, copy your public Render URL:
   `https://task-manager-api-xxxx.onrender.com`
4. Test it by visiting in your browser:
   `https://task-manager-api-xxxx.onrender.com/api/health`
   You should see: `{"status":"healthy","uptime":...}`

---

## Part 2: Deploy the Frontend to Vercel (Free)

### 1. Import Repository
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub.
2. Click **"Add New..."** $\rightarrow$ **"Project"**.
3. Locate `Soscho11/ai-dev-workflow` and click **"Import"**.

### 2. Configure Project Settings
In the configuration screen:
* **Framework Preset**: `Vite`
* **Root Directory**: Click **"Edit"** next to Root Directory and select:
  `sample-app` *(CRITICAL: must point to sample-app)*
* **Build Command**: `npm run build` *(auto-detected)*
* **Output Directory**: `dist` *(auto-detected)*

### 3. Add Environment Variable
Expand the **Environment Variables** section and add:
* **Name**: `VITE_API_BASE_URL`
* **Value**: Your Render Backend URL from Part 1:
  `https://task-manager-api-xxxx.onrender.com` *(do not add a trailing slash `/`)*

### 4. Deploy
1. Click **"Deploy"**.
2. In about 30 seconds, Vercel will complete the build and show you the confetti celebration screen!
3. Click on the preview image or domain link to open your live website.

---

## ⚡ Important Notes for Free Tiers
* **Render Free Spin-Down**: Render's free tier spins down (sleeps) if no requests are received for 15 minutes. 
  When you first visit your Vercel site after a break, the first request may take ~30–45 seconds to wake up the Render server.
* Our React app has been updated with a helpful notice during wake-ups!
