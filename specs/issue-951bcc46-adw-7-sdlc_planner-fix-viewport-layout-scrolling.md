# Bug: Fix layout to fit viewport — remove vertical scrolling on main game screen

## Metadata
issue_number: `951bcc46`
adw_id: `7`
issue_json: `{"number":7,"title":"Fix layout to fit viewport: remove vertical scrolling on main game screen","body":"On some screen sizes, the game page renders \"too small\" or mis-sized and forces vertical scrolling to reach the bottom of the UI (controls/status). The main game screen should fit within the visible viewport so the user can see the board and all primary controls without scrolling.\n\nAcceptance Criteria:\n\nNo vertical scrolling is required to see and use the main controls and game board on common screen sizes (desktop and mobile).\n\nThe board and controls remain fully visible within the screen boundaries (no cut-off at the bottom).\n\nThe layout adapts cleanly to different aspect ratios (portrait/landscape) without shrinking the UI excessively.\n\nThe fix works consistently across modern browsers (Chrome/Edge/Firefox)."}`

## Bug Description
On some screen sizes (particularly shorter viewports, mobile devices, or landscape orientations), the game page forces vertical scrolling to see the full UI — the board, controls, score, theme selector, and instructions do not all fit within the visible viewport. The user must scroll down to reach the bottom controls or instructions text.

**Expected behavior:** The entire game UI (title, score, controls, theme selector, board, and instructions) fits within the visible viewport on common screen sizes without requiring vertical scrolling.

**Actual behavior:** The layout overflows the viewport vertically on shorter screens, forcing the user to scroll to see all elements.

## Problem Statement
The layout does not constrain itself to the viewport height. Multiple CSS issues compound to cause vertical overflow:

1. `.app` in `App.css` uses `min-height: 100vh` instead of `height: 100vh`, allowing content to grow beyond the viewport.
2. The `h1` title is `72px` with `30px` margin-bottom — consuming ~110px of vertical space.
3. `.game-container` uses `gap: 20px` and `padding: 20px` adding unconstrained spacing.
4. Tiles have hard `min-height: 70px` (50px on mobile) preventing the board from shrinking.
5. The `.board` uses `aspect-ratio: 1` with `width: 100%` up to 500px — meaning the board alone can be 500px tall, leaving insufficient room for other elements on shorter viewports.
6. No element uses `flex-shrink` or constrains the board size relative to available viewport height.

On a typical 768px-tall viewport: title (~110px) + header (~60px) + theme selector (~40px) + board (~460px with padding) + instructions (~40px) + container padding/gaps (~80px) ≈ 790px — already overflowing.

## Solution Statement
Convert the layout to a viewport-constrained flexbox column that distributes available space intelligently:

1. Change `.app` from `min-height: 100vh` to `height: 100vh` with `overflow: hidden` to hard-constrain to viewport.
2. Reduce the `h1` title font size and margin to reclaim vertical space.
3. Make `.game-container` fill available space with `flex: 1` and `min-height: 0` (flexbox shrink requirement) and `overflow: hidden`.
4. Change the `.board` from `aspect-ratio: 1` / `width: 100%` to use a size based on the smaller viewport dimension via `min(...)` or `clamp()` with `vw`/`vh` units, ensuring it never exceeds available space.
5. Remove `min-height` from tiles so they can shrink with the board.
6. Update the mobile media query to use tighter spacing.

This approach ensures the entire UI fits within the viewport while still looking good on larger screens.

## Steps to Reproduce
1. Open the application at http://localhost:5173
2. Resize the browser window to a shorter viewport (e.g., 800x600 or 1024x768)
3. Observe that the bottom of the UI (instructions text, or even parts of the board) is cut off and requires scrolling
4. On mobile viewport simulation (e.g., 375x667 iPhone SE), observe the same scrolling requirement

## Root Cause Analysis
The root cause is a combination of fixed/minimum sizes and unconstrained layout:

**`src/App.css` line 6:** `min-height: 100vh` — allows the `.app` container to grow taller than the viewport. Should be `height: 100vh` to cap at viewport height.

**`src/App.css` lines 12-14:** The `h1` at `72px` font-size with `30px` margin-bottom consumes ~110px of vertical space unnecessarily.

**`src/components/Game.css` line 8:** `max-width: 500px` on `.game-container` but no max-height or flex constraints means the container can grow indefinitely vertically.

**`src/components/Game.css` line 78:** `aspect-ratio: 1` on `.board` forces the board to be as tall as it is wide. Combined with `width: 100%` (up to 500px from parent), the board can be 500px tall.

**`src/components/Tile.css` lines 9-10:** `min-width: 70px` and `min-height: 70px` prevent tiles from shrinking below 280px board height (4 tiles × 70px, ignoring gaps).

The combination means the total content height exceeds common viewport heights (especially ≤768px), causing vertical scrolling.

## Relevant Files
Use these files to fix the bug:

- **`src/index.css`** — Contains `#root` and `body` base styles. May need adjustment to ensure proper height propagation.
- **`src/App.css`** — Contains `.app` container styles including `min-height: 100vh` and `h1` sizing. Primary file for layout containment fix.
- **`src/App.tsx`** — Contains the App component structure (title + Game). No code changes expected but useful for understanding the DOM hierarchy.
- **`src/components/Game.css`** — Contains `.game-container` and `.board` styles. Needs flex/sizing adjustments to fit within constrained viewport.
- **`src/components/Game.tsx`** — Contains the Game component structure. No code changes expected but useful for understanding the DOM hierarchy.
- **`src/components/Tile.css`** — Contains tile `min-height`/`min-width` constraints that prevent shrinking. Needs removal of hard minimums.
- **`.claude/commands/test_e2e.md`** — Read to understand E2E test execution framework.
- **`.claude/commands/e2e/test_inline_theme_selector.md`** — Read as reference for creating a new E2E test file.

