# E2E Test: Z Key Undo

## User Story
As a player, I want to press the Z key (without any modifier) to undo my last move, so that I can quickly correct mistakes using only the keyboard without needing to click the Undo button.

## Test Steps

### Step 1: Navigate to the application
- Open the application URL in the browser
- Wait for the page to fully load
- **Verify** the game board is visible
- **Verify** the Undo button exists and is disabled (no previous move to undo)
- **Screenshot**: Capture the initial game state showing the disabled Undo button

### Step 2: Make a move and verify Undo becomes enabled
- Record the current board state and score
- Press the ArrowRight key to make a move
- Wait for the board to update
- **Verify** the board has changed from the initial state
- **Verify** the Undo button is now enabled (not disabled)
- **Screenshot**: Capture the board after the first move showing the enabled Undo button

### Step 3: Press Z key and verify it reverts the move
- Record the current board state and score before undo
- Press the `Z` key (plain, no modifier key)
- Wait for the board to update
- **Verify** the board has reverted to the state before the move (Step 2's recorded state)
- **Verify** the score has reverted to the value before the move
- **Verify** the Undo button is now disabled again
- **Screenshot**: Capture the board after Z key undo showing it reverted and the Undo button is disabled

### Step 4: Press Z again without making a new move — verify nothing happens
- Record the current board state and score
- Press the `Z` key again (plain, no modifier key)
- **Verify** the board state has NOT changed
- **Verify** the score has NOT changed
- **Verify** the Undo button remains disabled
- **Screenshot**: Capture the board confirming no change after second Z key press

### Step 5: Make a new move, then press Z — verify single-step undo works again
- Record the current board state and score
- Press the ArrowDown key to make a new move
- Wait for the board to update
- **Verify** the board has changed
- **Verify** the Undo button is now enabled
- Press the `Z` key (plain, no modifier key)
- **Verify** the board has reverted to the state before the ArrowDown move
- **Verify** the score has reverted correctly
- **Verify** the Undo button is now disabled again (single-step only)
- **Screenshot**: Capture the board after the second Z key undo confirming single-step behavior

### Step 6: Make multiple moves, then verify Z key only reverts the last one
- Press ArrowLeft, wait for update
- Record the board state after first move
- Press ArrowUp, wait for update
- Record the board state after second move
- Press ArrowRight, wait for update
- **Verify** the Undo button is enabled
- Press the `Z` key (plain, no modifier key)
- **Verify** the board matches the state recorded after the second move (ArrowUp), NOT the state after the first move (ArrowLeft)
- **Verify** the Undo button is now disabled (cannot undo further back)
- **Screenshot**: Capture the final state confirming Z key undo only reverted the last move

## Success Criteria
- Pressing the plain Z key (without Ctrl/Cmd) triggers undo, reverting the last valid move
- Z key undo restores exactly the previous game state (grid + score)
- Z key undo does not revert multiple moves in a row (single-step only) — after one undo, the button is disabled
- Pressing Z when no undo is available does nothing (board and score remain unchanged)
- After making a new move, pressing Z again successfully undoes only that one move
- Score reverts correctly along with the board

## Output Format

```json
{
  "test_name": "Z Key Undo",
  "status": "passed|failed",
  "screenshots": [
    "01_initial_game_state.png",
    "02_after_first_move.png",
    "03_after_z_key_undo.png",
    "04_second_z_press_no_change.png",
    "05_second_undo_cycle.png",
    "06_multi_move_single_z_undo.png"
  ],
  "error": null
}
```
