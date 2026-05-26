import type { Quadrant } from '../types'
import { GROUND, PLAZA, ROAD, districtTint } from './lib/cityTheme'
import { CITY_BOUNDS, CITY_RADIUS } from './lib/cityModel'
import { LOT } from './lib/project3d'

const { minX, maxX, minZ, maxZ } = CITY_BOUNDS

// Quadrant → world region. gx>0 → x>0; gy>0 → z<0 (enterprise reads "away").
interface Quad {
  q: Quadrant
  cx: number
  cz: number
  sx: number
  sz: number
}
const QUADS: Quad[] = [
  { q: 'q1', cx: maxX / 2, cz: minZ / 2, sx: maxX, sz: -minZ }, // enterprise · complex
  { q: 'q2', cx: minX / 2, cz: minZ / 2, sx: -minX, sz: -minZ }, // enterprise · simple
  { q: 'q3', cx: minX / 2, cz: maxZ / 2, sx: -minX, sz: maxZ }, // consumer · simple
  { q: 'q4', cx: maxX / 2, cz: maxZ / 2, sx: maxX, sz: maxZ }, // consumer · complex
]

export function Ground() {
  const span = CITY_RADIUS * 2.2
  return (
    <group>
      {/* Base ground — extends past the city so fog can fade the edge. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[span, span]} />
        <meshStandardMaterial color={GROUND} roughness={1} />
      </mesh>

      {/* District tints — the ground encodes the same quadrants as the graph. */}
      {QUADS.map((qd) => (
        <mesh
          key={qd.q}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[qd.cx, 0.02, qd.cz]}
        >
          <planeGeometry args={[qd.sx, qd.sz]} />
          <meshBasicMaterial color={districtTint(qd.q)} transparent opacity={0.12} depthWrite={false} />
        </mesh>
      ))}

      {/* Central roundabout / plaza at the crossroad. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
        <circleGeometry args={[LOT * 1.05, 48]} />
        <meshStandardMaterial color={PLAZA} roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <ringGeometry args={[LOT * 0.5, LOT * 0.72, 48]} />
        <meshBasicMaterial color={ROAD} />
      </mesh>

      {/* Modest central monument (the hub). */}
      <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2, 2.4, 1.2, 16]} />
        <meshStandardMaterial color="#cfc6b4" roughness={0.9} />
      </mesh>
      <mesh position={[0, 3.0, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[1.15, 4.2, 4]} />
        <meshStandardMaterial color="#b3a892" roughness={0.85} />
      </mesh>
    </group>
  )
}
