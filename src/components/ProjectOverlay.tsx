import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { quadrant, BIOME } from '../lib/iso'
import type { Project } from '../types'

interface ProjectOverlayProps {
  project: Project
  /** Bounding rect of the clicked tile, so the card can expand from it. */
  tileRect: DOMRect
  onClose: () => void
}

// Full-screen "takeover": the clicked tile expands into an immersive project
// page, then collapses back when dismissed.
export function ProjectOverlay({ project, tileRect, onClose }: ProjectOverlayProps) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    // Two rAFs so the browser paints the collapsed start state before we
    // transition to the expanded one.
    let inner = 0
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setOpen(true))
    })
    return () => {
      cancelAnimationFrame(outer)
      cancelAnimationFrame(inner)
    }
  }, [])

  const handleClose = () => {
    setOpen(false)
    setTimeout(onClose, 650)
  }

  const q = quadrant(project.gx, project.gy)
  const { fill: accent, label: qLabel } = BIOME[q]

  const overlayStyle = open
    ? { top: 0, left: 0, width: '100%', height: '100%', borderRadius: 0 }
    : {
        top: tileRect.top,
        left: tileRect.left,
        width: Math.max(tileRect.width, 80),
        height: Math.max(tileRect.height, 60),
        borderRadius: 14,
      }

  return createPortal(
    <>
      {/* Frosted backdrop — click to close */}
      <div
        onClick={handleClose}
        className="fixed inset-0 z-[45] transition-all duration-[550ms]"
        style={{
          background: open ? 'rgba(251,247,238,0.55)' : 'rgba(251,247,238,0)',
          backdropFilter: open ? 'blur(4px)' : 'none',
          pointerEvents: open ? 'auto' : 'none',
        }}
      />

      {/* Expanding card */}
      <div
        className="fixed z-[50] overflow-hidden bg-paper transition-all duration-[600ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={overlayStyle}
      >
        {/* Accent colour bar */}
        <div
          className="absolute inset-x-0 top-0 h-[5px] transition-opacity duration-[400ms] delay-[200ms]"
          style={{ background: accent, opacity: open ? 1 : 0 }}
        />

        {/* Scrollable content */}
        <div
          className={[
            'absolute inset-0 overflow-y-auto overflow-x-hidden',
            'px-[min(10vw,96px)] pt-[88px] pb-[80px]',
            'transition-opacity duration-[360ms] delay-[320ms]',
            open ? 'opacity-100' : 'opacity-0',
          ].join(' ')}
        >
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
        </div>
      </div>

      {/* Close button */}
      <button
        onClick={handleClose}
        className={[
          'fixed right-[22px] top-[22px] z-[60] flex h-11 w-11 items-center justify-center',
          'rounded-[22px] border-none bg-ink/[0.09] text-[20px] leading-none text-ink',
          'transition-opacity duration-[360ms] delay-[320ms] hover:bg-ink/[0.16]',
          open ? 'opacity-100' : 'opacity-0',
        ].join(' ')}
        aria-label="Close project"
      >
        ×
      </button>
    </>,
    document.body,
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
