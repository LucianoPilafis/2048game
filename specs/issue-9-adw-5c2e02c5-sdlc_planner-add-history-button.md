# Feature: Add "History" button to view past game runs

## Metadata
issue_number: `9`
adw_id: `5c2e02c5`
issue_json: `{"number":9,"title":"Add \"History\" button to view past game runs","body":"Add a new History button that lets the user view a list of their previous game runs (sessions). The user should be able to open the history view, see each past run with basic information, and close the view to return to the current game.\n\nAcceptance Criteria:\n\nA visible History button is available from the main game screen.\n\nClicking/tapping History opens a history view (overlay/panel/page) without breaking the current game state.\n\nThe history view lists past runs in reverse chronological order (most recent first).\n\nEach run entry shows at minimum:\n\nDate/time of the run (or \"time ago\")\n\nFinal score\n\nHighest tile reached\n\nRun duration (if available), otherwise omit\n\nThe user can close the history view and return to the game.\n\nIf there is no history yet, show an empty state message (e.g., \"No runs yet\").\n\nHistory persists across page refreshes (the user shouldn't lose it on reload)."}`

## Feature Description
Add a "History" button to the 2048 game's main screen that opens an overlay panel showing a list of all previous game runs (sessions). Each entry displays the date/time, final score, highest tile reached, and run duration (when available). The history is stored in `localStorage` so it persists across page refreshes. A game run is recorded when the game ends (game over) or when the user starts a new game (replacing a game that had moves). The overlay can be closed to return to the current game without interrupting gameplay.

## User Story
As a 2048 player
I want to view a list of my past game runs with their scores and details
So that I can track my progress and see how I've improved over time

## Problem Statement
Currently, when a game ends or the player starts a new game, all information about the previous session is lost. There is no way to review past performance, compare scores, or track progress over time. Players who want to improve have no historical data to reference.

## Solution Statement
Implement a history tracking system that:
1. Automatically saves game run data (score, highest tile, timestamps) to `localStorage` when a game ends or is replaced by a new game.
2. Provides a "History" button in the game header controls that opens a styled overlay panel.
3. Displays past runs in reverse chronological order with date/time (as relative "time ago"), final score, and highest tile.
4. Shows an empty state message when no history exists yet.
5. Allows the user to close the overlay and return to their current game without any state disruption.

## Relevant Files
Use these files to implement the feature:

- **`src/game/logic.ts`** — Contains `GameState` interface and game logic functions (`initializeGame`, `move`, `undo`). Will need a helper to extract the highest tile from a board, and the `GameState` interface may need a `startedAt` timestamp for duration tracking.
- **`src/components/Game.tsx`** — Main game component with header controls (New Game, Undo buttons). The History button will be added here, along with state management for the history overlay visibility and the logic to save runs when a new game starts or game ends.
- **`src/components/Game.css`** — Styles for the game container, header, controls, and board. Will need styles for the History button (matching existing button styles) and the history overlay panel.
- **`src/App.tsx`** — App root component. No changes expected but useful for understanding the component hierarchy.
- **`src/App.css`** — App-level styles. No changes expected but useful for understanding viewport constraints.
- **`src/index.css`** — Base styles. No changes expected.
- **`src/themes/ThemeContext.tsx`** — Theme context for palette awareness. The history overlay should respect the current theme for its background color.
- **`src/themes/palettes.ts`** — Palette definitions. Useful for understanding available theme colors.
- **`.claude/commands/test_e2e.md`** — Read to understand the E2E test execution framework.
- **`.claude/commands/e2e/test_z_key_undo.md`** — Read as a reference for creating a new E2E test file (pattern, structure, output format).

### New Files
- **`src/game/history.ts`** — New module containing the `GameRun` interface, `localStorage` persistence functions (`loadHistory`, `saveHistory`, `addRun`), and the `getHighestTile` helper.
- **`src/components/HistoryOverlay.tsx`** — New React component for the history overlay panel.
- **`src/components/HistoryOverlay.css`** — Styles for the history overlay panel.
- **`.claude/commands/e2e/test_history_button.md`** — New E2E test file to validate the History feature end-to-end.

## Implementation Plan
### Phase 1: Foundation
Create the data model and persistence layer for game history. Define the `GameRun` interface with fields for timestamp, final score, highest tile, and optional duration. Implement `localStorage` read/write functions in a dedicated `src/game/history.ts` module. Add a `getHighestTile(board)` helper to extract the max tile value from a board.

