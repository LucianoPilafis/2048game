import { useState, useEffect } from 'react'
import {
  initializeGame,
  move,
  undo,
  GameState,
} from '../game/logic'
import { useTheme } from '../themes/ThemeContext'
import Tile from './Tile'
import PaletteSelector from './PaletteSelector'
import './Game.css'

export default function Game() {
  const [gameState, setGameState] = useState<GameState>(initializeGame())
  const { currentPalette } = useTheme()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState.gameOver && e.key !== 'r') return

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
        case 'z':
          e.preventDefault()
          setGameState(prev => undo(prev))
          break
        case 'r':
          setGameState(initializeGame())
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [gameState])

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
          <button onClick={() => setGameState(initializeGame())} className="btn-reset">
            New Game
          </button>
          <button
            onClick={() => setGameState(prev => undo(prev))}
            disabled={gameState.previousState === null}
            className="btn-undo"
          >
            Undo
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
          <button onClick={() => setGameState(initializeGame())}>Play Again</button>
        </div>
      )}

      {gameState.gameOver && (
        <div className="message message-over">
          Game Over!
          <button onClick={() => setGameState(initializeGame())}>Try Again</button>
        </div>
      )}

      <div className="instructions">
        <p>Use arrow keys to move tiles. Press Z to undo, R to restart.</p>
      </div>
    </div>
  )
}
