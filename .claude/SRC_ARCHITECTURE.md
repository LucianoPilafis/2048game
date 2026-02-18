# Source Code Architecture - 2048 Game

## 📁 Source Directory Structure

```
src/
├── main.tsx                   # React app bootstrap
├── App.tsx                    # Root component
│
├── components/                # React UI Components
│   ├── Game.tsx              # Main game board
│   ├── Tile.tsx              # Individual tile display
│   └── PaletteSelector.tsx   # Theme palette switcher
│
├── game/                      # Game Logic (Core 2048 Rules)
│   └── logic.ts              # Game state & algorithms
│
└── themes/                    # Theme & Styling System
    ├── ThemeContext.tsx      # React Context for themes
    └── palettes.ts           # Color palette definitions
```

---

## 🎮 Component Architecture

### App.tsx (Root Component)
**Purpose:** Main application container

**Responsibilities:**
- Render game board
- Manage theme provider
- Handle keyboard input
- Show win/loss conditions

**Key Props:** None (root component)

**Example Usage:**
```tsx
<App />  // Renders entire game
```

---

### Game.tsx (Game Board)
**Purpose:** Main game board display

**Responsibilities:**
- Render 4x4 tile grid
- Display current score
- Handle move animations
- Manage undo button
- Display win/lose states

**Key Imports:**
```tsx
import { GameState, makeMove, undoMove } from '../game/logic'
import Tile from './Tile'
```

**Example Structure:**
```tsx
// Grid rendering
<div className="grid">
  {gameState.board.map((tile, idx) => (
    <Tile key={idx} value={tile.value} />
  ))}
</div>

// Undo button (Issue #15)
<button onClick={handleUndo}>↶ Undo</button>
```

---

### Tile.tsx (Individual Tile)
**Purpose:** Display a single game tile

**Props:**
```tsx
interface TileProps {
  value: number        // Tile value (2, 4, 8, 16, ...)
  position?: { x: number; y: number }  // Grid position
  isNew?: boolean      // Animate new tiles
  isMerged?: boolean   // Animate merged tiles
}
```

