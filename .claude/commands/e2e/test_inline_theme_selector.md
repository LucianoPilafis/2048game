# E2E Test: Inline Theme Selector Layout

## User Story
As a player, I want the theme options to be displayed in a clear, compact row so I can quickly choose a theme, so that the UI feels clean, uncluttered, and I can visually preview theme colors before selecting.

## Test Steps

### Step 1: Navigate to the application
- Open the application URL in the browser
- Wait for the page to fully load
- **Verify** the game board is visible

### Step 2: Verify theme selector is visible between header and board
- **Verify** an element with class `palette-selector` is visible on the page
- **Verify** the `palette-selector` element appears after the `game-header` element and before the `board` element in the DOM order
- **Screenshot**: Capture the full page showing the theme selector position

### Step 3: Verify all theme options are displayed inline with color dots
- **Verify** there are exactly 4 elements with class `palette-option` inside the `palette-selector`
- **Verify** each `palette-option` contains a `palette-dot` element (colored circle)
- **Verify** each `palette-option` contains a `palette-name` element with text
- **Verify** the theme names displayed are: "Default", "Ocean", "Forest", "Sunset"
- **Verify** the options are displayed inline (horizontally, not stacked vertically)
- **Screenshot**: Capture a close-up of the theme selector showing all options with color dots

### Step 4: Verify Default theme is initially selected
- **Verify** the "Default" palette-option button has the `active` class
- **Verify** no other palette-option buttons have the `active` class

### Step 5: Click the Ocean theme and verify activation
- Click the button containing the text "Ocean"
- Wait for the theme to apply
- **Verify** the "Ocean" palette-option now has the `active` class
- **Verify** the "Default" palette-option no longer has the `active` class
- **Verify** the board background color has changed (should be `#1e3a5f` or the Ocean palette background)
- **Screenshot**: Capture the page with the Ocean theme applied

### Step 6: Click the Forest theme and verify activation
- Click the button containing the text "Forest"
- Wait for the theme to apply
- **Verify** the "Forest" palette-option now has the `active` class
- **Verify** the "Ocean" palette-option no longer has the `active` class
- **Verify** the board background color has changed (should be `#1f3a1f` or the Forest palette background)
- **Screenshot**: Capture the page with the Forest theme applied

### Step 7: Click the Sunset theme and verify activation
- Click the button containing the text "Sunset"
- Wait for the theme to apply
- **Verify** the "Sunset" palette-option now has the `active` class
- **Screenshot**: Capture the page with the Sunset theme applied

## Success Criteria
- The theme selector renders as an inline horizontal row of clickable buttons (not a dropdown)
- Each theme option displays a colored dot and the theme name
- The theme selector is positioned between the game header and the board
- Clicking a theme option activates it (adds `active` class) and deactivates the previous selection
- The board background color changes to match the selected theme
- All 4 themes (Default, Ocean, Forest, Sunset) are present and functional

## Output Format

```json
{
  "test_name": "Inline Theme Selector Layout",
  "status": "passed|failed",
  "screenshots": [
    "01_full_page_theme_selector.png",
    "02_theme_selector_closeup.png",
    "03_ocean_theme_applied.png",
    "04_forest_theme_applied.png",
    "05_sunset_theme_applied.png"
  ],
  "error": null
}
```
