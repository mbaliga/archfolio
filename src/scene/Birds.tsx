import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group } from 'three'

const WING = '#3b3833'

interface Spec {
  r: number
  y: number
  speed: number
  phase: number
  bob: number
  size: number
}

// A small flock on lazy circular paths at varied radius/height/phase.
const FLOCK: Spec[] = [
  { r: 34, y: 38, speed: 0.18, phase: 0.0, bob: 3, size: 1.0 },
  { r: 40, y: 44, speed: 0.15, phase: 1.1, bob: 4, size: 1.2 },
  { r: 30, y: 50, speed: 0.22, phase: 2.3, bob: 3, size: 0.85 },
  { r: 52, y: 41, speed: 0.13, phase: 3.0, bob: 5, size: 1.1 },
  { r: 46, y: 55, speed: 0.16, phase: 4.2, bob: 4, size: 0.95 },
  { r: 60, y: 47, speed: 0.11, phase: 5.0, bob: 5, size: 1.25 },
  { r: 36, y: 60, speed: 0.19, phase: 0.7, bob: 3, size: 0.8 },
  { r: 56, y: 52, speed: 0.12, phase: 2.8, bob: 4, size: 1.05 },
]

function Bird({ spec }: { spec: Spec }) {
  const ref = useRef<Group>(null)
  const left = useRef<Group>(null)
  const right = useRef<Group>(null)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const a = spec.phase + t * spec.speed
    if (ref.current) {
      ref.current.position.set(Math.cos(a) * spec.r, spec.y + Math.sin(t * 0.8 + spec.phase) * spec.bob, Math.sin(a) * spec.r)
      ref.current.rotation.y = -a // body +Z points along travel; wings span the radial
    }
    const flap = 0.2 + Math.sin(t * 7 + spec.phase) * 0.6
    if (left.current) left.current.rotation.z = flap
    if (right.current) right.current.rotation.z = -flap
  })

  const s = spec.size
  return (
    <group ref={ref} scale={s}>
      <group ref={left}>
        <mesh position={[-0.85, 0, 0]}>
          <boxGeometry args={[1.7, 0.06, 0.55]} />
          <meshStandardMaterial color={WING} roughness={1} />
        </mesh>
      </group>
      <group ref={right}>
        <mesh position={[0.85, 0, 0]}>
          <boxGeometry args={[1.7, 0.06, 0.55]} />
          <meshStandardMaterial color={WING} roughness={1} />
        </mesh>
      </group>
    </group>
  )
}

export function Birds() {
  return (
    <group>
      {FLOCK.map((spec, i) => (
        <Bird key={i} spec={spec} />
      ))}
    </group>
  )
}