**Features:**
- ✅ Display tile value (or empty)
- ✅ Color based on value (from palette)
- ✅ Smooth animations
- ✅ Responsive sizing (Issue #1, #3)

**Example:**
```tsx
<Tile value={2048} isNew={true} />
<Tile value={0} />  // Empty tile
```

---

### PaletteSelector.tsx (Theme Switcher)
**Purpose:** Allow user to change color themes

**Features:**
- ✅ Dropdown or button selection
- ✅ Preview palette before applying
- ✅ Save selected theme (Issue #6)
- ✅ Multiple color schemes available

**Related Issue:** #9 - Scope palette to board

**Example:**
```tsx
<PaletteSelector
  onPaletteChange={(paletteName) => setTheme(paletteName)}
/>
```

---

## ⚙️ Game Logic (`game/logic.ts`)

### Core Exports

#### GameState Interface
```ts
interface GameState {
  board: Tile[][]              // 4x4 board
  score: number                // Current score
  moves: number                // Move count
  isGameOver: boolean           // Win/loss state
  canUndo: boolean             // Can undo last move
  history: GameState[]         // Move history (for undo)
}

interface Tile {
  value: number               // 0 = empty, 2, 4, 8, ...
  id: string                 // Unique ID
  isNew: boolean             // Just created
  isMerged: boolean          // Just merged
}
```

#### Key Functions

**`initializeGame()`**
- Creates new game with 2 random tiles
- Returns initial `GameState`

**`makeMove(state: GameState, direction: 'up' | 'down' | 'left' | 'right'): GameState`**
- Moves tiles in given direction
- Merges adjacent tiles with same value
- Updates score
- Saves to history
- Spawns new tile if board changed

**`undoMove(state: GameState): GameState`**
- Reverts to previous game state
- Issue #15 implementation
- Limited move history (typically 10-20)

**`isGameOver(state: GameState): boolean`**
- Checks if no moves available
- Checks for win condition (2048)

**`addRandomTile(board: Tile[][]): Tile[][]`**
- Spawns new tile (90% chance: 2, 10% chance: 4)
- Random empty position

**`getAvailableMoves(state: GameState): Direction[]`**
- Returns list of valid moves
- Used for move validation

---

## 🎨 Theming System

### ThemeContext.tsx (React Context)

**Purpose:** Global theme provider for entire app

**Context Value:**
```tsx
interface ThemeContextType {
  currentPalette: string              // Active palette name
  palettes: ColorPalette             // All palettes
  colors: ColorPalette[currentPalette]  // Current colors
  setCurrentPalette: (name: string) => void
}
```

**Usage:**
```tsx
// In App.tsx
<ThemeProvider>
  <Game />
  <PaletteSelector />
</ThemeProvider>

// In components
const { colors, setCurrentPalette } = useContext(ThemeContext)
```

---

### palettes.ts (Color Definitions)

**Purpose:** Define all color schemes

**Structure:**
```ts
interface ColorPalette {
  name: string
  background: string
  gridColor: string
  tileColors: {
    [value: number]: {
      bg: string         // Background color
      text: string       // Text color
    }
  }
}

export const palettes: { [name: string]: ColorPalette } = {
  'default': {
    name: 'Default',
    background: '#faf8ef',
    gridColor: '#bbada0',
    tileColors: {
      2: { bg: '#eee4da', text: '#776e65' },
      4: { bg: '#ede0c8', text: '#776e65' },
      8: { bg: '#f2b179', text: '#f9f6f2' },
      // ... more values
    }
  },
  'dark': {
    // ... dark theme
  },
  'ocean': {
    // ... ocean theme (Issue #6)
  }
}
```

**Available Palettes:**
- `default` - Classic 2048 colors
- `dark` - Dark mode variant
- `ocean` - Blue/cyan tones
- Additional custom palettes

---

## 🔄 Data Flow

```
User Input (Arrow Keys)
        ↓
App.tsx (handle keydown)
        ↓
Game.tsx (detect direction)
        ↓
logic.ts - makeMove(state, direction)
        ↓
Update GameState
        ↓
Save to history (for undo)
        ↓
Add new random tile
        ↓
Update score
        ↓
Re-render Game.tsx
        ↓
Tile.tsx renders with animation
        ↓
User sees updated board
```

---

## 🎯 Component Dependency Graph

```
App.tsx
├── ThemeProvider (ThemeContext.tsx)
│   ├── Game.tsx
│   │   ├── Tile.tsx (multiple instances)
│   │   └── logic.ts (imported for game state)
│   │
│   └── PaletteSelector.tsx
│       └── palettes.ts (palette options)
│
└── index.html (entry point)
    └── main.tsx (React.createRoot)
```

---

## 🧪 Testing Strategy

### Unit Tests (Vitest)
Located in test files corresponding to source:

**Game Logic Tests** (`game/logic.test.ts`)
- Test `makeMove()` function
- Test tile merging logic
- Test score calculation
- Test game over detection
- Test undo functionality

**Component Tests** (`components/__tests__/`)
- Test Tile rendering
- Test Game board display
- Test PaletteSelector interaction
- Test keyboard event handling

### E2E Tests (Playwright/Puppeteer)
Located: `e2e_palette_test.mjs` and `.claude/commands/e2e/`

**E2E Test Coverage:**
- Tile size stability (Issue #1, #3)
- Palette scoping (Issue #9)
- Undo button functionality (Issue #15)
- Color palette themes (Issue #6)

---

## 📊 State Management

### Local Component State
- Used for theme selection
- Used for animations
- Used for UI states (showing game over, etc.)

### Context API (Global State)
- Theme/palette selection
- Color definitions

### Game State (Domain Model)
- Board state
- Score
- Move history
- Game over status

```tsx
// Recommended pattern:
const [gameState, setGameState] = useState<GameState>(initializeGame())
const { colors } = useContext(ThemeContext)
```

---

## 🔧 Styling Approach

### CSS/SCSS (Tailwind or Plain CSS)
- Grid layout for board
- Tile styling and animations
- Responsive sizing

### Inline Styles (Dynamic Colors)
```tsx
<Tile
  style={{
    backgroundColor: colors[tileValue].bg,
    color: colors[tileValue].text
  }}
/>
```

---

## 🚀 Performance Considerations

1. **Memoization** - Memoize Tile component to prevent re-renders
   ```tsx
   export const Tile = React.memo(TileComponent)
   ```

2. **Lazy Animations** - Use CSS transitions, not JS animations
   ```css
   .tile {
     transition: transform 0.15s ease-in-out;
   }
   ```

3. **Board Rendering** - Use React keys efficiently
   ```tsx
   {board.map((tile, idx) => (
     <Tile key={tile.id} ... />  // Use stable IDs
   ))}
   ```

---

## 📝 Coding Conventions

### TypeScript
- All components typed with interfaces
- Explicit return types on functions
- Use `React.FC` for components

### Naming
- Components: PascalCase (Game.tsx)
- Functions: camelCase (makeMove)
- Constants: UPPER_CASE (MAX_TILE_VALUE)
- Variables: camelCase (gameState)

### File Organization
- One component per file
- Related utilities grouped in domain folders
- Tests colocated with source

---

## 🔗 Key Files Reference

| File | Purpose | Key Exports |
|------|---------|-------------|
| `App.tsx` | Root component | `App` |
| `components/Game.tsx` | Board display | `Game` |
| `components/Tile.tsx` | Tile display | `Tile` |
| `components/PaletteSelector.tsx` | Theme switcher | `PaletteSelector` |
| `game/logic.ts` | Game rules | `makeMove`, `undoMove`, `GameState` |
| `themes/ThemeContext.tsx` | Theme provider | `ThemeContext`, `ThemeProvider` |
| `themes/palettes.ts` | Colors | `palettes` |
| `main.tsx` | Bootstrap | React.createRoot |

---

## 📚 Related Issues & Features

- **Issue #1, #3:** Tile size stability (fixed in components/Tile.tsx)
- **Issue #6:** Color palette themes (palettes.ts enhancements)
- **Issue #9:** Scope palette to board (PaletteSelector.tsx)
- **Issue #15:** Undo button (logic.ts + Game.tsx)

---

## 🚀 Getting Started

1. **Understand Game Logic**
   - Read `game/logic.ts`
   - Understand `GameState` interface
   - Study `makeMove()` function

2. **Understand Components**
   - Read `App.tsx` structure
   - Study `Game.tsx` rendering
   - Review `Tile.tsx` styling

3. **Understand Themes**
   - Review `ThemeContext.tsx` pattern
   - Study `palettes.ts` structure

4. **Run & Test**
   ```bash
   npm run dev          # Start dev server
   npm test            # Run unit tests
   npm run test:e2e    # Run E2E tests
   ```

---

*Source Architecture Reference - Updated 2026-02-18*
*For ADW workflows, see ADW_QUICK_REFERENCE.md*
*For full project structure, see PROJECT_STRUCTURE.md*
