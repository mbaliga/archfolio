import { BIOME, PAPER } from '../../lib/iso'
import type { MapLayer, Ownership, Project, Quadrant } from '../../types'
import type { District } from './project3d'

// Atmosphere — kept in the warm paper family so the 3D city is seamless with
// the DOM brand (body background, Hero, overlay).
export const SKY = PAPER
export const GROUND = '#e7ddca'
export const PLAZA = '#d6cdba'
export const ROAD = '#d3cbb9'
export const ROAD_EDGE = '#bdb4a2'

// Project buildings read GREY first, with a subtle district tint.
export const BODY = {
  glass: '#bcc3cb', // cool grey-blue — enterprise glass towers
  warm: '#cfc4ad', // warm grey-tan — consumer buildings
} as const

export const ROOF = {
  glass: '#9fadbb',
  warm: '#bca988',
} as const

// Glassy window-band tint for enterprise towers (emissive accent).
export const GLASS_WINDOW = '#7f93a6'

export function bodyColor(d: District): string {
  return BODY[d]
}
export function roofColor(d: District): string {
  return ROOF[d]
}

// Ground district tint pulled straight from the 2D BIOME so the 3D ground
// encodes the same Enterprise/Consumer × Simple/Complex quadrants.
export function districtTint(q: Quadrant): string {
  return BIOME[q].fill
}

// Scenery buildings — plain desaturated greys, flatter/darker than the project
// towers so the labelled towers still pop. + a dim grey for tag-filtered dimming.
export const SCENERY_BODY = ['#b9b3a7', '#c2bcb0', '#aea899', '#c7c0b2', '#b3ad9f']
export const DIM_GREY = '#b4afa6'

// Map layers: recolor project towers by a metric.
export const EFFORT_RAMP = ['#cfe0c3', '#9cc6a0', '#6fae8a', '#4f8fb0', '#3f6aa0'] // 1..5
export const OWNERSHIP_COLORS: Record<Ownership, string> = {
  solo: '#c0654f',
  lead: '#d89a4e',
  collab: '#5a86c9',
  support: '#9aa2ad',
}

export function layerColor(project: Project, layer: MapLayer): string {
  if (layer === 'effort') {
    const e = Math.min(5, Math.max(1, project.effort ?? 3))
    return EFFORT_RAMP[e - 1]
  }
  return OWNERSHIP_COLORS[project.ownership ?? 'support']
}

// Decorative fabric — clearly "nature/minor", never grey like a project.
export const FOLIAGE = ['#7faa5e', '#8cb86a', '#6f9d54']
export const TRUNK = '#8a6b4a'
export const ROCK = '#b7b0a2'
export const HOUSE = ['#e4cdd0', '#e9d6b8', '#dcd2c4'] // warm low houses
export const CAR = ['#c96f5a', '#5a86c9', '#e0b65a', '#6fae8a', '#cdcdd2']
