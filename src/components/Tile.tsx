import { Palette } from '../themes/palettes'
import './Tile.css'

interface TileProps {
  value: number
  palette: Palette
}

export default function Tile({ value, palette }: TileProps) {
  let tileStyle: React.CSSProperties = {
    backgroundColor: palette.empty,
    color: palette.text,
  }

  if (value > 0) {
    const tileColor = palette.tiles[value] || palette.tiles[2048]
    tileStyle = {
      backgroundColor: tileColor.bg,
      color: tileColor.color,
    }
  }

  return (
    <div className="tile" style={tileStyle}>
      {value > 0 && <span className="tile-value">{value}</span>}
    </div>
  )
}
