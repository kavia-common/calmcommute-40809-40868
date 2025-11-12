# CalmCommute Frontend

## Overview
CalmCommute is a Next.js frontend designed to help users reduce stress during their daily commutes. The app enables quick mood check-ins, provides calming content recommendations, offers a guided breathing experience, displays traffic insights via a maps widget, and surfaces lightweight analytics. It supports optional integrations with Spotify or Apple Music and can operate in a local-only mode without backend services.

## Tech Stack
- Framework: Next.js (App Router)
- Language: TypeScript + React 19
- Styling: TailwindCSS (v4) via PostCSS pipeline
- Build: next build/export; static output available in `out/` folder
- Analytics: Optional client-side analytics with backend POST in production

## Getting Started

### Prerequisites
- Node.js 18+ (recommended LTS)
- npm, pnpm, yarn, or bun (any package manager will work)

### Install dependencies
```bash
npm install
# or
yarn
# or
pnpm install
# or
bun install
```

### Environment variables
Copy the example env file and adjust values as needed:
```bash
cp .env.example .env
```
All runtime configuration is read via NEXT_PUBLIC_* env vars (see “Configuration” below). In local-only mode, defaults and mocks are used when variables are left empty.

### Run in development
```bash
npm run dev
```
Then open http://localhost:3000 in your browser.

### Build and run in production
```bash
npm run build
npm start
```

### Static export (optional)
This project supports static export via Next.js. After `npm run build`, you can export to `out/` (already present in this repo) or configure your workflow to produce a static site depending on hosting needs.

## Application Routes

- / — Landing page with quick navigation to main areas.
- /dashboard — Main experience: mood check-in, recommendations, analytics summary, maps traffic widget (feature-flagged), and a breathing guide trigger.
- /history — View recent mood check-ins with a weekly trend.
- /preferences — Manage preferences such as music provider, traffic insights, content types, and notifications. Includes “Connect” flows for Spotify/Apple Music (stubs that redirect to backend start endpoints).
- /health — Health and environment status page that shows the effective configuration, feature flags, and basic checks for easier troubleshooting.

If an unknown path is visited, the app renders a Not Found page.

## Key Features

### Mood check-in
A guided quick input to log current mood and notes. Entries are persisted client-side to localStorage, and the history page presents a 7-day trend and recent entries.

### Recommendations
Based on mood and preferences, the app surfaces suggested calming activities or content. These are currently local and demo-oriented.

### Breathing guide
A focused breathing exercise with presets, animations, a simple timer, and analytics hooks. The dashboard includes a control to start/stop a modal with the guide.

### Maps traffic widget
Displays a basic commute context including a “traffic level” and estimated travel time (ETA). In demo mode, traffic levels are mocked and updated periodically. The widget can embed a simple Google Maps iframe as a visual context.

- Controlled by feature flag mapsTrafficWidget.
- For production-grade live traffic overlays, replace the embed URL approach with the Google Maps JavaScript API and TrafficLayer, sourced from a backend or a secured client strategy.

### Music connect (Spotify / Apple Music)
The Connect card is feature-flagged and demonstrates how a user would initiate OAuth or MusicKit flows. Clicking Connect redirects to optional backend endpoints:

- Spotify: {BACKEND_URL}/auth/spotify/start?redirect_uri={FRONTEND_URL}/preferences
- Apple Music: {BACKEND_URL}/auth/apple/start?redirect_uri={FRONTEND_URL}/preferences

These endpoints are stubs in this frontend; you must implement them on a backend if you want real auth. In local-only mode, you can keep the feature disabled.

### Lightweight analytics
A small client analytics utility generates an anonymous user ID and session ID and provides a typed track(event) API. It:
- Logs events to the console in development or when no BACKEND_URL is configured
- In production with BACKEND_URL set, POSTs to {BACKEND_URL}/analytics
- Respects NEXT_PUBLIC_NEXT_TELEMETRY_DISABLED to fully disable telemetry

## Configuration

All configuration is read from NEXT_PUBLIC_* environment variables at runtime via src/lib/publicConfig.ts. The following keys are recognized:

