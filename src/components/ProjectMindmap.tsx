import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import type { ProjectMindmap } from '../data/mindmaps'

/**
 * <ProjectMindmapView> — an interactive map of a project that has no written
 * case study. The project sits at the centre; six branches (brief, users,
 * role, what was designed, the hard part, outcome) radiate out. Tapping a
 * branch fans out its leaves along drawn-in curves and fills the detail card
 * below, which also steps through the branches in order like a short story.
 *
 * Wide containers get the radial map; narrow ones (measured, not viewport-
 * based, since the overlay is narrower than the window) get a tappable tree
 * with the same data and interactions. Positions live in a fixed 1000×620
 * coordinate space: the SVG connectors use it directly and the HTML nodes are
 * placed at the matching percentages, so text stays real text at real sizes.
 */

const HUES = ['#5b4bde', '#0b7fd1', '#c2410c', '#1d8a6a', '#a8740a', '#be3d7a']
const VW = 1000
const VH = 620
const CX = VW / 2
const CY = VH / 2
const BR = { rx: 238, ry: 168 } // branch ring
const LR = { rx: 392, ry: 262 } // leaf ring
const SPREAD = 15 // degrees between sibling leaves

const at = (deg: number, r: { rx: number; ry: number }) => {
  const a = (deg * Math.PI) / 180
  return { x: CX + r.rx * Math.cos(a), y: CY + r.ry * Math.sin(a), cos: Math.cos(a) }
}

/** A gentle curve from a to b, bowed to one side for an organic feel. */
const curve = (ax: number, ay: number, bx: number, by: number, bow = 0.16) => {
  const mx = (ax + bx) / 2 - (by - ay) * bow
  const my = (ay + by) / 2 + (bx - ax) * bow
  return `M${ax.toFixed(1)} ${ay.toFixed(1)} Q${mx.toFixed(1)} ${my.toFixed(1)} ${bx.toFixed(1)} ${by.toFixed(1)}`
}

