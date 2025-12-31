# Pastebin-Lite

A lightweight Pastebin-style application where users can create text pastes and share them using generated links.

This project was built for a take-home assignment. It supports time-based expiry (TTL), view-count limits, deterministic expiry testing, and persistent storage.

---

## 🚀 Live Deployment

Production URL:

https://pastebin-lite-delta-ten.vercel.app  
(or your custom alias)

---

## 🧠 Features

- Create a text paste
- Receive a shareable URL
- View paste via `/p/:id`
- Optional constraints:
  - ⏳ TTL (time-based expiry)
  - 👁️ View-count limit
- Paste becomes unavailable when:
  - TTL expires OR
  - View limit is reached
- Deterministic time testing via header:
  `x-test-now-ms`
- Persistent storage using **Upstash Redis (Vercel KV)**
- 404 returned for:
  - Missing paste
  - Expired paste
  - View limit exceeded

---

## 🗂️ Tech Stack

- Next.js (App Router)
- Vercel Serverless Functions
- Upstash Redis / Vercel KV
- TypeScript
- Simple CSS (no UI framework)

---

## 🛠️ Running the Project Locally

### 1️⃣ Install dependencies

```bash
npm install
2️⃣ Create .env.local

Add the following variables (from Upstash / Vercel KV):

UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...

KV_REST_API_URL=...
KV_REST_API_TOKEN=...
KV_REST_API_READ_ONLY_TOKEN=...

NEXT_PUBLIC_APP_URL=http://localhost:3000


(Production uses Vercel environment variables)

3️⃣ Start local dev server
npm run dev


App runs at:

http://localhost:3000

📡 API Routes
Health Check
GET /api/healthz


Returns 200 + JSON if app & persistence are healthy:

{ "ok": true }

Create Paste
POST /api/pastes


Request body:

{
  "content": "string",
  "ttl_seconds": 60,
  "max_views": 5
}


Validation rules:

content required, non-empty string

ttl_seconds optional, integer ≥ 1

max_views optional, integer ≥ 1

Successful response:

{
  "id": "string",
  "url": "https://your-app.vercel.app/p/<id>"
}

Fetch Paste (API)
GET /api/pastes/:id


Success response:

{
  "content": "string",
  "remaining_views": 3,
  "expires_at": "2026-01-01T00:00:00.000Z"
}


Notes:

Each API fetch counts as a view

If unlimited, fields may be null

Unavailable / expired / exceeded:

404 JSON

🧪 Deterministic Time Testing (TTL)

When:

TEST_MODE=1


A request may include:

x-test-now-ms: <unix ms timestamp>


That timestamp is used instead of real time for expiry checks only.

If header is missing → real clock is used.

🌐 HTML Paste Viewer
GET /p/:id


Returns HTML page with paste content

Sanitized, no script execution

404 if unavailable

💾 Persistence Layer

The project uses:

✔ Upstash Redis (Vercel KV)
✔ survives across requests & deployments
✔ suitable for serverless environments

Stored fields per paste:

id
content
created_at
ttl_seconds
max_views
views

🧩 Design Decisions

Chose Redis/KV for simplicity & low-latency reads

Avoided in-memory storage (not reliable on serverless)

Used deterministic TTL testing to support automated grading

Clean minimal UI — functionally focused



👤 Author

Shirisha Kethavath