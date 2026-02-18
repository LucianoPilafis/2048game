# E2E Test: Single-Step Undo Behavior

## User Story
As a player, I want the Undo button to revert exactly one move (the most recent valid move), so that pressing Undo again without making a new move does nothing, preventing me from rewinding the entire game.

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

### Step 3: Click Undo and verify it reverts the move
- Record the current board state and score before undo
- Click the Undo button
- Wait for the board to update
- **Verify** the board has reverted to the state before the move (Step 2's recorded state)
- **Verify** the score has reverted to the value before the move
- **Verify** the Undo button is now disabled again
- **Screenshot**: Capture the board after undo showing it reverted and the Undo button is disabled

### Step 4: Click Undo again without making a new move — verify nothing happens
- Record the current board state and score
- Click the Undo button (it should be disabled, but attempt to click it anyway)
- **Verify** the board state has NOT changed
- **Verify** the score has NOT changed
- **Verify** the Undo button remains disabled
- **Screenshot**: Capture the board confirming no change after second Undo attempt

### Step 5: Make a new move, then Undo — verify single-step undo works again
- Record the current board state and score
- Press the ArrowDown key to make a new move
- Wait for the board to update
- **Verify** the board has changed
- Record the pre-move state for comparison
- Click the Undo button
- **Verify** the board has reverted to the state before the ArrowDown move
- **Verify** the score has reverted correctly
- **Verify** the Undo button is now disabled again (single-step only)
- **Screenshot**: Capture the board after the second undo confirming single-step behavior

### Step 6: Make multiple moves, then verify Undo only reverts the last one
- Press ArrowLeft, wait for update
- Record the board state after first move
- Press ArrowUp, wait for update
- Record the board state after second move
- Press ArrowRight, wait for update
- **Verify** the Undo button is enabled
- Click the Undo button
- **Verify** the board matches the state recorded after the second move (ArrowUp), NOT the state after the first move (ArrowLeft)
- **Verify** the Undo button is now disabled (cannot undo further back)
- **Screenshot**: Capture the final state confirming undo only reverted the last move

## Success Criteria
- Undo restores exactly the previous game state (grid + score) from the last valid move
- Undo does not revert multiple moves in a row (single-step only) — after one undo, the button is disabled
- Pressing Undo when disabled does nothing (board and score remain unchanged)
- After making a new move, Undo becomes available again and reverts only that one move
- Score reverts correctly along with the board

## Output Format

```json
{
  "test_name": "Single-Step Undo Behavior",
  "status": "passed|failed",
  "screenshots": [
    "01_initial_game_state.png",
    "02_after_first_move.png",
    "03_after_first_undo.png",
    "04_second_undo_no_change.png",
    "05_second_undo_cycle.png",
    "06_multi_move_single_undo.png"
  ],
  "error": null
}
```
