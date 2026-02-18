export interface GameRun {
  id: string
  timestamp: number
  finalScore: number
  highestTile: number
  durationMs: number | null
}

const STORAGE_KEY = '2048-history'

export function getHighestTile(board: number[][]): number {
  let max = 0
  for (const row of board) {
    for (const val of row) {
      if (val > max) max = val
    }
  }
  return max
}

export function loadHistory(): GameRun[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) return []
    const parsed = JSON.parse(data)
    if (!Array.isArray(parsed)) return []
    return parsed
  } catch {
    return []
  }
}

export function saveHistory(runs: GameRun[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(runs))
  } catch {
    // localStorage unavailable or quota exceeded — silently fail
  }
}

export function addRun(run: GameRun): GameRun[] {
  const history = loadHistory()
  history.unshift(run)
  saveHistory(history)
  return history
}

export function formatTimeAgo(timestamp: number): string {
  const now = Date.now()
  const diffMs = now - timestamp
  const seconds = Math.floor(diffMs / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const months = Math.floor(days / 30)

  if (seconds < 10) return 'just now'
  if (seconds < 60) return `${seconds} seconds ago`
  if (minutes === 1) return '1 minute ago'
  if (minutes < 60) return `${minutes} minutes ago`
  if (hours === 1) return '1 hour ago'
  if (hours < 24) return `${hours} hours ago`
  if (days === 1) return '1 day ago'
  if (days < 30) return `${days} days ago`
  if (months === 1) return '1 month ago'
  return `${months} months ago`
}

export function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  if (totalSeconds < 1) return '< 1s'
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  if (minutes === 0) return `${seconds}s`
  return `${minutes}m ${seconds}s`
}
