/**
 * Color palette definitions for different themes
 */

export interface Palette {
  name: string
  background: string
  empty: string
  text: string
  tiles: Record<number, { bg: string; color: string }>
}

export const palettes: Record<string, Palette> = {
  default: {
    name: 'Default',
    background: '#bbada0',
    empty: '#cdc1b4',
    text: '#776e65',
    tiles: {
      2: { bg: '#eee4da', color: '#776e65' },
      4: { bg: '#ede0c8', color: '#776e65' },
      8: { bg: '#f2b179', color: '#f9f6f2' },
      16: { bg: '#f59563', color: '#f9f6f2' },
      32: { bg: '#f67c5f', color: '#f9f6f2' },
      64: { bg: '#f65e3b', color: '#f9f6f2' },
      128: { bg: '#edcf72', color: '#095f6b' },
      256: { bg: '#edcc61', color: '#095f6b' },
      512: { bg: '#edc850', color: '#095f6b' },
      1024: { bg: '#edc53f', color: '#095f6b' },
      2048: { bg: '#edc22e', color: '#095f6b' },
    },
  },
  ocean: {
    name: 'Ocean',
    background: '#1e3a5f',
    empty: '#2c5282',
    text: '#ebf8ff',
    tiles: {
      2: { bg: '#bee3f8', color: '#1e3a5f' },
      4: { bg: '#90cdf4', color: '#1e3a5f' },
      8: { bg: '#63b3ed', color: '#fff' },
      16: { bg: '#4299e1', color: '#fff' },
      32: { bg: '#3182ce', color: '#fff' },
      64: { bg: '#2c5282', color: '#fff' },
      128: { bg: '#1e3a8a', color: '#fff' },
      256: { bg: '#1a365d', color: '#fff' },
      512: { bg: '#0c21a4', color: '#fff' },
      1024: { bg: '#0c21a4', color: '#fff' },
      2048: { bg: '#0d1b8e', color: '#fff' },
    },
  },
  forest: {
    name: 'Forest',
    background: '#1f3a1f',
    empty: '#3d5f3d',
    text: '#e6f2e6',
    tiles: {
      2: { bg: '#c6f6d5', color: '#1f3a1f' },
      4: { bg: '#9ae6b4', color: '#1f3a1f' },
      8: { bg: '#68d391', color: '#1f3a1f' },
      16: { bg: '#48bb78', color: '#fff' },
      32: { bg: '#38a169', color: '#fff' },
      64: { bg: '#2f855a', color: '#fff' },
      128: { bg: '#22543d', color: '#fff' },
      256: { bg: '#1b4332', color: '#fff' },
      512: { bg: '#0d3b1f', color: '#fff' },
      1024: { bg: '#0d3b1f', color: '#fff' },
      2048: { bg: '#051a0f', color: '#fff' },
    },
  },
  sunset: {
    name: 'Sunset',
    background: '#7c2d12',
    empty: '#b45309',
    text: '#fef3c7',
    tiles: {
      2: { bg: '#fef08a', color: '#7c2d12' },
      4: { bg: '#fde047', color: '#7c2d12' },
      8: { bg: '#facc15', color: '#7c2d12' },
      16: { bg: '#eab308', color: '#fff' },
      32: { bg: '#ca8a04', color: '#fff' },
      64: { bg: '#a16207', color: '#fff' },
      128: { bg: '#b45309', color: '#fff' },
      256: { bg: '#92400e', color: '#fff' },
      512: { bg: '#78350f', color: '#fff' },
      1024: { bg: '#78350f', color: '#fff' },
      2048: { bg: '#5a1e02', color: '#fff' },
    },
  },
}
