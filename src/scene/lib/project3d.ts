import type { RoofStyle } from '../../types'

// Grid → 3D. Three is Y-up; the city sits on the X/Z ground plane. The
// isometric "look" comes from the camera angle, NOT from foreshortening here.
//   gx = complexity  (+right)  → world +X
//   gy = enterprise(+)/consumer(-) → world -Z (enterprise reads "north/away")
export const LOT = 8

export function gridToWorld(gx: number, gy: number): [number, number, number] {
  return [gx * LOT, 0, -gy * LOT]
}

export type District = 'glass' | 'warm'

// Importance (scale) drives plan bulk.
export function footprintFor(scale: number, override?: number): number {
  return override ?? 4.5 + scale * 1.6
}

// Locked meaning rule: HEIGHT grows with COMPLEXITY (|gx|); the enterprise side
// reads as tall glass towers, the consumer side as low, warm buildings.
export function heightFor(gx: number, gy: number, scale: number, override?: number): number {
  if (override !== undefined) return override
  const complexity = Math.abs(gx)
  const base = 5 + complexity * 2.6
  const enterpriseBoost = gy > 0 ? 1.55 : 1.0
  const consumerDamp = gy < 0 ? 0.6 : 1.0
  const importance = 0.85 + scale * 0.4
  return base * enterpriseBoost * consumerDamp * importance
}

export function districtFor(gy: number, roofStyle?: RoofStyle): District {
  if (roofStyle === 'pitched') return 'warm' // the cottage stays warm, never glass
  return gy > 0 ? 'glass' : 'warm'
}

// Tall towers get a tiered silhouette; short buildings stay flat-roofed.
export function resolveRoofStyle(height: number, explicit?: RoofStyle): RoofStyle {
  if (explicit) return explicit
  return height > 26 ? 'setback' : 'flat'
}
