# snip — URL Shortener with Click Analytics

A full-stack URL shortener that tracks every click — referrer, browser, OS,
and device — and visualizes the data in a live dashboard.

**Stack:** React (Vite) · Node.js · Express · MongoDB (Mongoose) · Recharts

## Features

- Shorten any URL, with optional custom short codes (e.g. `/my-link`)
- Every redirect is logged: timestamp, referrer, browser, OS, device type
- Dashboard with a live 7-day sparkline per link
- Detail view with trend chart, device breakdown, and browser breakdown
- Rate-limited link creation (20/min) to prevent abuse
- Link expiry support (`expiresAt` field, ready to wire into the UI)

## Project structure

```
url-shortener/
├── server/              Express API + redirect handler
│   ├── models/Link.js   Mongoose schema (link + embedded click events)
│   ├── routes/links.js  CRUD routes + the actual /:shortCode redirect
│   ├── analytics.js     Aggregates raw click data into chart-ready shapes
│   ├── utils.js         Short code generation & validation
│   └── server.js        App entrypoint
└── client/              React (Vite) dashboard
    └── src/
        ├── components/  Sparkline, CreateLinkForm, LinkRow
        └── pages/       Dashboard, LinkDetail
```

## Running it locally

### 1. Backend

You need a MongoDB instance — easiest options:
- **Local**: install MongoDB Community Server, runs on `mongodb://localhost:27017` by default
- **Free cloud option**: create a free cluster at MongoDB Atlas and copy the connection string

```bash
cd server
npm install
cp .env.example .env
# edit .env and set MONGO_URI to your connection string
node server.js
```

The API runs on `http://localhost:4000` by default.

### 2. Frontend

```bash
cd client
npm install
npm run dev
```

Opens on `http://localhost:5173`. The Vite dev server proxies `/api/*`
requests to `http://localhost:4000`, so just run both servers side by side.

### 3. Try it

1. Open `http://localhost:5173`
2. Paste a long URL, hit **Shorten**
3. Click the generated short link a few times (open `http://localhost:4000/<code>` directly,
   or once deployed, your real domain)
4. Click into the link from the dashboard to see the analytics update

## Deploying

- **Backend**: Render, Railway, or Fly.io all support Node + a MongoDB Atlas connection string for free/cheap.
- **Frontend**: Vercel or Netlify — set the build command to `npm run build` and point API calls at your deployed backend's URL (update the proxy / add an env-based API base URL before deploying).
- Once deployed, short links become real shareable URLs like `https://yourapp.com/abc1234`.

## What to highlight on a resume / in interviews

- Designed a MongoDB schema with embedded click-event documents and built
  aggregation logic (`analytics.js`) to turn raw events into time-series and
  categorical breakdowns without a separate analytics database.
- Implemented rate limiting and input validation (URL + custom code) to
  harden a public-facing write endpoint.
- Built a small reusable SVG sparkline component from scratch (no charting
  library) for the list view, and used Recharts for the deeper detail-page
  visualizations — a deliberate choice of lightweight custom code vs. a
  library depending on the complexity needed.
