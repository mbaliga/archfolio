import { Suspense, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Loader } from '@react-three/drei'
import { CameraRig, DEFAULT_CAMERA_TUPLE, type FocusTarget } from './CameraRig'
import { CityWorld } from './CityWorld'
import { DayNight } from './DayNight'
import { Hero } from '../components/Hero'
import { WeatherClock } from '../components/WeatherClock'
import { useHyderabad } from '../lib/useHyderabad'
import type { Appearance, CameraCmd, LayerState, ViewMode, Project, Landmark } from '../types'

interface SceneProps {
  appearance: Appearance
  layers: LayerState
  view: ViewMode
  focus: FocusTarget | null
  cameraCmd: CameraCmd | null
  onSelect: (project: Project, rect: DOMRect) => void
  onSelectLandmark: (landmark: Landmark, rect: DOMRect) => void
}

export function Scene({ appearance, layers, view, focus, cameraCmd, onSelect, onSelectLandmark }: SceneProps) {
  const [docked, setDocked] = useState(false)
  const { time, weather } = useHyderabad()
  useEffect(() => {
    const t = setTimeout(() => setDocked(true), 2400)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="relative h-full w-full overflow-hidden bg-paper animate-[worldFadeIn_900ms_100ms_both]">
      <Canvas
        className="scene-canvas"
        shadows
        dpr={[1, 2]}
        camera={{ position: DEFAULT_CAMERA_TUPLE, fov: 40, near: 0.5, far: 2000 }}
      >
        {/* Lights, sky, and fog ease with Hyderabad time-of-day + weather. */}
        <DayNight weather={weather} view={view} />

        <Suspense fallback={null}>
          <CityWorld
            appearance={appearance}
            layers={layers}
            view={view}
            onSelect={onSelect}
            onSelectLandmark={onSelectLandmark}
          />
        </Suspense>

        <CameraRig focus={focus} cmd={cameraCmd} view={view} />
      </Canvas>

      <Loader />

      {/* DOM HUD over the canvas */}
      <Hero docked={docked} />
      <WeatherClock time={time} weather={weather} />
      <Hint />
    </div>
  )
}

function Hint() {
  return (
    <div className="pointer-events-none absolute bottom-5 left-1/2 z-[15] hidden -translate-x-1/2 items-center gap-[7px] whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.18em] text-ink-soft opacity-50 sm:flex">
      <span
        className="h-[5px] w-[5px] rounded-full bg-ink-soft"
        style={{ animation: 'pulseDot 1.8s ease-in-out infinite' }}
      />
      Drag to pan · Scroll to zoom · Right-drag to orbit · Click a building or landmark
    </div>
  )
}
