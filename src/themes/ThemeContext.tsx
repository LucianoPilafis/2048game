import React, { createContext, useContext, useState, ReactNode } from 'react'
import { palettes, Palette } from './palettes'

interface ThemeContextType {
  currentPalette: Palette
  setPalette: (paletteName: string) => void
  availablePalettes: string[]
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [currentPaletteName, setCurrentPaletteName] = useState('default')

  const currentPalette = palettes[currentPaletteName] || palettes.default

  const setPalette = (paletteName: string) => {
    if (palettes[paletteName]) {
      setCurrentPaletteName(paletteName)
    }
  }

  const availablePalettes = Object.keys(palettes)

  return (
    <ThemeContext.Provider value={{ currentPalette, setPalette, availablePalettes }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
