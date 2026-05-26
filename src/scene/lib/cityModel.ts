import { PROJECTS, FILLER, MAIN_ROADS, ARTERIES } from '../../data/projects'
import type { Project, GridPoint } from '../../types'
import {
  gridToWorld,
  heightFor,
  footprintFor,
  districtFor,
  resolveRoofStyle,
  LOT,
  type District,
} from './project3d'
import type { RoofStyle } from '../../types'

export interface BuildingDef {
  project: Project
  position: [number, number, number]
  height: number
  footprint: number
  district: District
  roofStyle: RoofStyle
}

export const BUILDINGS: BuildingDef[] = PROJECTS.map((p) => {
  const height = heightFor(p.gx, p.gy, p.scale, p.height)
  const footprint = footprintFor(p.scale, p.footprint)
  return {
    project: p,
    position: gridToWorld(p.gx, p.gy),
    height,
    footprint,
    district: districtFor(p.gy, p.roofStyle),
    roofStyle: resolveRoofStyle(height, p.roofStyle),
  }
})

export const HUB_POS = gridToWorld(0, 0)

// --- Roads: grid polylines → world-space segments with a width ---------------
export interface RoadSeg {
  ax: number
  az: number
  bx: number
  bz: number
  width: number
}

const MAIN_W = 3.2
const ART_W = 2.0

function toSegments(lines: GridPoint[][], width: number): RoadSeg[] {
  const segs: RoadSeg[] = []
  for (const line of lines) {
    for (let i = 0; i < line.length - 1; i++) {
      const [ax, , az] = gridToWorld(line[i][0], line[i][1])
      const [bx, , bz] = gridToWorld(line[i + 1][0], line[i + 1][1])
      segs.push({ ax, az, bx, bz, width })
    }
  }
  return segs
}

export const ROAD_SEGS: RoadSeg[] = [
  ...toSegments(MAIN_ROADS, MAIN_W),
  ...toSegments(ARTERIES, ART_W),
]

// --- Decorative fabric: FILLER + procedural fill of empty lots ---------------
export type PropKind = 'tree' | 'rock' | 'house'

export interface PropDef {
  id: string
  kind: PropKind
  position: [number, number, number]
  rotationY: number
  scale: number
}

function mulberry32(seed: number): () => number {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const GRID_STEPS = [-6, -4, -2, 0, 2, 4, 6]

function buildProps(): PropDef[] {
  const rng = mulberry32(20260526)
  const occupied = new Set<string>([
    ...PROJECTS.map((p) => `${p.gx},${p.gy}`),
    '0,0',
  ])
  const props: PropDef[] = []

  // Anchored greenery from the existing FILLER data.
  for (const f of FILLER) {
    occupied.add(`${f.gx},${f.gy}`)
    const [x, , z] = gridToWorld(f.gx, f.gy)
    const kind: PropKind = f.glyph === 'rocks' ? 'rock' : 'tree'
    const count = kind === 'tree' ? 3 : 2
    for (let i = 0; i < count; i++) {
      props.push({
        id: `${f.id}-${i}`,
        kind,
        position: [x + (rng() - 0.5) * LOT * 0.9, 0, z + (rng() - 0.5) * LOT * 0.9],
        rotationY: rng() * Math.PI * 2,
        scale: 0.7 + rng() * 0.6,
      })
    }
  }

  // Procedural fill of remaining empty lots (skip the road axes at gx/gy = 0).
  for (const gx of GRID_STEPS) {
    for (const gy of GRID_STEPS) {
      if (gx === 0 || gy === 0) continue
      if (occupied.has(`${gx},${gy}`)) continue
      if (rng() < 0.32) continue // leave breathing room
      const [x, , z] = gridToWorld(gx, gy)
      // Consumer side (gy < 0) gets warm low houses; elsewhere small parks.
      if (gy < 0 && rng() < 0.7) {
        props.push({
          id: `h-${gx}-${gy}`,
          kind: 'house',
          position: [x + (rng() - 0.5) * 2, 0, z + (rng() - 0.5) * 2],
          rotationY: (Math.round(rng() * 4) * Math.PI) / 2,
          scale: 0.85 + rng() * 0.4,
        })
      } else {
        const count = 2 + Math.floor(rng() * 2)
        for (let i = 0; i < count; i++) {
          props.push({
            id: `t-${gx}-${gy}-${i}`,
            kind: 'tree',
            position: [x + (rng() - 0.5) * LOT, 0, z + (rng() - 0.5) * LOT],
            rotationY: rng() * Math.PI * 2,
            scale: 0.6 + rng() * 0.5,
          })
        }
      }
    }
  }
  return props
}

export const PROPS: PropDef[] = buildProps()

// --- Camera pan bounds -------------------------------------------------------
function computeBounds() {
  const xs: number[] = []
  const zs: number[] = []
  for (const b of BUILDINGS) {
    xs.push(b.position[0])
    zs.push(b.position[2])
  }
  for (const s of ROAD_SEGS) {
    xs.push(s.ax, s.bx)
    zs.push(s.az, s.bz)
  }
  const pad = 16
  return {
    minX: Math.min(...xs) - pad,
    maxX: Math.max(...xs) + pad,
    minZ: Math.min(...zs) - pad,
    maxZ: Math.max(...zs) + pad,
  }
}

export const CITY_BOUNDS = computeBounds()
export const CITY_RADIUS = Math.max(
  CITY_BOUNDS.maxX - CITY_BOUNDS.minX,
  CITY_BOUNDS.maxZ - CITY_BOUNDS.minZ,
)
