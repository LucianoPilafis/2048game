# Repository Patch Plan (Prioritized)

Date: 2026-02-19  
Scope: `src/` + `adws/` audit findings  
Goal: convert findings into executable, prioritized patches

## Priority Legend

- `P0` Critical: security/integrity/reliability risk, fix first
- `P1` High: functional bugs and broken developer workflow
- `P2` Medium: cleanup, maintainability, UX improvements

---

## P0 - Critical Fixes

### 1) Potential path traversal via `adw_id`
- Problem: externally influenced `adw_id` is used in filesystem paths without strict validation.
- Risk: writing outside intended `agents/{adw_id}` boundaries.
- Files:
  - `adws/adw_modules/state.py`
  - Optional hardening: any place using `adw_id` in paths
- Patch:
  - Enforce strict `adw_id` regex (e.g. `^[a-f0-9]{8}$` or an approved format).
  - Reject values containing `/`, `..`, whitespace, or non-approved chars.
  - Add central validator helper and use everywhere.
- Acceptance:
  - Invalid IDs fail fast with clear error.
  - Only valid IDs can create directories/files.

---

## P1 - High Priority Fixes

### 3) Test workflow claims commit success but never commits
- Problem: `adw_test.py` logs “committed” without calling `commit_changes`.
- Files:
  - `adws/adw_test.py`
- Patch:
  - After `create_commit(...)`, call `commit_changes(commit_msg)`.
  - Handle “no changes” return path and message accurately.
  - Keep issue comment text aligned with real outcome.
- Acceptance:
  - Real commit created when test-related changes exist.
  - “No changes to commit” is reported as such, not “committed”.

### 4) Spec path mismatch (`spec/` vs `specs/`)
- Problem: fallback lookup uses `spec/` but repository uses `specs/`.
- Files:
  - `adws/adw_modules/workflow_ops.py`
- Patch:
  - Replace `spec/` references with `specs/`.
  - Keep backward-compatible fallback by checking both paths if needed.
- Acceptance:
  - `find_spec_file()` finds existing spec files reliably.

### 5) React state mutation in game logic
- Problem: `move()` mutates `state.score` directly.
- Files:
  - `src/game/logic.ts`
- Patch:
  - Use local accumulator (`nextScore`) instead of mutating `state`.
  - Return a new immutable `GameState`.
  - Never return the same `state` object on attempted move.
- Acceptance:
  - No direct mutation of incoming `state`.
  - Gameplay/score unchanged functionally.

### 6) Undo `won` flag inconsistency
- Problem: undo can restore board before win but keep `won = true`.
- Files:
  - `src/game/logic.ts`
- Patch:
  - Include `won` in `previousState`, or recompute `won` from restored board.
- Acceptance:
  - Undo accurately reflects restored board win status.

### 7) Remote URL parser supports only HTTPS pattern
- Problem: `extract_repo_path()` fails for SSH remotes.
- Files:
  - `adws/adw_modules/github.py`
- Patch:
  - Support:
    - `https://github.com/owner/repo(.git)`
    - `git@github.com:owner/repo(.git)`
  - Validate extracted `owner/repo` format.
- Acceptance:
  - Works with both SSH and HTTPS remotes.

---

## P2 - Medium Priority Fixes

### 8) Remove tracked generated/cache artifacts
- Problem: `.pyc`, `__pycache__`, and test artifacts are tracked.
- Files:
  - tracked cache and artifact files under `adws/.../__pycache__/`, `.claude/...__pycache__/`, `test-results/.last-run.json`
- Patch:
  - Remove tracked generated files from git index.
  - Extend `.gitignore` with:
    - `__pycache__/`
    - `*.pyc`
    - `test-results/`
- Acceptance:
  - Fresh clone does not contain generated artifacts in version control.

### 9) Dead code cleanup
- Candidate symbols:
  - `adws/adw_modules/workflow_ops.py: ensure_plan_exists()`
  - `adws/adw_modules/workflow_ops.py: find_plan_for_issue()`
  - `adws/adw_modules/utils.py: get_logger()`
  - `adws/adw_modules/github.py: mark_issue_in_progress()`
  - `adws/adw_test.py: AGENT_BRANCH_GENERATOR`
  - `adws/adw_modules/data_types.py: ClaudeCodeResultMessage` (if truly unused)
  - `src/themes/ThemeContext.tsx: availablePalettes` (if never consumed)
- Patch:
  - Remove unused symbols or add explicit TODO markers if keeping for near-term use.
- Acceptance:
  - No unused imports/constants/functions reported by static checks.

### 10) Fix lint workflow
- Problem: `npm run lint` script exists but no ESLint config.
- Files:
  - project root (`eslint.config.*` or `.eslintrc.*`)
  - `package.json`
- Patch:
  - Add ESLint config compatible with TypeScript + React.
  - Ensure script runs cleanly.
- Acceptance:
  - `npm run lint` executes and reports meaningful results.

### 11) Add baseline tests (currently none)
- Problem: `vitest` exits with “No test files found”.
- Files:
  - `src/game/logic.test.ts`
  - optional component tests
- Patch:
  - Add core unit tests:
    - `move()` merge rules
    - score calculation
    - undo behavior
    - game-over detection
- Acceptance:
  - `npm test -- --run` passes with at least baseline coverage for game logic.

### 12) Keyboard UX hardening
- Problem: only lowercase `z/r` are recognized.
- Files:
  - `src/components/Game.tsx`
- Patch:
  - Normalize key handling to support uppercase and optionally Ctrl/Cmd+Z.
- Acceptance:
  - Undo/restart shortcuts work predictably across keyboard layouts/cases.

---

## Suggested Execution Order

1. `P0` input/state safety fixes (`adw_id` validation)
2. `P1` correctness fixes (`adw_test` commit bug, spec path mismatch, game state bugs)
3. `P1` interoperability (`extract_repo_path` SSH support)
4. `P2` hygiene (artifact cleanup + dead code)
5. `P2` developer quality (`lint` + tests)
6. `P2` UX improvements (keyboard handling)

---

## Batch Plan (If you want me to implement in phases)

- Batch A (`P0`): ID validation and state boundary hardening
- Batch B (`P1`): commit bug + path mismatch + game logic/undo
- Batch C (`P1/P2`): remote parsing + cleanup/dead code
- Batch D (`P2`): lint config + baseline tests + keyboard UX

---

## Scope Update

Legacy automation trigger support was removed from the repository.  
This plan now assumes manual workflow execution only.