### Phase 2: Core Implementation
Build the History overlay UI component (`HistoryOverlay.tsx`) that receives a list of runs and renders them in reverse chronological order. Implement the "time ago" formatting (e.g., "2 minutes ago", "3 days ago") without external libraries. Style the overlay as a fixed panel that covers the game area with a semi-transparent backdrop. Add the "History" button to the game header controls in `Game.tsx`. Wire up the overlay open/close state.

### Phase 3: Integration
Integrate history recording into the game lifecycle in `Game.tsx`:
- When the user clicks "New Game" (or presses R), if the current game has had at least one move, save it as a completed run before resetting.
- When the game reaches "Game Over", automatically save the run.
- Track the game start time using a `useRef` to calculate duration.
- Load history from `localStorage` on component mount.
- Ensure the overlay doesn't interfere with keyboard controls (disable game key handlers when overlay is open).

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Create the E2E test file for the History feature
- Read `.claude/commands/test_e2e.md` and `.claude/commands/e2e/test_z_key_undo.md` to understand the E2E test file structure
- Create `.claude/commands/e2e/test_history_button.md` with test steps that validate:
  - The History button is visible on the main game screen
  - Clicking History opens an overlay without breaking the game
  - When no history exists, an empty state message ("No runs yet") is shown
  - After completing a game cycle (playing moves, starting a new game), the history overlay shows the previous run with score, highest tile, and time info
  - Closing the overlay returns to the game with the current state intact
  - History persists after a page refresh

### Step 2: Create the history data model and persistence layer (`src/game/history.ts`)
- Define the `GameRun` interface:
  ```typescript
  interface GameRun {
    id: string            // unique ID (timestamp-based)
    timestamp: number     // Date.now() when run ended
    finalScore: number
    highestTile: number
    durationMs: number | null  // milliseconds, null if unavailable
  }
  ```
- Implement `getHighestTile(board: number[][]): number` — iterate over the board and return the maximum value
- Implement `loadHistory(): GameRun[]` — read from `localStorage` key `"2048-history"`, parse JSON, return array (or empty array if missing/corrupt)
- Implement `saveHistory(runs: GameRun[]): void` — serialize and write to `localStorage` key `"2048-history"`
- Implement `addRun(run: GameRun): GameRun[]` — load existing history, prepend the new run, save, and return the updated list
- Implement `formatTimeAgo(timestamp: number): string` — format a timestamp as relative time (e.g., "just now", "5 minutes ago", "2 hours ago", "3 days ago")
- Export all public functions and the `GameRun` interface

### Step 3: Create the HistoryOverlay component (`src/components/HistoryOverlay.tsx` and `src/components/HistoryOverlay.css`)
- Create `HistoryOverlay.tsx`:
  - Props: `runs: GameRun[]`, `onClose: () => void`
  - Render a fixed overlay backdrop (click to close) with a centered panel
  - Show a header with "History" title and a close button (X)
  - If `runs.length === 0`, show an empty state message: "No runs yet"
  - Otherwise, render a scrollable list of runs in order (already reverse chronological from `addRun` prepending):
    - Each entry shows: time ago (from `formatTimeAgo`), final score, highest tile value
    - If `durationMs` is not null, show formatted duration (e.g., "2m 30s")
  - Use a `data-testid="history-overlay"` on the overlay container for testability