- NEXT_PUBLIC_API_BASE: Optional base URL for a public API used by the app or integrations. Leave empty for local-only demos.
- NEXT_PUBLIC_BACKEND_URL: Optional backend URL. When set and in production, analytics POSTs will be sent to {BACKEND_URL}/analytics. Also used by music connect stubs.
- NEXT_PUBLIC_FRONTEND_URL: Public URL for this frontend (e.g., http://localhost:3000 in development).
- NEXT_PUBLIC_WS_URL: Optional WebSocket base URL for real-time features (not required by default).
- NEXT_PUBLIC_NODE_ENV: Optional override of the runtime environment string; otherwise process.env.NODE_ENV is used.
- NEXT_PUBLIC_NEXT_TELEMETRY_DISABLED: Boolean to disable all analytics at runtime. “true/1/on/yes” are treated as true.
- NEXT_PUBLIC_ENABLE_SOURCE_MAPS: Boolean to enable source maps. Defaults to false.
- NEXT_PUBLIC_PORT: Port to advertise via the health page and public config. Defaults to 3000.
- NEXT_PUBLIC_TRUST_PROXY: Boolean indicating if the app is running behind a proxy. Defaults to false.
- NEXT_PUBLIC_LOG_LEVEL: One of “silent”, “error”, “warn”, “info”, “debug”. Defaults to “info”.
- NEXT_PUBLIC_HEALTHCHECK_PATH: Path for health checks on a backend or hosting layer. Defaults to “/api/health”.
- NEXT_PUBLIC_FEATURE_FLAGS: JSON object string with named feature flags. Example:
  {"mapsTrafficWidget": true, "musicConnect": false, "analyticsExperimental": false}
- NEXT_PUBLIC_EXPERIMENTS_ENABLED: Boolean master switch for experiments in config. Defaults to false.

Note: The health page reads from getPublicConfig() to present the effective values and feature flags.

## Feature Flags

Feature flags are provided via NEXT_PUBLIC_FEATURE_FLAGS as a JSON string. The helper isFeatureEnabled(flagName, defaultValue) reads from:
1) The FEATURE_FLAGS object in public config (parsed from the JSON string).
2) If not found or not set, falls back to defaultValue passed into the helper.

Common flags used in the UI:
- mapsTrafficWidget: Toggles the traffic widget (and ability to embed a map).
- musicConnect: Toggles the “Connect music provider” card and flows.
- analyticsExperimental: Toggles the “Experimental” badge in AnalyticsSummary and can gate any in-progress analytics UI.

Examples:
- Disable the maps widget but keep music connect stub:
  NEXT_PUBLIC_FEATURE_FLAGS='{"mapsTrafficWidget": false, "musicConnect": true}'
- Local-only mode (no backend, no music connect, analytics disabled):
  NEXT_PUBLIC_FEATURE_FLAGS='{"mapsTrafficWidget": true, "musicConnect": false}'
  NEXT_PUBLIC_BACKEND_URL=""
  NEXT_PUBLIC_NEXT_TELEMETRY_DISABLED="true"

## Local-only Mode

Local-only mode is designed for quick demos without any backend:
- Leave NEXT_PUBLIC_BACKEND_URL empty.
- Keep NEXT_PUBLIC_FEATURE_FLAGS such that musicConnect is false to avoid hitting auth endpoints.
- The analytics client logs to console only and does not POST anywhere.
- The traffic widget uses mocked data and an optional non-authenticated maps embed.

This mode lets you run the entire UI locally with no external services.

## Optional Backend Endpoints

If you enable musicConnect, the frontend redirects to:
- Spotify: {BACKEND_URL}/auth/spotify/start?redirect_uri={FRONTEND_URL}/preferences
- Apple Music: {BACKEND_URL}/auth/apple/start?redirect_uri={FRONTEND_URL}/preferences

If you want analytics to be captured in production, provide:
- POST {BACKEND_URL}/analytics — Accepts JSON payloads from the client analytics module.

These endpoints are not implemented in this repository. You can add them in a separate backend service and set NEXT_PUBLIC_BACKEND_URL to point to it.

## Troubleshooting

- The /health page shows your effective configuration and feature flags. Use it to verify env values are being read as expected.
- If analytics show in the console and not sent to a backend, confirm:
  - You are not in development (NODE_ENV=production)
  - NEXT_PUBLIC_BACKEND_URL is a valid URL
  - Your backend is reachable and accepts POST /analytics
- If maps embed does not appear, ensure mapsTrafficWidget is set to true and that your environment allows iframes from maps.google.com.

## Scripts
- dev — Starts the Next.js development server
- build — Builds the application
- start — Starts the Next.js production server
- lint — Runs Next.js ESLint

## Project Structure (high-level)
- src/app — App Router pages (/, /dashboard, /history, /preferences, /health)
- src/components — UI components (MoodCheckinCard, RecommendationsPanel, TrafficWidget, etc.)
- src/lib — Configuration, analytics, storage, integrations (spotify, appleMusic, maps), and stores
- public — Static assets (if added)
- out — Static export artifacts (prebuilt in this repo)

## License
This project is provided as-is for demonstration and internal development purposes. Add your license details here if distributing.
