import { useState } from 'react'
import { World } from './components/World'
import { ProjectOverlay } from './components/ProjectOverlay'
import type { Project } from './types'

export default function App() {
  const [overlay, setOverlay] = useState<{ project: Project; rect: DOMRect } | null>(null)

  return (
    <div className="h-full">
      <World onSelect={(project, rect) => setOverlay({ project, rect })} />
      {overlay && (
        <ProjectOverlay
          project={overlay.project}
          tileRect={overlay.rect}
          onClose={() => setOverlay(null)}
        />
      )}
    </div>
  )
}
