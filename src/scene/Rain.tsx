import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { InstancedMesh, Object3D } from 'three'

const COUNT = 260
const SPREAD = 150 // half-extent in X/Z
const TOP = 92
const SPEED = 72

// Instanced falling streaks in a fixed volume over the city. Only mounted while
// it's actually raining in Hyderabad (see DayNight).
export function Rain() {
  const ref = useRef<InstancedMesh>(null)
  const dummy = useMemo(() => new Object3D(), [])
  const drops = useMemo(
    () =>
      Array.from({ length: COUNT }, () => ({
        x: (Math.random() - 0.5) * SPREAD * 2,
        z: (Math.random() - 0.5) * SPREAD * 2,
        y: Math.random() * TOP,
        v: SPEED * (0.8 + Math.random() * 0.5),
      })),
    [],
  )

  useFrame((_, dt) => {
    const m = ref.current
    if (!m) return
    for (let i = 0; i < COUNT; i++) {
      const d = drops[i]
      d.y -= d.v * dt
      if (d.y < 0) {
        d.y += TOP
        d.x = (Math.random() - 0.5) * SPREAD * 2
        d.z = (Math.random() - 0.5) * SPREAD * 2
      }
      dummy.position.set(d.x, d.y, d.z)
      dummy.updateMatrix()
      m.setMatrixAt(i, dummy.matrix)
    }
    m.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, COUNT]} frustumCulled={false}>
      <boxGeometry args={[0.045, 1.7, 0.045]} />
      <meshBasicMaterial color="#acc6da" transparent opacity={0.45} depthWrite={false} />
    </instancedMesh>
  )
}
