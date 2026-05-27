import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group, MeshStandardMaterial } from 'three'
import { easing } from 'maath'
import { CLOCK_TOWER } from './lib/cityModel'
import { getHyderabadTime } from '../lib/sky'

const STONE = '#c4bca8'
const TRIM = '#8f8675'
const FACE = '#fbf7ee'
const INK = '#1b1b1b'

const TOWER_W = 5.4
const FACE_Y = 18
const FACE_R = 2.3
const FACE_Z = TOWER_W / 2 + 0.01

const TWO_PI = Math.PI * 2

// A civic clock tower near the plaza, its face turned toward the opening camera.
// The hands track Hyderabad time; the dial glows at night.
export function ClockTower() {
  const hour = useRef<Group>(null)
  const minute = useRef<Group>(null)
  const face = useRef<MeshStandardMaterial>(null)

  useFrame((_, dt) => {
    const { hour: h, minute: m, frac } = getHyderabadTime()
    // Clock-wise sweep as seen from +Z (the camera side) → negative Z rotation.
    if (minute.current) minute.current.rotation.z = -(m / 60) * TWO_PI
    if (hour.current) hour.current.rotation.z = -(((h % 12) + m / 60) / 12) * TWO_PI
    if (face.current) {
      const night = frac < 6.8 || frac >= 18.3
      easing.damp(face.current, 'emissiveIntensity', night ? 0.6 : 0, 0.5, dt)
    }
  })

  return (
    <group position={CLOCK_TOWER.position}>
      {/* footing */}
      <mesh position={[0, 0.4, 0]} receiveShadow>
        <boxGeometry args={[TOWER_W * 1.25, 0.8, TOWER_W * 1.25]} />
        <meshStandardMaterial color={TRIM} roughness={0.95} />
      </mesh>

      {/* shaft */}
      <mesh position={[0, 12, 0]} castShadow receiveShadow>
        <boxGeometry args={[TOWER_W, 24, TOWER_W]} />
        <meshStandardMaterial color={STONE} roughness={0.9} />
      </mesh>

      {/* belfry band + pyramidal roof */}
      <mesh position={[0, 24.6, 0]} castShadow>
        <boxGeometry args={[TOWER_W * 1.12, 1.4, TOWER_W * 1.12]} />
        <meshStandardMaterial color={TRIM} roughness={0.85} />
      </mesh>
      <mesh position={[0, 27.6, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[TOWER_W * 0.78, 4.2, 4]} />
        <meshStandardMaterial color="#7b5a44" roughness={0.85} />
      </mesh>

      {/* clock face (camera side, +Z) */}
      <group position={[0, FACE_Y, FACE_Z]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[FACE_R, FACE_R, 0.18, 36]} />
          <meshStandardMaterial ref={face} color={FACE} emissive="#ffe6a8" emissiveIntensity={0} roughness={0.8} />
        </mesh>
        <mesh position={[0, 0, 0.02]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[FACE_R, 0.14, 8, 36]} />
          <meshStandardMaterial color={TRIM} roughness={0.7} />
        </mesh>

        {/* 12 / 3 / 6 / 9 ticks */}
        {[0, 1, 2, 3].map((k) => {
          const ang = (k / 4) * TWO_PI
          return (
            <mesh
              key={k}
              position={[Math.sin(ang) * (FACE_R * 0.82), Math.cos(ang) * (FACE_R * 0.82), 0.12]}
            >
              <boxGeometry args={[0.16, 0.16, 0.08]} />
              <meshStandardMaterial color={INK} roughness={0.8} />
            </mesh>
          )
        })}

        {/* hands (pivot at centre, extend up = 12 o'clock) */}
        <group ref={hour} position={[0, 0, 0.14]}>
          <mesh position={[0, FACE_R * 0.3, 0]}>
            <boxGeometry args={[0.16, FACE_R * 0.62, 0.08]} />
            <meshStandardMaterial color={INK} roughness={0.7} />
          </mesh>
        </group>
        <group ref={minute} position={[0, 0, 0.18]}>
          <mesh position={[0, FACE_R * 0.44, 0]}>
            <boxGeometry args={[0.11, FACE_R * 0.9, 0.08]} />
            <meshStandardMaterial color={INK} roughness={0.7} />
          </mesh>
        </group>
        <mesh position={[0, 0, 0.22]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.18, 0.18, 0.1, 12]} />
          <meshStandardMaterial color={TRIM} roughness={0.6} metalness={0.3} />
        </mesh>
      </group>
    </group>
  )
}
