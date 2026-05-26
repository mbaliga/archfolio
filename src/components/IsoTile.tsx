import { BIOME, HALF_W, HALF_H, PAPER, STROKE } from '../lib/iso'
import { Glyphs } from './Glyphs'
import type { GlyphName, Quadrant } from '../types'

interface IsoTileProps {
  biome?: Quadrant
  glyph?: GlyphName
  size?: number
  /** Explicit top-face fill, overriding the biome (used by the hub). */
  fill?: string
  /** Render the central "START" signpost label. */
  isHub?: boolean
}

// A single flat isometric diamond with an optional decorative glyph.
export function IsoTile({ biome, glyph, size = 1, fill, isHub }: IsoTileProps) {
  const W = HALF_W * size
  const H = HALF_H * size
  const topFill = fill ?? (biome ? BIOME[biome].fill : PAPER)
  const top = `0,${-H} ${W},0 0,${H} ${-W},0`
  const Glyph = glyph ? Glyphs[glyph] : null

  return (
    <svg
      className="block overflow-visible"
      width={W * 2 + 4}
      height={H * 2 + 40}
      viewBox={`${-W - 2} ${-H - 38} ${W * 2 + 4} ${H * 2 + 40}`}
    >
      <polygon points={top} fill={topFill} stroke={STROKE} strokeWidth="1.5" strokeLinejoin="round" />
      {Glyph && (
        <g transform={`scale(${Math.min(1.3, 0.55 + size * 0.4)})`}>
          <Glyph />
        </g>
      )}
      {isHub && (
        <text
          x="0"
          y="-22"
          textAnchor="middle"
          fontFamily="'JetBrains Mono', monospace"
          fontSize="7"
          fontWeight="700"
          letterSpacing="1"
          fill={STROKE}
        >
          START
        </text>
      )}
    </svg>
  )
}