export function ProjectMindmapView({ title, map, accent }: { title: string; map: ProjectMindmap; accent: string }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(1000)
  const [active, setActive] = useState(0)
  const [all, setAll] = useState(false)
  // Bumped on every focus change so the fan-out animation replays.
  const [beat, setBeat] = useState(0)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const n = map.branches.length
  const narrow = width < 640
  const focus = (i: number) => {
    setAll(false)
    setActive(((i % n) + n) % n)
    setBeat((b) => b + 1)
  }
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault()
      focus(active + 1)
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault()
      focus(active - 1)
    }
  }

  const branch = map.branches[active]
  const hue = HUES[active % HUES.length]
  // Leaf chips scale with the container so they never spill past it.
  const chipMax = Math.min(172, width * 0.165)

  return (
    <div ref={wrapRef} className="mm" onKeyDown={onKey}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[13px] leading-[1.5] text-ink-soft">
          {narrow ? 'Tap a branch to open it.' : 'Tap a branch to explore it, or use the arrow keys.'}
        </p>
        <button
          type="button"
          onClick={() => {
            setAll((a) => !a)
            setBeat((b) => b + 1)
          }}
          aria-pressed={all}
          className="rounded-full border border-black/15 bg-white px-4 py-[7px] text-[13px] font-semibold text-ink transition-colors hover:border-black/40 aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-white"
        >
          {all ? 'Focus on one branch' : 'Show everything'}
        </button>
      </div>

      {narrow ? (
        // ---- tree: the same map, stacked for narrow screens ----
        <div className="mm-tree" role="group" aria-label={`${title}: project map`}>
          <div className="mm-tree__root" style={{ background: accent }}>
            {title}
          </div>
          <ol className="mt-3 flex flex-col gap-2">
            {map.branches.map((b, i) => {
              const h = HUES[i % HUES.length]
              const open = all || i === active
              return (
                <li key={b.label} className="mm-tree__item" style={{ ['--h' as string]: h }}>
                  <button
                    type="button"
                    className="mm-tree__btn"
                    aria-expanded={open}
                    onClick={() => focus(i)}
                  >
                    <span className="mm-dot" />
                    <span className="flex-1 text-left">{b.label}</span>
                    <span aria-hidden="true" className="mm-chev">
                      {open ? '−' : '+'}
                    </span>
                  </button>
                  {open && (
                    <div key={`${i}-${beat}`} className="mm-tree__body">
                      <p>{b.summary}</p>
                      <div className="mt-3 flex flex-wrap gap-[6px]">
                        {b.leaves.map((l, j) => (
                          <span key={l} className="mm-leaf mm-leaf--tree" style={{ animationDelay: `${j * 50}ms` }}>
                            {l}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </li>
              )
            })}
          </ol>
        </div>
      ) : (
        // ---- radial map ----
        <>
          <div className="mm-stage" role="group" aria-label={`${title}: project map. Use the arrow keys to move between branches.`}>
            <svg viewBox={`0 0 ${VW} ${VH}`} className="mm-svg" aria-hidden="true" focusable="false">
              <defs>
                <radialGradient id="mm-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor={accent} stopOpacity="0.16" />
                  <stop offset="100%" stopColor={accent} stopOpacity="0" />
                </radialGradient>
              </defs>
              <ellipse cx={CX} cy={CY} rx={LR.rx + 40} ry={LR.ry + 30} fill="url(#mm-glow)" />
              <ellipse cx={CX} cy={CY} rx={BR.rx} ry={BR.ry} className="mm-ring" />
              {map.branches.map((b, i) => {
                const ang = -90 + (i * 360) / n
                const p = at(ang, BR)
                const on = all || i === active
                const h = HUES[i % HUES.length]
                return (
                  <g key={b.label}>
                    <path d={curve(CX, CY, p.x, p.y)} className="mm-trunk" style={{ stroke: on ? h : undefined, opacity: on ? 1 : 0.55 }} />
                    {on &&
                      b.leaves.map((_, j) => {
                        const la = ang + (j - (b.leaves.length - 1) / 2) * SPREAD
                        const q = at(la, LR)
                        return (
                          <path
                            key={`${j}-${beat}`}
                            d={curve(p.x, p.y, q.x, q.y, 0.1)}
                            pathLength={1}
                            className="mm-twig"
                            style={{ stroke: h, animationDelay: `${j * 60}ms` }}
                          />
                        )
                      })}
                  </g>
                )
              })}
            </svg>

            {/* centre */}
            <div className="mm-center" style={{ background: accent, left: '50%', top: '50%' }}>
              {title}
            </div>

            {/* branches */}
            {map.branches.map((b, i) => {
              const ang = -90 + (i * 360) / n
              const p = at(ang, BR)
              const h = HUES[i % HUES.length]
              const on = all || i === active
              return (
                <button
                  key={b.label}
                  type="button"
                  className={`mm-branch${i === active && !all ? ' is-active' : ''}${on ? ' is-on' : ''}`}
                  style={{ left: `${(p.x / VW) * 100}%`, top: `${(p.y / VH) * 100}%`, ['--h' as string]: h }}
                  aria-pressed={i === active && !all}
                  onClick={() => focus(i)}
                >
                  <span className="mm-dot" />
                  {b.label}
                </button>
              )
            })}

            {/* leaves */}
            {map.branches.map((b, i) => {
              if (!(all || i === active)) return null
              const ang = -90 + (i * 360) / n
              const h = HUES[i % HUES.length]
              return b.leaves.map((l, j) => {
                const la = ang + (j - (b.leaves.length - 1) / 2) * SPREAD
                const q = at(la, LR)
                const side = q.cos > 0.28 ? 'r' : q.cos < -0.28 ? 'l' : 'c'
                return (
                  <span
                    key={`${i}-${j}-${beat}`}
                    className={`mm-leaf mm-leaf--${side}`}
                    style={{
                      left: `${(q.x / VW) * 100}%`,
                      top: `${(q.y / VH) * 100}%`,
                      maxWidth: chipMax,
                      ['--h' as string]: h,
                      animationDelay: `${120 + j * 60}ms`,
                    }}
                  >
                    {l}
                  </span>
                )
              })
            })}
          </div>

          {/* detail card: the open branch, with a guided next/previous */}
          <div className="mm-card" style={{ ['--h' as string]: all ? accent : hue }} aria-live="polite">
            {all ? (
              <p className="text-[15px] leading-[1.6] text-[#2a2622]">
                The whole project at once. Pick any branch to read it in detail.
              </p>
            ) : (
              <>
                <div className="flex items-center justify-between gap-3">
                  <p className="mm-card__label">
                    {String(active + 1).padStart(2, '0')} · {branch.label}
                  </p>
                  <div className="flex gap-2">
                    <button type="button" className="mm-step" aria-label="Previous branch" onClick={() => focus(active - 1)}>
                      ←
                    </button>
                    <button type="button" className="mm-step" aria-label="Next branch" onClick={() => focus(active + 1)}>
                      →
                    </button>
                  </div>
                </div>
                <p className="mt-2 text-[16px] leading-[1.6] text-[#2a2622]">{branch.summary}</p>
                <p className="mt-3 text-[13px] text-ink-soft">
                  Next: <b className="font-semibold text-ink">{map.branches[(active + 1) % n].label}</b>
                </p>
              </>
            )}
          </div>
        </>
      )}
    </div>
  )
}
