import { useTheme } from '../themes/ThemeContext'
import './PaletteSelector.css'

export default function PaletteSelector() {
  const { currentPalette, setPalette, availablePalettes } = useTheme()

  return (
    <div className="palette-selector">
      <label htmlFor="palette-select">Theme:</label>
      <select
        id="palette-select"
        value={currentPalette.name}
        onChange={e => setPalette(e.target.value)}
      >
        {availablePalettes.map(name => (
          <option key={name} value={name}>
            {name.charAt(0).toUpperCase() + name.slice(1)}
          </option>
        ))}
      </select>
    </div>
  )
}
