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
}

export interface FillerTile {
  id: string
  gx: number
  gy: number
  glyph: GlyphName
  scale?: number
}

export type GridPoint = [number, number]
