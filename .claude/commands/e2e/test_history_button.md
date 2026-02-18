# E2E Test: History Button

## User Story
As a 2048 player, I want to view a list of my past game runs with their scores and details, so that I can track my progress and see how I've improved over time.

## Test Steps

### Step 1: Navigate to the application and verify History button exists
- Open the application URL in the browser
- Wait for the page to fully load
- **Verify** the game board is visible
- **Verify** a "History" button is visible in the controls section alongside "New Game" and "Undo"
- **Screenshot**: Capture the initial game state showing the History button

### Step 2: Open History overlay with no past runs
- Click the "History" button
- Wait for the overlay to appear
- **Verify** an overlay/panel is displayed with `data-testid="history-overlay"`
- **Verify** the overlay shows the text "No runs yet" (empty state)
- **Verify** a close button (X) is visible on the overlay
- **Screenshot**: Capture the History overlay showing the empty state message

### Step 3: Close the overlay and verify game is intact
- Click the close button (X) on the overlay
- **Verify** the overlay is no longer visible
- **Verify** the game board is still visible and the game state is intact
- **Screenshot**: Capture the game after closing the overlay

### Step 4: Play moves and start a new game to create a history entry
- Record the current board state
- Press ArrowRight key to make a move
- Wait for the board to update
- Press ArrowDown key to make another move
- Wait for the board to update
- **Verify** the board has changed from the initial state (game has had moves)
- Record the current score
- Click the "New Game" button
- Wait for the board to reset
- **Verify** the board has been reset (a new game has started)
- **Screenshot**: Capture the new game state after reset

### Step 5: Open History and verify the previous run is listed
- Click the "History" button
- Wait for the overlay to appear
- **Verify** the overlay is displayed with `data-testid="history-overlay"`
- **Verify** the "No runs yet" message is NOT shown
- **Verify** at least one history entry is visible
- **Verify** the history entry displays a score value
- **Verify** the history entry displays a highest tile value
- **Verify** the history entry displays a time reference (e.g., "just now" or "ago")
- **Screenshot**: Capture the History overlay showing the previous run entry

### Step 6: Close overlay with Escape key and verify game keyboard controls resume
- Press the Escape key
- **Verify** the overlay is no longer visible
- Record the current board state
- Press ArrowLeft key to make a move
- Wait for the board to update
- **Verify** the board has changed (keyboard controls are working after closing overlay)
- **Screenshot**: Capture the game after closing overlay with Escape and making a move

### Step 7: Verify history persists after page refresh
- Reload the page
- Wait for the page to fully load
- **Verify** the game board is visible
- Click the "History" button
- Wait for the overlay to appear
- **Verify** at least one history entry is still visible (persisted across refresh)
- **Screenshot**: Capture the History overlay after page refresh showing persisted data

### Step 8: Close overlay by clicking backdrop
- Click on the semi-transparent backdrop area (outside the panel)
- **Verify** the overlay is no longer visible
- **Verify** the game board is still visible
- **Screenshot**: Capture the game after closing overlay via backdrop click

## Success Criteria
- A "History" button is visible on the main game screen in the controls section
- Clicking History opens an overlay without breaking the current game state
- When no history exists, the overlay shows "No runs yet"
- After completing a game cycle (play moves, start new game), the history shows the previous run
- Each history entry displays score, highest tile, and time information
- The overlay can be closed by: clicking X, pressing Escape, or clicking the backdrop
- Game keyboard controls are disabled while the overlay is open and resume after closing
- History data persists across page refreshes

## Output Format

```json
{
  "test_name": "History Button",
  "status": "passed|failed",
  "screenshots": [
    "01_initial_game_with_history_button.png",
    "02_history_overlay_empty_state.png",
    "03_game_after_closing_overlay.png",
    "04_new_game_after_moves.png",
    "05_history_overlay_with_entry.png",
    "06_game_after_escape_close.png",
    "07_history_after_page_refresh.png",
    "08_game_after_backdrop_close.png"
  ],
  "error": null
}
```
