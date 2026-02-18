# Feature: Inline Theme Selector Layout with Color Dots

## Metadata
issue_number: `f6857c98`
adw_id: `1`
issue_json: ``

## Feature Description
Transform the existing theme selector from a dropdown `<select>` element into an inline, horizontal row of clickable theme options. Each option displays a small colored circle representing the theme's primary palette color alongside the theme name. The selector is repositioned from below the game board to between the top controls area (Score / New Game / Undo) and the game board, providing a more accessible and visually appealing theme switching experience.

## User Story
As a player
I want the theme options to be displayed in a clear, compact row so I can quickly choose a theme
So that the UI feels clean, uncluttered, and I can visually preview theme colors before selecting

## Problem Statement
The current theme selector uses a native `<select>` dropdown positioned below the game board. This placement is not immediately discoverable, and the dropdown provides no visual preview of theme colors — the user must select each option to see what it looks like. This creates a suboptimal user experience for theme discovery and switching.

## Solution Statement
Replace the `<select>` dropdown in `PaletteSelector` with an inline horizontal row of clickable buttons/chips. Each chip contains a small colored circle (derived from the theme's `background` color in `palettes.ts`) and the theme name. Reposition the `PaletteSelector` component in `Game.tsx` so it renders between the game header (score/controls) and the board. Update CSS to ensure the layout is responsive — side-by-side on desktop, wrapping gracefully on narrow screens.

## Relevant Files
Use these files to implement the feature:

- **`src/components/PaletteSelector.tsx`** — The main component being redesigned. Currently renders a `<select>` dropdown; will be rewritten to render inline clickable theme chips with color dots.
- **`src/components/PaletteSelector.css`** — Styles for the palette selector. Will be fully rewritten to support the new inline layout with color dots, active states, hover effects, and responsive wrapping.
- **`src/components/Game.tsx`** — Parent component that renders `PaletteSelector`. The `<PaletteSelector />` call needs to be moved from after the board to between the game header and the board.
- **`src/components/Game.css`** — May need minor adjustments to spacing/gap around the new selector position.
- **`src/themes/palettes.ts`** — Contains palette definitions including `background` color that will be used for the color dot. Read-only reference — no changes needed.
- **`src/themes/ThemeContext.tsx`** — Provides `currentPalette`, `setPalette`, and `availablePalettes` via context. Also exposes palette data. Read-only reference — no changes needed, but the component will access `palettes` directly from `palettes.ts` to get color values for dots.
- **`.claude/commands/test_e2e.md`** — Read to understand how E2E tests are structured and executed.
- **`.claude/commands/e2e/test_basic_query.md`** — Read as a reference for E2E test file format (if it exists; otherwise use the format from `test_e2e.md`).

### New Files
- **`.claude/commands/e2e/test_inline_theme_selector.md`** — E2E test file to validate the inline theme selector layout, color dots, click behavior, and responsive layout.

## Implementation Plan
### Phase 1: Foundation
Understand the current component structure and data flow. The `PaletteSelector` currently uses `useTheme()` to get `currentPalette`, `setPalette`, and `availablePalettes` (an array of palette name strings). To render color dots, the component also needs access to the full palette objects from `palettes.ts` to read each palette's `background` color. Import `palettes` directly from `palettes.ts`.

### Phase 2: Core Implementation
1. Rewrite `PaletteSelector.tsx` to render a horizontal row of clickable theme option elements instead of a `<select>`. Each option is a `<button>` containing a small colored `<span>` (the dot) and the theme name text.
2. Rewrite `PaletteSelector.css` to style the inline layout: flexbox row with wrapping, color dot styling (small circle), active/selected state highlighting, hover effects, and responsive behavior.
3. Move `<PaletteSelector />` in `Game.tsx` from after the board to between the game header and the board.

### Phase 3: Integration
Verify the component integrates cleanly with the existing `ThemeContext` — clicking a theme chip calls `setPalette()` and the selected state reflects `currentPalette.name`. Ensure no visual regressions on desktop and mobile viewports. Validate that the layout doesn't overlap with the board or header.

## Step by Step Tasks

### Step 1: Rewrite PaletteSelector component
- Open `src/components/PaletteSelector.tsx`
- Import `palettes` from `'../themes/palettes'` to access each palette's `background` color for the color dots
- Replace the `<select>` dropdown with a `<div>` container of class `palette-selector` containing a row of `<button>` elements
- Each button should:
  - Have class `palette-option` and an additional `active` class when it matches `currentPalette.name`
  - Contain a `<span className="palette-dot">` styled with `backgroundColor` set to that palette's `background` color
  - Contain a `<span className="palette-name">` with the capitalized palette name
  - Call `setPalette(name)` on click
- Use `Object.entries(palettes)` to iterate and render each option, giving access to both the key and the palette object

### Step 2: Rewrite PaletteSelector CSS
- Open `src/components/PaletteSelector.css`
- Replace all existing styles with new styles:
  - `.palette-selector`: `display: flex`, `flex-wrap: wrap`, `gap: 8px`, `justify-content: center`, `width: 100%`
  - `.palette-option`: flex row button with `display: inline-flex`, `align-items: center`, `gap: 6px`, `padding: 6px 12px`, `border-radius: 20px`, `border: 2px solid transparent`, `background: rgba(0,0,0,0.05)`, `cursor: pointer`, `font-size: 13px`, `color: #776e65`, `transition: all 0.2s`
  - `.palette-option:hover`: `background: rgba(0,0,0,0.1)`
  - `.palette-option.active`: `border-color: #8f7a66`, `background: rgba(143,122,102,0.15)`, `font-weight: bold`
  - `.palette-dot`: `width: 14px`, `height: 14px`, `border-radius: 50%`, `border: 1px solid rgba(0,0,0,0.2)`, `flex-shrink: 0`
  - `.palette-name`: no special styles needed beyond inherited font styles

### Step 3: Reposition PaletteSelector in Game component
- Open `src/components/Game.tsx`
- Move `<PaletteSelector />` from its current position (after the `<div className="board">`) to between the game header `<div className="game-header">` and the board `<div className="board">`
- The render order should be: game-header → PaletteSelector → board → messages → instructions

### Step 4: Adjust Game CSS spacing if needed
- Review `src/components/Game.css` to ensure the gap between the header, new selector position, and board looks balanced
- The existing `gap: 30px` on `.game-container` may be too large for the new selector placement; consider reducing to `20px` or adding specific margin to the selector
- Ensure mobile responsive styles in the `@media (max-width: 600px)` block still work with the new element order

### Step 5: Create E2E test file
- Read `.claude/commands/test_e2e.md` and `.claude/commands/e2e/test_basic_query.md` to understand E2E test format
- Create `.claude/commands/e2e/test_inline_theme_selector.md` with test steps that:
  1. Navigate to the application
  2. Verify the theme selector is visible between the header and the board
  3. Verify all theme options (Default, Ocean, Forest, Sunset) are displayed inline as clickable options with color dots
  4. Verify the Default theme is initially selected (has active styling)
  5. Click the "Ocean" theme option and verify it becomes active and the board background changes
  6. Click the "Forest" theme option and verify it becomes active and the board background changes
  7. Take screenshots at key steps to document the visual state

### Step 6: Run validation commands
- Run `cd /home/luciano/project && npx tsc --noEmit` to validate TypeScript compiles without errors
- Run `cd /home/luciano/project && npx vite build` to validate the production build succeeds
- Read `.claude/commands/test_e2e.md`, then read and execute `.claude/commands/e2e/test_inline_theme_selector.md` to validate the feature end-to-end

## Testing Strategy
### Unit Tests
- No new unit tests are strictly required as this is a UI/layout-only change with no new business logic. The existing `ThemeContext` and `palettes` logic is unchanged. The E2E test covers the interaction behavior.

### Edge Cases
- **Many themes**: If more palettes are added in the future, the flex-wrap ensures they wrap to a new line gracefully
- **Long theme names**: Ensure long theme names don't break the layout; the pill/chip design with padding handles this naturally
- **Mobile viewport**: Verify the selector wraps properly on narrow screens (< 600px) without overlapping the board or header
- **Single theme**: If only one palette exists, the selector should still render cleanly with a single option
- **Rapid clicking**: Clicking multiple themes quickly should not cause visual glitches — each click simply calls `setPalette()` which is a synchronous state update

## Acceptance Criteria
- Theme options are shown side-by-side in a single horizontal row, wrapping to a new line only if the screen is too narrow
- Each theme option includes a small color circle (representing the palette's background color) and the theme name beside it
- The theme selector is positioned between the Score/New Game/Undo controls and the 2048 board
- Clicking a theme option activates that theme (board colors update) and visually highlights the selected option
- The currently active theme has a visible selected/active state (border highlight, bolder text)
- The layout looks clean on desktop and mobile with no overlapping or elements going off-screen
- TypeScript compiles with no errors
- Production build succeeds
- E2E test passes validating selector visibility, theme switching, and layout

## Validation Commands
Execute every command to validate the feature works correctly with zero regressions.

- `cd /home/luciano/project && npx tsc --noEmit` — Run TypeScript type checking to validate no type errors
- `cd /home/luciano/project && npx vite build` — Run production build to validate the feature builds correctly
- Read `.claude/commands/test_e2e.md`, then read and execute `.claude/commands/e2e/test_inline_theme_selector.md` E2E test file to validate this functionality works

## Notes
- The color dot for each theme uses the palette's `background` property, which is the most representative color of each theme's identity (e.g., `#bbada0` for Default, `#1e3a5f` for Ocean, `#1f3a1f` for Forest, `#7c2d12` for Sunset).
- No new libraries are needed — this is a pure CSS/React refactor of existing components.
- The `palettes` object is imported directly in `PaletteSelector.tsx` rather than adding it to the ThemeContext, keeping the context API unchanged and avoiding unnecessary re-renders.
- This project uses Vite (not a separate server/client setup), so build/type-check commands use `npx vite build` and `npx tsc --noEmit` directly from the project root.
