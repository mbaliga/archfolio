import type { Quadrant } from '../types'

// Isometric math. Coords: gx = complexity (+right), gy = enterprise/consumer (+up).
// Screen mapping: sx = (gx - gy) * HALF_W, sy = -(gx + gy) * HALF_H
export const HALF_W = 100
export const HALF_H = 50
// Lattice spacing > tile size so tiles float with a default gap (the jigsaw feel).
export const SPACING = 1.45

export function gridToScreen(gx: number, gy: number, s: number = SPACING): { sx: number; sy: number } {
  return { sx: (gx - gy) * HALF_W * s, sy: -(gx + gy) * HALF_H * s }
}

export function quadrant(gx: number, gy: number): Quadrant {
  if (gx > 0 && gy > 0) return 'q1' // enterprise + complex
  if (gx < 0 && gy > 0) return 'q2' // enterprise + simple
  if (gx < 0 && gy < 0) return 'q3' // consumer + simple
  return 'q4' // consumer + complex
}

export interface Biome {
  fill: string
  side: string
  label: string
}

export const BIOME: Record<Quadrant, Biome> = {
  q1: { fill: '#8fb6d0', side: '#6f96b0', label: 'Enterprise · Complex' },
  q2: { fill: '#6fae6a', side: '#5a8e57', label: 'Enterprise · Simple' },
  q3: { fill: '#b9d68a', side: '#8eb46a', label: 'Consumer · Simple' },
  q4: { fill: '#e6c389', side: '#c69e64', label: 'Consumer · Complex' },
}

export const PAPER = '#fbf7ee'
export const STROKE = '#2a2622'
