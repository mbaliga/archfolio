import { Text } from '@react-three/drei'
import interSemi from '@fontsource/inter/files/inter-latin-700-normal.woff'

const INK = '#1b1b1b'
const PAPER = '#fbf7ee'
const POST = '#6b6660'
const ARM_Y = 7.6
const ARM_LEN = 6.4
const ARM_OFF = 3.9

// In-world wayfinding: a fingerpost at the roundabout names the four avenues.
// Fixed-oriented (not billboarded) so the signs read as part of the city; each
// arm carries text on both faces so it's legible from either approach.
// Axis meaning: +X = complex, -X = simple, -Z = enterprise (away), +Z = consumer.
export function StreetSigns() {
  return (
    <group>
      {/* Post */}
      <mesh position={[0, 4.5, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.26, 9, 10]} />
        <meshStandardMaterial color={POST} roughness={0.6} metalness={0.3} />
      </mesh>
      <mesh position={[0, 9.1, 0]} castShadow>
        <sphereGeometry args={[0.34, 12, 10]} />
        <meshStandardMaterial color={POST} roughness={0.6} metalness={0.3} />
      </mesh>

      <ArmX name="Complex Way" dir={1} />
      <ArmX name="Simple Lane" dir={-1} />
      <ArmZ name="Enterprise Ave" dir={-1} />
      <ArmZ name="Consumer St" dir={1} />
    </group>
  )
}

// Arm extending along X; broad faces toward ±Z.
function ArmX({ name, dir }: { name: string; dir: 1 | -1 }) {
  return (
    <group position={[ARM_OFF * dir, ARM_Y, 0]}>
      <mesh castShadow>
        <boxGeometry args={[ARM_LEN, 0.95, 0.14]} />
        <meshStandardMaterial color={INK} roughness={0.7} />
      </mesh>
      <SignText name={name} position={[0, 0, 0.09]} rotationY={0} />
      <SignText name={name} position={[0, 0, -0.09]} rotationY={Math.PI} />
    </group>
  )
}

// Arm extending along Z; broad faces toward ±X.
function ArmZ({ name, dir }: { name: string; dir: 1 | -1 }) {
  return (
    <group position={[0, ARM_Y, ARM_OFF * dir]}>
      <mesh castShadow>
        <boxGeometry args={[0.14, 0.95, ARM_LEN]} />
        <meshStandardMaterial color={INK} roughness={0.7} />
      </mesh>
      <SignText name={name} position={[0.09, 0, 0]} rotationY={Math.PI / 2} />
      <SignText name={name} position={[-0.09, 0, 0]} rotationY={-Math.PI / 2} />
    </group>
  )
}

function SignText({
  name,
  position,
  rotationY,
}: {
  name: string
  position: [number, number, number]
  rotationY: number
}) {
  return (
    <Text
      font={interSemi}
      position={position}
      rotation={[0, rotationY, 0]}
      fontSize={0.6}
      maxWidth={ARM_LEN * 0.9}
      anchorX="center"
      anchorY="middle"
      color={PAPER}
      outlineWidth={0.012}
      outlineColor={INK}
    >
      {name}
    </Text>
  )
}
