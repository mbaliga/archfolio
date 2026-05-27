import { Billboard, Text, useTexture } from '@react-three/drei'
import type { Project } from '../types'
import interBold from '@fontsource/inter/files/inter-latin-800-normal.woff'
import interSemi from '@fontsource/inter/files/inter-latin-700-normal.woff'

const INK = '#171717'
const PAPER = '#fbf7ee'

interface LabelProps {
  project: Project
  footprint: number
}

// A billboarded rooftop sign that always faces the camera. Swap seam: when a
// project has `logo`, the wordmark is replaced by the logo image — no other
// change needed. Positioned by the caller (a wrapping group owns its height).
export function Label({ project, footprint }: LabelProps) {
  const width = Math.max(footprint * 1.7, 6)
  return (
    <Billboard>
      {project.logo ? (
        <LogoBoard logo={project.logo} width={width} />
      ) : (
        <WordmarkBoard label={project.label} sub={project.sub} width={width} />
      )}
    </Billboard>
  )
}

function WordmarkBoard({ label, sub, width }: { label: string; sub: string; width: number }) {
  const h = width * 0.36
  return (
    <group>
      <mesh>
        <planeGeometry args={[width, h]} />
        <meshBasicMaterial color={INK} transparent opacity={0.92} toneMapped={false} />
      </mesh>
      <Text
        font={interBold}
        position={[0, h * 0.13, 0.03]}
        fontSize={h * 0.4}
        maxWidth={width * 0.9}
        anchorX="center"
        anchorY="middle"
        color={PAPER}
        outlineWidth={h * 0.01}
        outlineColor={INK}
      >
        {label}
      </Text>
      <Text
        font={interSemi}
        position={[0, -h * 0.28, 0.03]}
        fontSize={h * 0.15}
        maxWidth={width * 0.92}
        letterSpacing={0.14}
        anchorX="center"
        anchorY="middle"
        color={PAPER}
        fillOpacity={0.6}
      >
        {sub}
      </Text>
    </group>
  )
}

function LogoBoard({ logo, width }: { logo: string; width: number }) {
  const texture = useTexture(logo)
  const h = width * 0.5
  return (
    <mesh>
      <planeGeometry args={[width, h]} />
      <meshBasicMaterial map={texture} transparent toneMapped={false} />
    </mesh>
  )
}
