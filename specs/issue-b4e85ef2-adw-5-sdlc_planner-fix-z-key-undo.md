# Bug: Fix keyboard shortcut: "Z" should trigger Undo

## Metadata
issue_number: `b4e85ef2`
adw_id: `5`
issue_json: `{"number":5,"title":"Fix keyboard shortcut: \"Z\" should trigger Undo","body":"The Z key is expected to perform Undo (same behavior as the Undo button), but currently pressing Z does nothing (or is inconsistent). Implement/repair the keyboard shortcut so Z reliably triggers the Undo action.\n\nThis should use the same underlying Undo logic as the button (single-step undo: revert only the last valid move).\n\nAcceptance Criteria:\n\nPressing Z triggers Undo exactly as if the user clicked the Undo button.\n\nWorks when the game view is focused (no special focus requirements beyond normal gameplay).\n\nDoes not interfere with arrow keys / WASD (if those are supported).\n\nIf Undo is not available (no previous move), pressing Z does nothing (or shows the same disabled behavior as the button).\n\nWorks on common browsers (Chrome/Edge/Firefox) and on desktop keyboards."}`

## Bug Description
The game's instructions text says "Press Z to undo", and users expect pressing the plain `Z` key to trigger undo (same as clicking the Undo button). However, the current keyboard handler in `src/components/Game.tsx` only triggers undo when `Ctrl+Z` or `Cmd+Z` is pressed — it requires `e.ctrlKey || e.metaKey` in addition to `e.key === 'z'`. Pressing plain `Z` without a modifier key does nothing. This contradicts the in-game instructions and the expected behavior described in the issue.

**Expected behavior:** Pressing the `Z` key (without any modifier) triggers undo, reverting the last valid move — identical to clicking the Undo button.

**Actual behavior:** Pressing `Z` alone does nothing. Only `Ctrl+Z` / `Cmd+Z` triggers undo.

## Problem Statement
The `keydown` event handler for the `'z'` key in `src/components/Game.tsx` (lines 38–43) has a guard condition requiring `e.ctrlKey || e.metaKey`. This prevents the plain `Z` key from triggering the undo action. The condition must be removed so that pressing `Z` alone invokes `undo()`.

## Solution Statement
Remove the `if (e.ctrlKey || e.metaKey)` guard from the `'z'` case in the `handleKeyDown` switch statement in `src/components/Game.tsx`. The undo action should fire on any `'z'` keypress (plain or with modifier). This is a single-line change that aligns the keyboard shortcut behavior with the Undo button and the in-game instructions.

## Steps to Reproduce
1. Open the 2048 game in a browser at `http://localhost:5173`.
2. Make at least one move using arrow keys (e.g., press ArrowRight).
3. Observe that the Undo button becomes enabled.
4. Press the `Z` key (without Ctrl/Cmd).
5. **Actual result:** Nothing happens — the board does not revert.
6. Press `Ctrl+Z` (or `Cmd+Z` on macOS).
7. **Actual result:** The board reverts (undo works with modifier).

## Root Cause Analysis
In `src/components/Game.tsx` line 39, the `'z'` case contains `if (e.ctrlKey || e.metaKey)` which gates the undo call behind a modifier key requirement. This was likely added to mirror standard OS undo shortcuts (Ctrl+Z), but the game's instructions and the issue's acceptance criteria specify that plain `Z` should trigger undo. The Undo button handler at line 70 calls `undo(prev)` directly without any such guard, so the keyboard shortcut is inconsistent with the button behavior.

## Relevant Files
Use these files to fix the bug:

- `src/components/Game.tsx` — Contains the `handleKeyDown` event handler with the broken `'z'` key case (lines 38–43). This is the only file that needs modification to fix the bug.
- `src/game/logic.ts` — Contains the `undo()` function. No changes needed, but referenced for understanding the undo logic (already correctly handles the "no previous state" case by returning the current state unchanged).
- `.claude/commands/test_e2e.md` — Reference for how to create and run an E2E test file.
- `.claude/commands/e2e/test_single_step_undo.md` — Existing E2E test for single-step undo via button; reference for writing the new Z-key E2E test.

### New Files
- `.claude/commands/e2e/test_z_key_undo.md` — New E2E test file to validate that pressing `Z` triggers undo correctly.

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Fix the Z key handler in Game.tsx
- Open `src/components/Game.tsx`.
- Locate the `'z'` case in the `handleKeyDown` switch statement (lines 38–43).
- Remove the `if (e.ctrlKey || e.metaKey)` guard so that `undo()` is called on any `'z'` keypress.
- Keep the `e.preventDefault()` call to prevent browser default behavior.
- The resulting code should be:
  ```typescript
  case 'z':
    e.preventDefault()
    setGameState(prev => undo(prev))
    break
  ```

### Step 2: Create E2E test file for Z key undo
- Read `.claude/commands/e2e/test_single_step_undo.md` and `.claude/commands/test_e2e.md` to understand the E2E test format.
- Create a new E2E test file at `.claude/commands/e2e/test_z_key_undo.md` that validates:
  1. The game loads and the board is visible.
  2. After making a move (ArrowRight), the Undo button becomes enabled.
  3. Pressing the `Z` key (plain, no modifier) triggers undo — the board reverts to the pre-move state and the score reverts.
  4. After undo via Z, the Undo button is disabled (single-step undo).
  5. Pressing `Z` again without making a new move does nothing (board and score unchanged).
  6. Making another move and pressing `Z` again successfully undoes only the last move.
- Include screenshots at each verification step.
- Follow the same format as existing E2E test files.

### Step 3: Run validation commands
- Run `cd /home/luciano/project && npx vitest run` to execute unit tests with zero regressions.
- Run `cd /home/luciano/project && npx tsc --noEmit` to validate TypeScript compilation.
- Run `cd /home/luciano/project && npx vite build` to validate the production build.
- Read `.claude/commands/test_e2e.md`, then read and execute the new E2E test `.claude/commands/e2e/test_z_key_undo.md` to validate the Z key undo functionality works.

## Validation Commands
Execute every command to validate the bug is fixed with zero regressions.

- `cd /home/luciano/project && npx vitest run` — Run unit tests to validate no regressions.
- `cd /home/luciano/project && npx tsc --noEmit` — Run TypeScript type checking to validate no type errors.
- `cd /home/luciano/project && npx vite build` — Run production build to validate no build errors.
- Read `.claude/commands/test_e2e.md`, then read and execute the new E2E `.claude/commands/e2e/test_z_key_undo.md` test file to validate the Z key undo functionality works.

## Notes
- This is a minimal one-line fix: removing the modifier key guard from the `'z'` case.
- The `undo()` function in `src/game/logic.ts` already handles the "no previous state" case gracefully (returns current state unchanged), so no additional guard is needed in the keyboard handler.
- The fix does not interfere with arrow keys, `r` (restart), or any other keyboard shortcuts since `'z'` is its own case in the switch statement.
- No new libraries are needed.
