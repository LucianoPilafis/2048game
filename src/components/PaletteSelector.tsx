import { useTheme } from '../themes/ThemeContext'
import { palettes } from '../themes/palettes'
import './PaletteSelector.css'

export default function PaletteSelector() {
  const { currentPalette, setPalette } = useTheme()

  return (
    <div className="palette-selector">
      {Object.entries(palettes).map(([key, palette]) => (
        <button
          key={key}
          className={`palette-option${currentPalette.name === palette.name ? ' active' : ''}`}
          onClick={() => setPalette(key)}
        >
          <span
            className="palette-dot"
            style={{ backgroundColor: palette.background }}
          />
          <span className="palette-name">
            {palette.name}
          </span>
        </button>
      ))}
    </div>
  )
}
