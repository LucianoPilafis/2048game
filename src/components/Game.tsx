import { useState, useEffect, useRef, useCallback } from 'react'
import {
  initializeGame,
  move,
  undo,
  GameState,
} from '../game/logic'
import { GameRun, loadHistory, addRun, getHighestTile } from '../game/history'
import { useTheme } from '../themes/ThemeContext'
import Tile from './Tile'
import PaletteSelector from './PaletteSelector'
import HistoryOverlay from './HistoryOverlay'
import './Game.css'

export default function Game() {
  const [gameState, setGameState] = useState<GameState>(initializeGame())
  const [historyRuns, setHistoryRuns] = useState<GameRun[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const { currentPalette } = useTheme()
  const gameStartRef = useRef<number>(Date.now())
  const savedRef = useRef(false)

  useEffect(() => {
    setHistoryRuns(loadHistory())
  }, [])

  const saveCurrentRun = useCallback(() => {
    if (savedRef.current) return
    // Only save if the game has had at least one move
    if (gameState.previousState === null && gameState.score === 0) return

    const run: GameRun = {
      id: String(Date.now()),
      timestamp: Date.now(),
      finalScore: gameState.score,
      highestTile: getHighestTile(gameState.board),
      durationMs: Date.now() - gameStartRef.current,
    }
    const updated = addRun(run)
    setHistoryRuns(updated)
    savedRef.current = true
  }, [gameState])

  // Auto-save when game over
  useEffect(() => {
    if (gameState.gameOver) {
      saveCurrentRun()
    }
  }, [gameState.gameOver, saveCurrentRun])

  const handleNewGame = useCallback(() => {
    saveCurrentRun()
    setGameState(initializeGame())
    gameStartRef.current = Date.now()
    savedRef.current = false
  }, [saveCurrentRun])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const normalizedKey = e.key.toLowerCase()
      const isUndoShortcut = normalizedKey === 'z' && (e.ctrlKey || e.metaKey || !e.shiftKey)

      if (showHistory) {
        if (e.key === 'Escape') {
          e.preventDefault()
          setShowHistory(false)
        }
        return
      }

      if (gameState.gameOver && normalizedKey !== 'r') return

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault()
          setGameState(prev => move(prev, 'up'))
          break
        case 'ArrowDown':
          e.preventDefault()
          setGameState(prev => move(prev, 'down'))
          break
        case 'ArrowLeft':
          e.preventDefault()
          setGameState(prev => move(prev, 'left'))
          break
        case 'ArrowRight':
          e.preventDefault()
          setGameState(prev => move(prev, 'right'))
          break
      }

      if (isUndoShortcut) {
        e.preventDefault()
        setGameState(prev => undo(prev))
        return
      }

      switch (normalizedKey) {
        case 'r':
          handleNewGame()
          break
        case 'z':
          e.preventDefault()
          setGameState(prev => undo(prev))
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [gameState, showHistory, handleNewGame])

  const boardStyle = {
    backgroundColor: currentPalette.background,
  }

  return (
    <div className="game-container">
      <div className="game-header">
        <div className="score-section">
          <div className="score-label">Score</div>
          <div className="score-value">{gameState.score}</div>
        </div>
        <div className="controls">
          <button onClick={handleNewGame} className="btn-reset">
            New Game
          </button>
          <button
            onClick={() => setGameState(prev => undo(prev))}
            disabled={gameState.previousState === null}
            className="btn-undo"
          >
            Undo
          </button>
          <button onClick={() => setShowHistory(true)} className="btn-history">
            History
          </button>
        </div>
      </div>

      <PaletteSelector />

      <div className="board" style={boardStyle}>
        {gameState.board.map((row, i) =>
          row.map((value, j) => (
            <Tile key={`${i}-${j}`} value={value} palette={currentPalette} />
          )),
        )}
      </div>

      {gameState.won && !gameState.gameOver && (
        <div className="message message-won">
          🎉 You Won!
          <button onClick={handleNewGame}>Play Again</button>
        </div>
      )}

      {gameState.gameOver && (
        <div className="message message-over">
          Game Over!
          <button onClick={handleNewGame}>Try Again</button>
        </div>
      )}

      {showHistory && (
        <HistoryOverlay runs={historyRuns} onClose={() => setShowHistory(false)} />
      )}

      <div className="instructions">
        <p>Use arrow keys to move tiles. Press Z to undo, R to restart.</p>
      </div>
    </div>
  )
}
