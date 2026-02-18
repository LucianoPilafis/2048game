# Bug: Fix Z Key Keyboard Shortcut for Undo

## Metadata
issue_number: `5`
adw_id: `b4e85ef2`
issue_json: `Fix keyboard shortcut: Z should trigger Undo`

## Bug Description
The Z key is expected to perform Undo (same behavior as the Undo button), but currently pressing Z alone does nothing. The keyboard handler in `Game.tsx` only triggers undo when `e.ctrlKey || e.metaKey` is also pressed (i.e., Ctrl+Z or Cmd+Z), not when plain `Z` is pressed. Ironically, the in-game instructions text already reads "Press Z to undo" — so the UI promises a shortcut that doesn't work.

**Expected behavior:** Pressing the `Z` key alone triggers undo exactly as if the user clicked the Undo button.

**Actual behavior:** Pressing `Z` alone does nothing. Only Ctrl+Z / Cmd+Z (with modifier key) triggers undo.

## Problem Statement
In `src/components/Game.tsx`, the `keydown` handler's `case 'z':` branch is guarded by a condition requiring `e.ctrlKey || e.metaKey`. This means plain `Z` is never handled — it falls through without triggering undo. The fix must make bare `Z` (without modifier) trigger undo, while also respecting the disabled state when no previous move is available.

## Solution Statement
Remove the `e.ctrlKey || e.metaKey` guard from the `case 'z':` branch in the `handleKeyDown` handler in `Game.tsx`. The undo logic (`undo()` from `game/logic.ts`) already handles the "no previous state" case gracefully by returning the current state unchanged — so no additional guard is needed for the disabled case. This is a one-line change.

## Steps to Reproduce
1. Open the application in a browser (http://localhost:5173)
2. Make at least one move using an arrow key
3. Press the `Z` key (without Ctrl or Cmd)
4. Observe: nothing happens — the board does not revert to the previous state
5. Press Ctrl+Z — observe: undo works correctly

## Root Cause Analysis
In `src/components/Game.tsx` lines 38-43:

```ts
case 'z':
  if (e.ctrlKey || e.metaKey) {
    e.preventDefault()
    setGameState(prev => undo(prev))
  }
  break
```

The undo is only executed when a modifier key (Ctrl or Meta/Cmd) is held. Plain `Z` enters the `case 'z':` branch but the inner `if` evaluates to `false`, so undo is never called. The instructions text on line 104 ("Press Z to undo, R to restart") confirms the intended behavior was always plain `Z`.

## Relevant Files

- **`src/components/Game.tsx`** — Contains the `handleKeyDown` function where the keyboard shortcut for `z` is defined. This is the only file that needs to change. The fix is removing the modifier-key guard.
- **`src/game/logic.ts`** — Contains the `undo()` function. No changes needed here; the function already handles `previousState === null` by returning state unchanged (safe no-op when undo is unavailable).

### New Files
- **`.claude/commands/e2e/test_z_key_undo.md`** — New E2E test file to validate the Z key shortcut triggers undo correctly.

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Fix the Z key handler in Game.tsx
- Open `src/components/Game.tsx`
- Locate the `case 'z':` block inside the `handleKeyDown` function (around lines 38-43)
- Remove the `if (e.ctrlKey || e.metaKey)` guard so plain `Z` triggers undo
- Keep `e.preventDefault()` to prevent any browser default behavior for `z`
- The fixed block should be:
  ```ts
  case 'z':
    e.preventDefault()
    setGameState(prev => undo(prev))
    break
  ```

### Step 2: Create E2E test file for Z key undo
- Read `.claude/commands/test_e2e.md` and `.claude/commands/e2e/test_single_step_undo.md` to understand how to create an E2E test file
- Create a new E2E test file at `.claude/commands/e2e/test_z_key_undo.md` that validates:
  - Pressing plain `Z` triggers undo (reverts board state and score)
  - Pressing `Z` when no undo is available does nothing (Undo button remains disabled, board unchanged)
  - Arrow keys still work normally after pressing `Z`
  - Include screenshots to prove the bug is fixed

### Step 3: Run Validation Commands
- Run all validation commands listed below to confirm the fix works with zero regressions

## Validation Commands
Execute every command to validate the bug is fixed with zero regressions.

- Read `.claude/commands/test_e2e.md`, then read and execute `.claude/commands/e2e/test_z_key_undo.md` to validate the Z key undo functionality works end-to-end
- `cd /home/luciano/project && bun tsc --noEmit` - TypeScript type check to confirm no type errors introduced
- `cd /home/luciano/project && bun run build` - Build to confirm no compilation errors

## Notes
- The `undo()` function in `logic.ts` is already safe to call unconditionally — it returns the current state unchanged when `previousState === null`, so there is no risk of error when pressing Z with no available undo.
- The instructions text at the bottom of the game ("Press Z to undo, R to restart") already documents the intended plain-Z behavior — the bug was purely in the keyboard handler condition.
- No changes needed to `logic.ts` or any other file — this is a single-line fix in `Game.tsx`.
- Ctrl+Z behavior: After the fix, plain `Z` handles undo. Ctrl+Z will also work because `e.key` is `'z'` regardless of modifiers. This is acceptable and consistent with common UX patterns.
