# E2E Test: Viewport Layout — No Vertical Scrolling

## User Story
As a player, I want the entire game UI (title, score, controls, theme selector, board, and instructions) to fit within the visible viewport on common screen sizes without requiring vertical scrolling, so that I can see and interact with all elements without having to scroll.

## Test Steps

### Step 1: Navigate to the application at desktop viewport (1280x720)
- Set the browser viewport to 1280x720
- Open the application URL in the browser
- Wait for the page to fully load
- **Verify** the game board is visible
- **Verify** the document's scrollHeight is less than or equal to the window's innerHeight (no vertical scrolling required)
- **Verify** the title (h1), game board (.board), controls (.controls), theme selector (.palette-selector), and instructions (.instructions) are all visible within the viewport
- **Screenshot**: Capture the full page at 1280x720 desktop viewport

### Step 2: Verify layout at smaller desktop viewport (1024x768)
- Set the browser viewport to 1024x768
- Wait for layout to adjust
- **Verify** the document's scrollHeight is less than or equal to the window's innerHeight (no vertical scrolling required)
- **Verify** the title (h1), game board (.board), controls (.controls), theme selector (.palette-selector), and instructions (.instructions) are all visible within the viewport
- **Screenshot**: Capture the full page at 1024x768 viewport

### Step 3: Verify layout at mobile viewport (375x667, iPhone SE)
- Set the browser viewport to 375x667
- Wait for layout to adjust
- **Verify** the document's scrollHeight is less than or equal to the window's innerHeight (no vertical scrolling required)
- **Verify** the title (h1), game board (.board), controls (.controls), theme selector (.palette-selector), and instructions (.instructions) are all visible within the viewport
- **Screenshot**: Capture the full page at 375x667 mobile viewport

### Step 4: Verify layout at short landscape viewport (800x600)
- Set the browser viewport to 800x600
- Wait for layout to adjust
- **Verify** the document's scrollHeight is less than or equal to the window's innerHeight (no vertical scrolling required)
- **Verify** the game board (.board) and controls (.controls) are visible within the viewport
- **Screenshot**: Capture the full page at 800x600 landscape viewport

### Step 5: Verify no elements are cut off at the bottom
- Set the browser viewport to 1280x720
- **Verify** the instructions element (.instructions) is visible and its bottom edge is within the viewport (bounding rect bottom <= window innerHeight)
- **Verify** the board element (.board) is fully visible (bounding rect bottom <= window innerHeight)
- **Screenshot**: Capture the full page showing all elements are visible without cutoff

## Success Criteria
- At 1280x720 desktop viewport, the entire game UI fits without vertical scrolling
- At 1024x768 desktop viewport, the entire game UI fits without vertical scrolling
- At 375x667 mobile viewport (iPhone SE), the entire game UI fits without vertical scrolling
- At 800x600 landscape viewport, the game board and controls fit without vertical scrolling
- The board, controls, title, theme selector, and instructions are all visible at each viewport size
- No elements are cut off at the bottom of the viewport

## Output Format

```json
{
  "test_name": "Viewport Layout — No Vertical Scrolling",
  "status": "passed|failed",
  "screenshots": [
    "01_desktop_1280x720.png",
    "02_desktop_1024x768.png",
    "03_mobile_375x667.png",
    "04_landscape_800x600.png",
    "05_no_cutoff_verification.png"
  ],
  "error": null
}
```
