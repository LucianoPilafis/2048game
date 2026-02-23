# Start Frontend Application

## Purpose
Start the frontend app for this repository (React + Vite).

## Variables
- `PORT`: `5173`
- `APP_URL`: `http://localhost:5173`

## Checks
1. Verify Node.js is installed.
2. Verify dependencies:
   - If `node_modules` is missing, run `npm install`.
3. `.env` is optional for startup in this repo:
   - If missing, note it and continue unless runtime errors indicate required vars.

## Start Workflow
1. Check whether something is already listening on port `5173`.
2. If the running process is the Vite dev server for this repo:
   - Report app is already running at `http://localhost:5173`.
3. Otherwise:
   - Run `npm run dev`.
   - Report URL: `http://localhost:5173`.

## Error Handling
- If Node.js is missing:
  - `❌ Node.js is not installed. Install Node.js 18+ from https://nodejs.org`
- If dependency install fails:
  - Report command error and stop.
- If dev server fails:
  - Report startup error output and stop.

## Notes
- Do not assume backend/server startup steps for this command.
- Do not require browser auto-open unless explicitly requested.
- Keep commands cross-platform and concise.
