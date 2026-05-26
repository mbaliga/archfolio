import { gridToScreen } from '../lib/iso'
import { MAIN_ROADS, ARTERIES } from '../data/projects'
import type { GridPoint } from '../types'

const MAIN_EDGE = 44
const MAIN_FILL = 38
const ART_EDGE = 26
const ART_FILL = 22
const ROAD_COLOR = '#d6cfbe'
const EDGE_COLOR = '#b8b0a0'
const DASH_COLOR = 'rgba(255,255,255,0.55)'

function pathD(points: GridPoint[]): string {
  return points
    .map(([gx, gy], i) => {
      const { sx, sy } = gridToScreen(gx, gy)
      return `${i === 0 ? 'M' : 'L'} ${sx.toFixed(1)} ${sy.toFixed(1)}`
    })
    .join(' ')
}

// Real roads as layered SVG strokes (dark edge → road fill → centre dash),
// rendered behind the tiles. Google-Maps style, not tiles.
export function RoadLayer() {
  const { sx: ix, sy: iy } = gridToScreen(0, 0)

  return (
    <svg
      width="1"
      height="1"
      className="absolute left-0 top-0 overflow-visible"
      style={{ pointerEvents: 'none', zIndex: 0 }}
    >
      {/* Arterials: edge → fill → dash */}
      {ARTERIES.map((pts, i) => (
        <path
          key={`ae-${i}`}
          d={pathD(pts)}
          fill="none"
          stroke={EDGE_COLOR}
          strokeWidth={ART_EDGE}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
      {ARTERIES.map((pts, i) => (
        <path
          key={`af-${i}`}
          d={pathD(pts)}
          fill="none"
          stroke={ROAD_COLOR}
          strokeWidth={ART_FILL}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
      {ARTERIES.map((pts, i) => (
        <path
          key={`ad-${i}`}
          d={pathD(pts)}
          fill="none"
          stroke={DASH_COLOR}
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeDasharray="5 9"
        />
      ))}

      {/* Main roads: edge → fill → double dashes */}
      {MAIN_ROADS.map((pts, i) => (
        <path
          key={`me-${i}`}
          d={pathD(pts)}
          fill="none"
          stroke={EDGE_COLOR}
          strokeWidth={MAIN_EDGE}
          strokeLinecap="round"
        />
      ))}
      {MAIN_ROADS.map((pts, i) => (
        <path
          key={`mf-${i}`}
          d={pathD(pts)}
          fill="none"
          stroke={ROAD_COLOR}
          strokeWidth={MAIN_FILL}
          strokeLinecap="round"
        />
      ))}
      {MAIN_ROADS.map((pts, i) => (
        <path
          key={`md-${i}`}
          d={pathD(pts)}
          fill="none"
          stroke={DASH_COLOR}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="10 10"
        />
      ))}

      {/* Crossroads roundabout at the origin */}
      <circle cx={ix} cy={iy} r={30} fill={EDGE_COLOR} />
      <circle cx={ix} cy={iy} r={26} fill={ROAD_COLOR} />
      <circle cx={ix} cy={iy} r={5} fill={EDGE_COLOR} />
    </svg>
  )
}
