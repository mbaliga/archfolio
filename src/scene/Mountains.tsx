import { Instances, Instance } from '@react-three/drei'
import { MOUNTAIN, MOUNTAIN_SNOW } from './lib/cityTheme'

function mulberry32(seed: number): () => number {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

interface Peak {
  x: number
  z: number
  baseR: number
  height: number
  rot: number
  color: string
  snow: boolean
}

// A seeded ring of low-poly peaks well outside the city, framing it and fading
// into the fog. Distant + static, so no shadows.
const PEAKS: Peak[] = (() => {
  const rand = mulberry32(70771)
  const out: Peak[] = []
  const count = 26
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2 + (rand() - 0.5) * 0.14
    const r = 150 + rand() * 52
    const height = 40 + rand() * 62
    const baseR = 17 + rand() * 22
    out.push({
      x: Math.cos(a) * r,
      z: Math.sin(a) * r,
      baseR,
      height,
      rot: rand() * Math.PI,
      color: MOUNTAIN[i % MOUNTAIN.length],
      snow: height > 74,
    })
  }
  return out
})()

const SNOWCAPS = PEAKS.filter((p) => p.snow)

export function Mountains() {
  return (
    <group>
      <Instances limit={PEAKS.length} range={PEAKS.length}>
        <coneGeometry args={[1, 1, 6]} />
        <meshStandardMaterial roughness={1} flatShading />
        {PEAKS.map((p, i) => (
          <Instance
            key={i}
            position={[p.x, p.height / 2, p.z]}
            scale={[p.baseR, p.height, p.baseR]}
            rotation={[0, p.rot, 0]}
            color={p.color}
          />
        ))}
      </Instances>

      {/* Snowcaps on the tallest peaks. */}
      <Instances limit={Math.max(SNOWCAPS.length, 1)} range={SNOWCAPS.length}>
        <coneGeometry args={[1, 1, 6]} />
        <meshStandardMaterial color={MOUNTAIN_SNOW} roughness={1} flatShading />
        {SNOWCAPS.map((p, i) => (
          <Instance
            key={i}
            position={[p.x, p.height - p.height * 0.11, p.z]}
            scale={[p.baseR * 0.34, p.height * 0.24, p.baseR * 0.34]}
            rotation={[0, p.rot, 0]}
          />
        ))}
      </Instances>
    </group>
  )
}
