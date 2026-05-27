import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Color, DoubleSide, Mesh, MeshBasicMaterial, ShaderMaterial } from 'three'
import { MOUNTAIN, WATER } from './lib/cityTheme'

// Back-left hero peak (inside the fog ring) with a stylised falling-water ribbon
// down its camera-facing slope and a rippling pool at the base.
const POS: [number, number, number] = [-86, 0, -76]
const M_H = 82
const M_R = 44

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`
const FRAG = /* glsl */ `
  precision mediump float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec3 uColor;
  float hash(float x) { return fract(sin(x * 127.1) * 43758.5453); }
  void main() {
    float x = vUv.x, y = vUv.y;
    float lane = floor(x * 7.0);
    float speed = 0.55 + hash(lane) * 0.3;
    float v = fract(y * 5.0 + uTime * speed + hash(lane) * 3.0);
    float streak = smoothstep(0.0, 0.45, v) * smoothstep(1.0, 0.55, v);
    vec3 col = mix(uColor, vec3(1.0), streak * 0.65 + (1.0 - y) * 0.12);
    float alpha = 0.5 + streak * 0.4;
    alpha *= smoothstep(0.0, 0.06, x) * smoothstep(1.0, 0.94, x); // feather sides
    alpha *= smoothstep(1.0, 0.85, y);                            // soften the crest
    gl_FragColor = vec4(col, alpha);
  }
`

function ripple(m: Mesh | null, p: number) {
  if (!m) return
  const s = 2 + p * 9
  m.scale.set(s, s, 1)
  ;(m.material as MeshBasicMaterial).opacity = (1 - p) * 0.4
}

export function Waterfall() {
  const mat = useRef<ShaderMaterial>(null)
  const r1 = useRef<Mesh>(null)
  const r2 = useRef<Mesh>(null)
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uColor: { value: new Color(WATER) } }), [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (mat.current) mat.current.uniforms.uTime.value = t
    ripple(r1.current, (t % 3) / 3)
    ripple(r2.current, ((t + 1.5) % 3) / 3)
  })

  return (
    <group position={POS}>
      {/* the peak */}
      <mesh position={[0, M_H / 2, 0]} rotation={[0, 0.4, 0]}>
        <coneGeometry args={[M_R, M_H, 7]} />
        <meshStandardMaterial color={MOUNTAIN[1]} roughness={1} flatShading />
      </mesh>

      {/* falling-water ribbon, laid along the front slope */}
      <mesh position={[0, 35.7, 26.5]} rotation={[-0.492, 0, 0]}>
        <planeGeometry args={[11, 62]} />
        <shaderMaterial
          ref={mat}
          uniforms={uniforms}
          vertexShader={VERT}
          fragmentShader={FRAG}
          transparent
          depthWrite={false}
          side={DoubleSide}
        />
      </mesh>

      {/* pool */}
      <mesh position={[0, 0.3, 42]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[12, 36]} />
        <meshStandardMaterial color={WATER} transparent opacity={0.55} roughness={0.3} metalness={0.1} />
      </mesh>
      <mesh ref={r1} position={[0, 0.36, 42]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.78, 1, 28]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0} depthWrite={false} />
      </mesh>
      <mesh ref={r2} position={[0, 0.36, 42]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.78, 1, 28]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  )
}
