import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree, type ThreeEvent } from '@react-three/fiber'
import { Group, MeshStandardMaterial, type Object3D } from 'three'
import { easing } from 'maath'
import { Label } from './Label'
import { bodyColor, roofColor } from './lib/cityTheme'
import type { BuildingDef } from './lib/cityModel'
import type { Project, RoofStyle } from '../types'

interface BuildingProps {
  def: BuildingDef
  hovered: boolean
  onHover: (id: string | null) => void
  onSelect: (project: Project, object: Object3D) => void
}

interface Tier {
  size: [number, number, number]
  y: number
}

function massing(w: number, height: number, roof: RoofStyle): Tier[] {
  if (roof === 'setback') {
    const h1 = height * 0.6
    const h2 = height * 0.28
    const h3 = height * 0.12
    const w2 = w * 0.72
    const w3 = w * 0.48
    return [
      { size: [w, h1, w], y: h1 / 2 },
      { size: [w2, h2, w2], y: h1 + h2 / 2 },
      { size: [w3, h3, w3], y: h1 + h2 + h3 / 2 },
    ]
  }
  // flat + pitched share a single box body
  return [{ size: [w, height, w], y: height / 2 }]
}

export function Building({ def, hovered, onHover, onSelect }: BuildingProps) {
  const { footprint: w, height, district, roofStyle, position, project } = def
  const liftRef = useRef<Group>(null)
  const gl = useThree((s) => s.gl)

  const baseEmissive = district === 'glass' ? 0.14 : 0.05
  const body = useMemo(() => {
    const m = new MeshStandardMaterial({
      color: bodyColor(district),
      roughness: district === 'glass' ? 0.42 : 0.88,
      metalness: district === 'glass' ? 0.18 : 0.0,
      emissive: district === 'glass' ? '#2b3742' : '#3a2f1e',
      emissiveIntensity: baseEmissive,
    })
    return m
  }, [district, baseEmissive])
  useEffect(() => () => body.dispose(), [body])

  const tiers = useMemo(() => massing(w, height, roofStyle), [w, height, roofStyle])
  const topWidth = tiers[tiers.length - 1].size[0]
  const roofH = w * 0.5
  const signY =
    roofStyle === 'pitched' ? height + roofH + 2.0 : height + 3.0

  useFrame((_, dt) => {
    if (liftRef.current) easing.damp(liftRef.current.position, 'y', hovered ? 1.8 : 0, 0.12, dt)
    easing.damp(body, 'emissiveIntensity', hovered ? baseEmissive + 0.32 : baseEmissive, 0.12, dt)
  })

  return (
    <group
      position={position}
      onPointerOver={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation()
        onHover(project.id)
        gl.domElement.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        onHover(null)
        gl.domElement.style.cursor = ''
      }}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation()
        onSelect(project, e.eventObject)
      }}
    >
      <group ref={liftRef}>
        {/* footing — grounds the tower */}
        <mesh position={[0, 0.3, 0]} receiveShadow>
          <boxGeometry args={[w * 1.08, 0.6, w * 1.08]} />
          <meshStandardMaterial color="#9a9488" roughness={0.95} />
        </mesh>

        {/* massing */}
        {tiers.map((t, i) => (
          <mesh key={i} position={[0, t.y, 0]} material={body} castShadow receiveShadow>
            <boxGeometry args={t.size} />
          </mesh>
        ))}

        {/* roofline */}
        {roofStyle === 'pitched' ? (
          <mesh position={[0, height + roofH / 2, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
            <coneGeometry args={[w * 0.74, roofH, 4]} />
            <meshStandardMaterial color={roofColor('warm')} roughness={0.9} />
          </mesh>
        ) : (
          <>
            <mesh position={[0, height + 0.25, 0]} castShadow>
              <boxGeometry args={[topWidth * 1.06, 0.5, topWidth * 1.06]} />
              <meshStandardMaterial color={roofColor(district)} roughness={0.8} />
            </mesh>
            {district === 'glass' && height > 20 && (
              <mesh position={[topWidth * 0.18, height + 1.3, -topWidth * 0.12]} castShadow>
                <boxGeometry args={[topWidth * 0.4, 1.6, topWidth * 0.4]} />
                <meshStandardMaterial color="#8a939c" roughness={0.7} />
              </mesh>
            )}
          </>
        )}

        <Label project={project} y={signY} footprint={w} />
      </group>
    </group>
  )
}
