# Bug: Fix Undo behavior: revert only the immediately previous move (single-step undo)

## Metadata
issue_number: `3860fe4a`
adw_id: `3`
issue_json: `{"number":3,"title":"Fix Undo behavior: revert only the immediately previous move (single-step undo)","body":"The current Undo button can revert to an older/incorrect state (it behaves like it can jump back multiple moves or not strictly the last move). Update the game so Undo only reverts exactly one move: the most recent valid move.\n\nImplement a single-step undo mechanism: store the board + score (and any other required state) before applying a move, and on Undo restore that one snapshot. After Undo is used once, it should not keep undoing earlier moves unless a new move is made and a new \"previous state\" snapshot is stored.\n\nAcceptance Criteria:\n\nUndo restores exactly the previous game state (grid + score) from the last valid move.\n\nUndo does not revert multiple moves in a row (single-step only). If pressed again without making a new move, it does nothing (or stays disabled).\n\nA move that does not change the board must not overwrite the stored \"previous state\" (i.e., Undo should revert the last move that actually changed the grid).\n\nUndo also correctly reverts any side effects of the last move (e.g., spawned tile / merged tiles) by restoring the snapshot.\n\nBehavior is consistent on desktop and mobile."}`

## Bug Description
The Undo feature in the 2048 game currently maintains an unbounded history array that accumulates every previous game state. When the user presses the Undo button (or Ctrl+Z), it pops the most recent entry from the history stack and restores it — but because the remaining history entries are preserved, pressing Undo again (without making a new move) will keep reverting further back through the game history. This allows the player to effectively rewind the entire game to its initial state, which is not the intended behavior.

**Expected behavior:** Undo reverts exactly one move (the most recent valid move). After undoing once, pressing Undo again without making a new move does nothing (or the button stays disabled).

**Actual behavior:** Undo can be pressed repeatedly to revert multiple moves in a row, effectively unwinding the entire game.

## Problem Statement
The `GameState` interface uses an unbounded `history: Array<{ board: number[][]; score: number }>` that grows with every move. The `undo()` function pops the last entry and keeps the rest, enabling repeated undo. The state model needs to be changed from a multi-entry history stack to a single-snapshot "previous state" that is cleared after use.

## Solution Statement
Replace the `history` array in `GameState` with a single `previousState: { board: number[][]; score: number } | null` field. On each valid move, store the current state as `previousState` before applying the move. On undo, restore `previousState` and set it to `null` (preventing further undos). The Undo button's disabled state should check `previousState === null` instead of `history.length === 0`. Invalid moves (moves that don't change the board) must not overwrite `previousState`.

## Steps to Reproduce
1. Open the 2048 game in a browser.
2. Make several moves (e.g., press arrow keys 5 times).
3. Click the Undo button — the last move is reverted (correct).
4. Click the Undo button again — a second move is reverted (bug: should do nothing).
5. Continue clicking Undo — the game keeps reverting further back through history (bug).

## Root Cause Analysis
In `src/game/logic.ts`:

1. **`GameState.history`** (line 11) is typed as `Array<{ board: number[][]; score: number }>` — an unbounded array.
2. **In `move()` function** (lines 78-81): Before every valid move, the current state is pushed onto the `history` array via `[...state.history, { board: ..., score: ... }]`. This means history accumulates every previous state across all moves.
3. **In `undo()` function** (lines 198-211): It restores the last entry from history (`state.history[state.history.length - 1]`) and sets `history: state.history.slice(0, -1)` — meaning the remaining history entries are preserved. So pressing Undo again pops the next entry, undoing yet another move.
4. **Net effect**: The combination of an unbounded history array and an `undo()` that merely pops one entry while preserving the rest means repeated undo calls keep reverting further back.

The fix is straightforward: change `history` from an array to a single nullable snapshot (`previousState`), and clear it after undo is used.

## Relevant Files
Use these files to fix the bug:

