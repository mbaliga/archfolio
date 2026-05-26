export type Quadrant = 'q1' | 'q2' | 'q3' | 'q4'

export type GlyphName =
  | 'robot'
  | 'scanner'
  | 'servers'
  | 'connector'
  | 'book'
  | 'tv'
  | 'heart'
  | 'bubble'
  | 'ballot'
  | 'sprout'
  | 'circles'
  | 'docs'
  | 'cottage'
  | 'trees'
  | 'rocks'
  | 'sign'

export type RoofStyle = 'flat' | 'setback' | 'pitched'

export interface Project {
  id: string
  gx: number
  gy: number
  scale: number
  label: string
  sub: string
  glyph: GlyphName
  desc: string
  tags: string[]
  /** Optional 3D overrides; derived from the graph position when omitted. */
  height?: number
  footprint?: number
  roofStyle?: RoofStyle
  /** Path to a logo image; when set it replaces the wordmark on the building. */
  logo?: string
}

export interface FillerTile {
  id: string
  gx: number
  gy: number
  glyph: GlyphName
  scale?: number
}

export type GridPoint = [number, number]

export type LandmarkKind = 'cinema' | 'stadium' | 'library' | 'gallery' | 'cafe' | 'music'

export interface LandmarkItem {
  primary: string
  secondary?: string
}

export interface Landmark {
  id: string
  gx: number
  gy: number
  kind: LandmarkKind
  label: string
  blurb: string
  accent: string
  items: LandmarkItem[]
}
