# Install & Prime (This Repo)

## Purpose
Prepare this repository for local frontend development and optional ADW manual workflow usage.

## Read
- `./.env.sample` (never read `./.env`)
- `./adws/README.md`
- `./.claude/commands/prime.md` (if you are running ADW workflows)

## Prerequisites
- Node.js 18+
- npm
- Optional for ADW:
  - Python + `uv`
  - GitHub CLI (`gh`)
  - Claude Code CLI

## Install
1. Install frontend dependencies:
   - `npm install`
2. Optional ADW setup:
   - Follow environment/auth setup in `./adws/README.md`

## Run
- Frontend:
  - `npm run dev`
  - URL: `http://localhost:5173`
- Optional ADW examples:
  - `uv run adws/adw_plan_build.py <issue-number>`
  - `uv run adws/adw_sdlc.py <issue-number>`

## Report
Output a concise bullet list with:
- What was installed (frontend only or frontend + ADW prerequisites)
- Any missing optional ADW prerequisites (if ADW was requested)
- Frontend URL: `http://localhost:5173`

Do not include instructions for:
- `app/server` paths
- `scripts/start.sh`, `copy_dot_env.sh`, `reset_db.sh`
- Repository re-init commands (`git init`, `git remote remove origin`)
