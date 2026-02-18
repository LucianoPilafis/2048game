/**
 * Core 2048 Game Logic
 * Handles board state, tile movement, merging, and scoring
 */

export interface GameState {
  board: number[][]
  score: number
  gameOver: boolean
  won: boolean
  history: Array<{ board: number[][]; score: number }>
}

const GRID_SIZE = 4
const SPAWN_PROBABILITY = 0.1
const WIN_TILE = 2048

/**
 * Create a new empty game board
 */
export function createEmptyBoard(): number[][] {
  return Array(GRID_SIZE)
    .fill(null)
    .map(() => Array(GRID_SIZE).fill(0))
}

/**
 * Initialize a new game with two random tiles
 */
export function initializeGame(): GameState {
  const board = createEmptyBoard()
  addRandomTile(board)
  addRandomTile(board)

  return {
    board,
    score: 0,
    gameOver: false,
    won: false,
    history: [],
  }
}

/**
 * Add a random tile (90% chance of 2, 10% chance of 4)
 */
export function addRandomTile(board: number[][]): void {
  const emptyTiles = getEmptyTiles(board)
  if (emptyTiles.length === 0) return

  const randomIndex = Math.floor(Math.random() * emptyTiles.length)
  const [row, col] = emptyTiles[randomIndex]
  board[row][col] = Math.random() < 0.9 ? 2 : 4
}

/**
 * Get all empty tile positions
 */
function getEmptyTiles(board: number[][]): Array<[number, number]> {
  const empty: Array<[number, number]> = []
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      if (board[i][j] === 0) {
        empty.push([i, j])
      }
    }
  }
  return empty
}

/**
 * Move tiles in a direction and merge
 */
export function move(state: GameState, direction: 'left' | 'right' | 'up' | 'down'): GameState {
  const boardCopy = state.board.map(row => [...row])
  const prevScore = state.score

  // Save to history before moving
  const newHistory = [
    ...state.history,
    { board: state.board.map(row => [...row]), score: state.score },
  ]

  let moved = false

  if (direction === 'left' || direction === 'right') {
    for (let i = 0; i < GRID_SIZE; i++) {
      const row = boardCopy[i]
      const result = slideAndMerge(row, direction === 'right')
      if (!arraysEqual(row, result.row)) {
        moved = true
      }
      boardCopy[i] = result.row
      state.score += result.score
    }
  } else {
    for (let j = 0; j < GRID_SIZE; j++) {
      const column = [boardCopy[0][j], boardCopy[1][j], boardCopy[2][j], boardCopy[3][j]]
      const result = slideAndMerge(column, direction === 'down')
      if (!arraysEqual(column, result.row)) {
        moved = true
      }
      for (let i = 0; i < GRID_SIZE; i++) {
        boardCopy[i][j] = result.row[i]
      }
      state.score += result.score
    }
  }

  if (!moved) {
    state.score = prevScore
    state.history = newHistory.slice(0, -1)
    return state
  }

  addRandomTile(boardCopy)

  const gameOver = isGameOver(boardCopy)
  const won = !state.won && hasWon(boardCopy)

  return {
    board: boardCopy,
    score: state.score,
    gameOver,
    won,
    history: newHistory,
  }
}

/**
 * Slide and merge a line of tiles
 */
function slideAndMerge(line: number[], reverse: boolean): { row: number[]; score: number } {
  const arr = reverse ? [...line].reverse() : [...line]
  let score = 0

  // Remove zeros
  let filtered = arr.filter(val => val !== 0)

  // Merge
  for (let i = 0; i < filtered.length - 1; i++) {
    if (filtered[i] === filtered[i + 1]) {
      filtered[i] *= 2
      score += filtered[i]
      filtered.splice(i + 1, 1)
    }
  }

  // Add zeros back
  while (filtered.length < GRID_SIZE) {
    filtered.push(0)
  }

  return { row: reverse ? filtered.reverse() : filtered, score }
}

/**
 * Check if any moves are possible
 */
function isGameOver(board: number[][]): boolean {
  // Check if there are empty tiles
  if (getEmptyTiles(board).length > 0) {
    return false
  }

  // Check if any merges are possible
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      const current = board[i][j]
      if (
        (j < GRID_SIZE - 1 && current === board[i][j + 1]) ||
        (i < GRID_SIZE - 1 && current === board[i + 1][j])
      ) {
        return false
      }
    }
  }

  return true
}

/**
 * Check if player has won (reached 2048)
 */
function hasWon(board: number[][]): boolean {
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      if (board[i][j] === WIN_TILE) {
        return true
      }
    }
  }
  return false
}

/**
 * Undo the last move
 */
export function undo(state: GameState): GameState {
  if (state.history.length === 0) {
    return state
  }

  const lastState = state.history[state.history.length - 1]
  return {
    board: lastState.board.map(row => [...row]),
    score: lastState.score,
    gameOver: false,
    won: state.won,
    history: state.history.slice(0, -1),
  }
}

/**
 * Utility function to compare arrays
 */
function arraysEqual(a: number[], b: number[]): boolean {
  return a.length === b.length && a.every((val, idx) => val === b[idx])
}
