import { GameRun, formatTimeAgo, formatDuration } from '../game/history'
import './HistoryOverlay.css'

interface HistoryOverlayProps {
  runs: GameRun[]
  onClose: () => void
}

export default function HistoryOverlay({ runs, onClose }: HistoryOverlayProps) {
  return (
    <div
      className="history-overlay-backdrop"
      data-testid="history-overlay"
      onClick={onClose}
    >
      <div className="history-overlay-panel" onClick={e => e.stopPropagation()}>
        <div className="history-overlay-header">
          <h2>History</h2>
          <button className="history-overlay-close" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="history-overlay-content">
          {runs.length === 0 ? (
            <p className="history-empty">No runs yet</p>
          ) : (
            <ul className="history-run-list">
              {runs.map(run => (
                <li key={run.id} className="history-run-entry">
                  <div className="history-run-time">{formatTimeAgo(run.timestamp)}</div>
                  <div className="history-run-details">
                    <span className="history-run-score">Score: {run.finalScore}</span>
                    <span className="history-run-tile">Best tile: {run.highestTile}</span>
                    {run.durationMs != null && (
                      <span className="history-run-duration">{formatDuration(run.durationMs)}</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