### New Files
- **`.claude/commands/e2e/test_viewport_layout.md`** — New E2E test file to validate the game fits within the viewport without scrolling across different viewport sizes.

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Fix the `.app` container in `App.css`
- Open `src/App.css`
- Change `min-height: 100vh` to `height: 100vh` and add `overflow: hidden` to prevent any scrolling
- Reduce the `h1` font-size from `72px` to `48px` and `margin-bottom` from `30px` to `10px` to reclaim vertical space
- Add `min-height: 0` to `.app` to allow flex children to shrink properly

The updated `.app` should be:
```css
.app {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  overflow: hidden;
  background: #faf8ef;
  padding: 10px 20px;
}
```

The updated `h1` should be:
```css
.app h1 {
  font-size: 48px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #776e65;
  font-family: 'Arial', sans-serif;
}
```

### Step 2: Fix the `.game-container` and `.board` in `Game.css`
- Open `src/components/Game.css`
- Update `.game-container` to use `flex: 1`, `min-height: 0`, and `overflow: hidden` so it fills available space and allows children to shrink
- Reduce `gap` from `20px` to `12px` and `padding` from `20px` to `10px`
- Update `.board` to size itself based on the smaller of available width and height using viewport-relative units. Remove `aspect-ratio: 1` and `width: 100%`, replace with a size that respects both dimensions:
  ```css
  .board {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(4, 1fr);
    gap: 8px;
    padding: 8px;
    border-radius: 6px;
    width: min(100%, 55vh, 500px);
    height: min(55vh, 500px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    flex-shrink: 0;
  }
  ```
  This ensures the board:
  - Never exceeds 500px (desktop cap)
  - Never exceeds 55% of viewport height (leaves room for other elements)
  - Never exceeds container width

- Update the mobile media query to use tighter gap/padding values and adjust the board sizing:
  ```css
  @media (max-width: 600px) {
    .game-container {
      gap: 8px;
      padding: 5px;
    }

    .game-header {
      flex-direction: column;
    }

    .controls {
      width: 100%;
      justify-content: center;
    }

    .board {
      gap: 6px;
      padding: 6px;
      width: min(100%, 50vh, 500px);
      height: min(50vh, 500px);
    }
  }
  ```

### Step 3: Remove hard `min-height` / `min-width` from tiles in `Tile.css`
- Open `src/components/Tile.css`
- Remove `min-width: 70px` and `min-height: 70px` from `.tile` — these prevent the board from shrinking on short viewports. The grid layout with `1fr` tracks will size tiles proportionally to the board.
- Remove `min-width: 50px` and `min-height: 50px` from the mobile media query for the same reason
- Reduce the base `font-size` from `35px` to a responsive value using `clamp()`:
  ```css
  .tile {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    font-weight: bold;
    font-size: clamp(18px, 4vmin, 35px);
    transition: all 0.15s ease-in-out;
  }
  ```
- Update the mobile media query:
  ```css
  @media (max-width: 600px) {
    .tile {
      font-size: clamp(16px, 3.5vmin, 24px);
    }
  }
  ```

### Step 4: Create E2E test file for viewport layout validation
- Read `.claude/commands/e2e/test_inline_theme_selector.md` and `.claude/commands/test_e2e.md` to understand how to create an E2E test file
- Create a new E2E test file at `.claude/commands/e2e/test_viewport_layout.md` that validates:
  - At a standard desktop viewport (1280x720), the entire game UI is visible without scrolling (document scrollHeight ≤ window innerHeight)
  - At a smaller desktop viewport (1024x768), the entire game UI is visible without scrolling
  - At a mobile viewport (375x667, iPhone SE), the entire game UI is visible without scrolling
  - The board, controls, title, theme selector, and instructions are all visible in the viewport
  - No elements are cut off at the bottom
  - Include screenshots at each viewport size to prove the layout fits

### Step 5: Run Validation Commands
- Run all validation commands listed below to confirm the fix works with zero regressions

## Validation Commands
Execute every command to validate the bug is fixed with zero regressions.

- Read `.claude/commands/test_e2e.md`, then read and execute `.claude/commands/e2e/test_viewport_layout.md` to validate the viewport layout works across screen sizes
- `cd /home/luciano/project && bun tsc --noEmit` - TypeScript type check to confirm no type errors introduced
- `cd /home/luciano/project && bun run build` - Build to confirm no compilation errors

## Notes
- The `aspect-ratio: 1` on `.board` is the single biggest contributor to the overflow — it forces the board to be as tall as it is wide, and since width can be up to 500px, the board alone can consume most of a smaller viewport.
- Using `vh` units for the board height is the key insight: it ties the board size to the actual viewport, ensuring it adapts dynamically. The `min()` function provides a cap so the board doesn't grow excessively on large screens.
- `vmin` for font sizes ensures tile text scales proportionally on both narrow and short viewports.
- The `overflow: hidden` on `.app` is a safety net — with proper sizing, content should fit naturally, but this prevents any accidental scroll from appearing.
- No JavaScript changes are required — this is a pure CSS fix.
- The fix preserves the existing visual design (colors, fonts, border-radius, shadows) — only sizing and spacing are adjusted.
