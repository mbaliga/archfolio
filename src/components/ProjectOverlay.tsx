import { quadrant, BIOME } from '../lib/iso'
import type { Project } from '../types'
import { TakeoverShell } from './TakeoverShell'

interface ProjectOverlayProps {
  project: Project
  tileRect: DOMRect
  onClose: () => void
}

// Full-screen "takeover" for a project: the clicked building expands into an
// immersive project page.
export function ProjectOverlay({ project, tileRect, onClose }: ProjectOverlayProps) {
  const q = quadrant(project.gx, project.gy)
  const { fill: accent, label: qLabel } = BIOME[q]

  return (
    <TakeoverShell tileRect={tileRect} accent={accent} onClose={onClose}>
      <div className="mb-5 flex items-center gap-[10px] font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-ink-soft">
        <span className="h-[3px] w-[28px] flex-shrink-0 rounded-[2px] bg-current opacity-50" />
        {qLabel} · {project.sub}
      </div>
      <div className="mb-[10px] text-[clamp(42px,7vw,80px)] font-extrabold leading-none tracking-[-0.03em] text-ink">
        {project.label}
      </div>

      <div className="mb-12 mt-12 h-px bg-black/[0.08]" />

      <div className="mb-14 grid grid-cols-[1fr_1fr] items-start gap-16 max-[800px]:grid-cols-1">
        <div className="text-[17px] leading-[1.75] text-[#2a2622]">{project.desc}</div>
        <div className="flex flex-col gap-5">
          <div>
            <label className="mb-[6px] block font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-ink-soft">
              Disciplines
            </label>
            <div className="flex flex-wrap gap-[6px]">
              {project.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-black/[0.06] px-[10px] py-[5px] font-mono text-[10px] uppercase tracking-[0.08em] text-ink"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-[6px] block font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-ink-soft">
              Quadrant
            </label>
            <div className="text-[14px] leading-[1.5] text-[#2a2622]">{qLabel}</div>
          </div>
        </div>
      </div>

      {/* Image placeholders */}
      <div className="grid grid-cols-1 gap-[14px]">
        <Placeholder className="aspect-[16/9]">↗&nbsp;&nbsp;Project screenshots</Placeholder>
      </div>
      <div className="mt-[14px] grid grid-cols-2 gap-[14px]">
        <Placeholder className="aspect-[4/3]">↗&nbsp; Flows</Placeholder>
        <Placeholder className="aspect-[4/3]">↗&nbsp; Prototype</Placeholder>
      </div>
    </TakeoverShell>
  )
}

function Placeholder({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={[
        'flex items-center justify-center rounded-[10px]',
        'border border-black/[0.06] bg-black/[0.04]',
        'font-mono text-[10px] uppercase tracking-[0.14em] text-black/20',
        className ?? '',
      ].join(' ')}
    >
      {children}
    </div>
  )
}