- Create `HistoryOverlay.css`:
  - Style the backdrop as a fixed full-screen overlay with semi-transparent dark background
  - Style the panel as a centered card (max-width ~400px, max-height ~70vh, scrollable) with white/light background, rounded corners, padding
  - Style individual run entries as cards/rows with clear visual separation
  - Style the empty state message centered and with muted text
  - Ensure the overlay has a high z-index (above the game board but below the win/game-over messages at z-index 1000) — use z-index 900
  - Use the same font colors and styling conventions as existing components (#776e65 text, #8f7a66 accents, #f9f6f2 light text)

### Step 4: Integrate history into the Game component (`src/components/Game.tsx`)
- Import `GameRun`, `loadHistory`, `addRun`, `getHighestTile` from `../game/history`
- Import `HistoryOverlay` component
- Add state:
  - `const [historyRuns, setHistoryRuns] = useState<GameRun[]>([])` — list of past runs
  - `const [showHistory, setShowHistory] = useState(false)` — overlay visibility toggle
  - `const gameStartRef = useRef<number>(Date.now())` — track when current game started
- On mount (`useEffect` with `[]` deps), load history from localStorage: `setHistoryRuns(loadHistory())`
- Create a `saveCurrentRun` helper function that:
  - Checks if the current game has had at least one move (e.g., `gameState.previousState !== null` or score > 0)
  - Creates a `GameRun` with: `id: String(Date.now())`, `timestamp: Date.now()`, `finalScore: gameState.score`, `highestTile: getHighestTile(gameState.board)`, `durationMs: Date.now() - gameStartRef.current`
  - Calls `addRun(run)` and updates `setHistoryRuns` with the result
- Modify the "New Game" button handler and the `r` key handler:
  - Before calling `setGameState(initializeGame())`, call `saveCurrentRun()`
  - After resetting, update `gameStartRef.current = Date.now()`
- When `gameState.gameOver` transitions to true, save the run automatically (use a `useEffect` watching `gameState.gameOver`)
- Add a "History" button in the `.controls` div, after the Undo button:
  ```tsx
  <button onClick={() => setShowHistory(true)} className="btn-history">
    History
  </button>
  ```
- Render the HistoryOverlay conditionally:
  ```tsx
  {showHistory && (
    <HistoryOverlay runs={historyRuns} onClose={() => setShowHistory(false)} />
  )}
  ```
- When `showHistory` is true, skip game keyboard event handling (early return in the keydown handler if `showHistory` is true), except allow Escape to close the overlay

### Step 5: Add History button styles to `src/components/Game.css`
- Add `.btn-history` class that matches the existing `.btn-reset` and `.btn-undo` button styles:
  ```css
  .btn-history {
    padding: 10px 20px;
    background: #8f7a66;
    color: #f9f6f2;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    transition: background 0.2s;
  }

  .btn-history:hover {
    background: #9f8a76;
  }
  ```
  Alternatively, extend the existing `.btn-reset, .btn-undo` selectors to also include `.btn-history` for DRY styling.

### Step 6: Run validation commands
- Run all validation commands listed below to confirm the feature works correctly with zero regressions

## Testing Strategy
### Unit Tests
- `getHighestTile` returns the maximum tile value from a board
- `loadHistory` returns an empty array when localStorage is empty or has invalid data
- `saveHistory` correctly serializes and stores run data
- `addRun` prepends a new run to existing history and persists it
- `formatTimeAgo` returns correct relative time strings for various time deltas (seconds, minutes, hours, days, months)

### Edge Cases
- No history exists yet (empty state message shown)
- localStorage is unavailable or quota exceeded (graceful degradation — history just won't persist)
- localStorage contains corrupted data (reset to empty array)
- Very long history list (scrollable panel handles many entries)
- Game with zero moves (should NOT be saved to history — don't record empty/unused games)
- Multiple rapid "New Game" clicks (should not create duplicate entries)
- Game over auto-save followed by "New Game" should not double-save the same run
- Duration of 0 seconds (game just started and immediately reset — handle gracefully, omit or show "< 1s")
- Very high scores or tile values display correctly without layout breakage

## Acceptance Criteria
- A visible "History" button is available from the main game screen in the controls section
- Clicking/tapping History opens a history overlay without breaking the current game state
- The history view lists past runs in reverse chronological order (most recent first)
- Each run entry shows: date/time as "time ago", final score, highest tile reached, and duration (if available)
- The user can close the history view (click X, click backdrop, or press Escape) and return to the game
- If there is no history yet, the overlay shows an empty state message ("No runs yet")
- History persists across page refreshes (stored in localStorage)
- Game keyboard controls are disabled while the history overlay is open
- A game run is saved when: the user starts a new game (if the current game had moves), or the game reaches "Game Over"
- Games with zero moves are not saved to history

## Validation Commands
Execute every command to validate the feature works correctly with zero regressions.

- Read `.claude/commands/test_e2e.md`, then read and execute `.claude/commands/e2e/test_history_button.md` to validate the History feature works end-to-end
- `cd /home/luciano/project && npx tsc --noEmit` - TypeScript type check to confirm no type errors introduced
- `cd /home/luciano/project && npm run build` - Build to confirm no compilation errors

## Notes
- No external libraries are needed — `Date.now()` and manual relative time formatting are sufficient.
- The `localStorage` key `"2048-history"` is chosen to be specific and avoid conflicts.
- The overlay uses `position: fixed` and `z-index: 900` to appear above the game board but below the existing win/game-over messages (z-index 1000).
- The `GameRun.id` field uses `String(Date.now())` for simplicity. This is sufficient for a single-player local game.
- The `gameStartRef` is a `useRef` rather than state to avoid unnecessary re-renders when tracking start time.
- Future enhancements could include: clearing history, sorting by score/tile, exporting history, and statistics/charts. These are out of scope for this issue.
- Care must be taken to avoid double-saving when a game over triggers a save and then the user immediately clicks "New Game" — the implementation should track whether the current game has already been saved.
