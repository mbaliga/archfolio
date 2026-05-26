import { useEffect, useMemo } from 'react'
import { MeshStandardMaterial } from 'three'
import { ROAD } from './lib/cityTheme'
import { ROAD_SEGS } from './lib/cityModel'

export function Roads() {
  const material = useMemo(
    () => new MeshStandardMaterial({ color: ROAD, roughness: 1 }),
    [],
  )
  useEffect(() => () => material.dispose(), [material])

  return (
    <group>
      {ROAD_SEGS.map((s, i) => {
        const dx = s.bx - s.ax
        const dz = s.bz - s.az
        const len = Math.hypot(dx, dz)
        const angle = Math.atan2(-dz, dx)
        return (
          <mesh
            key={i}
            material={material}
            position={[(s.ax + s.bx) / 2, 0.03, (s.az + s.bz) / 2]}
            rotation={[0, angle, 0]}
            receiveShadow
          >
            <boxGeometry args={[len + s.width, 0.06, s.width]} />
          </mesh>
        )
      })}
    </group>
  )
}
