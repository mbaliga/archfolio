import { useState } from 'react'
import { Scene } from './scene/Scene'
import { ProjectOverlay } from './components/ProjectOverlay'
import { PlaceOverlay } from './components/PlaceOverlay'
import type { Project, Landmark } from './types'

type Overlay =
  | { type: 'project'; project: Project; rect: DOMRect }
  | { type: 'landmark'; landmark: Landmark; rect: DOMRect }
  | null

export default function App() {
  const [overlay, setOverlay] = useState<Overlay>(null)

  return (
    <div className="h-full">
      <Scene
        onSelect={(project, rect) => setOverlay({ type: 'project', project, rect })}
        onSelectLandmark={(landmark, rect) => setOverlay({ type: 'landmark', landmark, rect })}
      />
      {overlay?.type === 'project' && (
        <ProjectOverlay
          project={overlay.project}
          tileRect={overlay.rect}
          onClose={() => setOverlay(null)}
        />
      )}
      {overlay?.type === 'landmark' && (
        <PlaceOverlay
          landmark={overlay.landmark}
          tileRect={overlay.rect}
          onClose={() => setOverlay(null)}
        />
      )}
    </div>
  )
}