- `src/game/logic.ts` — Contains `GameState` interface, `move()`, `undo()`, and `initializeGame()` functions. This is the core file where the history model and undo logic need to be changed from an array to a single snapshot.
- `src/components/Game.tsx` — Contains the React component that renders the Undo button and checks `gameState.history.length === 0` for the disabled state. This reference needs to be updated to use the new `previousState` field.
- `.claude/commands/test_e2e.md` — Reference for understanding how to create an E2E test file.
- `.claude/commands/e2e/test_inline_theme_selector.md` — Reference example for E2E test file format and structure.

### New Files
- `.claude/commands/e2e/test_single_step_undo.md` — E2E test to validate the single-step undo behavior works correctly.

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

### 1. Update `GameState` interface in `src/game/logic.ts`
- Replace the `history: Array<{ board: number[][]; score: number }>` field with `previousState: { board: number[][]; score: number } | null`
- This changes the data model from an unbounded history stack to a single nullable snapshot

### 2. Update `initializeGame()` in `src/game/logic.ts`
- Change `history: []` to `previousState: null` in the returned initial state

### 3. Update `move()` in `src/game/logic.ts`
- Remove the `newHistory` array construction (lines 78-81)
- Instead, capture the current board and score as a single snapshot: `const snapshot = { board: state.board.map(row => [...row]), score: state.score }`
- When the move is invalid (board didn't change, `!moved`): do NOT overwrite `previousState` — keep `state.previousState` as-is and return early
- When the move is valid: set `previousState: snapshot` in the returned state
- Remove the `state.history = newHistory.slice(0, -1)` line from the invalid-move branch
- Ensure score mutation handling is clean (the current code mutates `state.score` which is a separate concern — preserve existing behavior)

### 4. Update `undo()` in `src/game/logic.ts`
- Change the guard from `state.history.length === 0` to `state.previousState === null`
- Restore the board and score from `state.previousState` instead of `state.history[state.history.length - 1]`
- Set `previousState: null` in the returned state (this is key: after one undo, no further undos are possible)
- Keep `gameOver: false` and `won: state.won` as-is

### 5. Update Undo button disabled check in `src/components/Game.tsx`
- Change `disabled={gameState.history.length === 0}` to `disabled={gameState.previousState === null}`

### 6. Create E2E test file for single-step undo validation
- Read `.claude/commands/e2e/test_inline_theme_selector.md` and `.claude/commands/test_e2e.md` to understand the E2E test format
- Create a new E2E test file at `.claude/commands/e2e/test_single_step_undo.md` that validates:
  - Make a move, click Undo — board reverts to previous state
  - Click Undo again without making a new move — nothing happens (button should be disabled)
  - Make a new move, click Undo — reverts that one move only
  - Verify score reverts correctly along with the board
  - Take screenshots at each key verification point

### 7. Run validation commands
- Execute all validation commands listed below to confirm the fix is correct and introduces zero regressions.

## Validation Commands
Execute every command to validate the bug is fixed with zero regressions.

- `cd /home/luciano/project && npx tsc --noEmit` — Run TypeScript type checking to ensure no type errors from the interface change
- `cd /home/luciano/project && npx vite build` — Run production build to validate no build errors
- Read `.claude/commands/test_e2e.md`, then read and execute the new E2E test `.claude/commands/e2e/test_single_step_undo.md` to validate the single-step undo behavior works correctly

## Notes
- The fix is minimal and surgical: only two files need code changes (`src/game/logic.ts` and `src/components/Game.tsx`).
- No new libraries are needed.
- The `move()` function currently mutates `state.score` directly (line 93-94, 105-106) before knowing if the move is valid. The current code handles this by resetting `state.score = prevScore` on invalid moves (line 110). This existing pattern is preserved — we are not refactoring the score mutation, only changing the history/undo model.
- The `won` field behavior in `undo()` is preserved: after undo, `won` stays as-is (if the player already won, undoing doesn't un-win them).
- There are no existing unit tests in the project (no `*.test.ts` files found), so the E2E test is the primary validation mechanism.
