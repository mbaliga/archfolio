import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { gridToScreen, quadrant, PAPER } from '../lib/iso'
import { PROJECTS, FILLER } from '../data/projects'
import { IsoTile } from './IsoTile'
import { RoadLayer } from './RoadLayer'
import { Hero } from './Hero'
import { AboutPanel } from './AboutPanel'
import type { GlyphName, Project } from '../types'

interface RenderTile {
  id: string
  gx: number
  gy: number
  scale: number
  glyph?: GlyphName
  kind: 'hub' | 'project' | 'filler'
  project?: Project
}

interface WorldProps {
  onSelect: (project: Project, rect: DOMRect) => void
}

export function World({ onSelect }: WorldProps) {
  const stageRef = useRef<HTMLDivElement>(null)
  const tileRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const drag = useRef({ active: false, startX: 0, startY: 0, ox: 0, oy: 0, moved: false })

  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const [hovered, setHovered] = useState<string | null>(null)
  const [docked, setDocked] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setDocked(true), 2400)
    return () => clearTimeout(t)
  }, [])

  const tiles = useMemo<RenderTile[]>(
    () => [
      { id: 'hub', gx: 0, gy: 0, scale: 0.9, glyph: 'sign', kind: 'hub' },
      ...PROJECTS.map((p) => ({
        id: p.id,
        gx: p.gx,
        gy: p.gy,
        scale: p.scale,
        glyph: p.glyph,
        kind: 'project' as const,
        project: p,
      })),
      ...FILLER.map((f) => ({
        id: f.id,
        gx: f.gx,
        gy: f.gy,
        scale: f.scale ?? 0.8,
        glyph: f.glyph,
        kind: 'filler' as const,
      })),
    ],
    [],
  )

  // Painter's order: tiles further back (high gx+gy) drawn first.
  const sorted = useMemo(() => [...tiles].sort((a, b) => b.gx + b.gy - (a.gx + a.gy)), [tiles])

  // Hover-driven jigsaw separation, pushing every tile radially away from the cursor.
  const updateSep = useCallback(
    (mx: number, my: number) => {
      tiles.forEach((t) => {
        const el = tileRefs.current[t.id]
        if (!el) return
        const { sx, sy } = gridToScreen(t.gx, t.gy)
        const dist = Math.hypot(t.gx, t.gy) || 1
        const rx = (t.gx - t.gy) / Math.max(0.5, dist)
        const ry = -(t.gx + t.gy) / (2 * Math.max(0.5, dist))
        const d = Math.hypot(sx - mx, sy - my)
        const sep = 4 + Math.max(0, 1 - d / 310) * 22
        el.style.setProperty('--ox', `${rx * sep}px`)
        el.style.setProperty('--oy', `${ry * sep}px`)
      })
    },
    [tiles],
  )

  const resetSep = useCallback(() => {
    Object.values(tileRefs.current).forEach((el) => {
      if (!el) return
      el.style.setProperty('--ox', '0px')
      el.style.setProperty('--oy', '0px')
    })
  }, [])

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (e.button !== 0 && e.pointerType !== 'touch') return
      drag.current = {
        active: true,
        startX: e.clientX,
        startY: e.clientY,
        ox: pan.x,
        oy: pan.y,
        moved: false,
      }
      e.currentTarget.setPointerCapture(e.pointerId)
    },
    [pan],
  )

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      const ds = drag.current
      const stage = stageRef.current
      if (!stage) return
      if (ds.active) {
        const dx = e.clientX - ds.startX
        const dy = e.clientY - ds.startY
        if (!ds.moved && Math.hypot(dx, dy) > 4) {
          ds.moved = true
          setDragging(true)
        }
        if (ds.moved) setPan({ x: ds.ox + dx, y: ds.oy + dy })
      } else {
        const rect = stage.getBoundingClientRect()
        updateSep(
          e.clientX - rect.left - rect.width / 2 - pan.x,
          e.clientY - rect.top - rect.height / 2 - pan.y,
        )
      }
    },
    [pan, updateSep],
  )

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    const ds = drag.current
    ds.active = false
    if (ds.moved) {
      setDragging(false)
      setTimeout(() => {
        ds.moved = false
      }, 0)
    }
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {
      /* capture may already be released */
    }
  }, [])

  const handleTileClick = useCallback(
    (tile: RenderTile) => {
      if (drag.current.moved || tile.kind !== 'project' || !tile.project) return
      const el = tileRefs.current[tile.id]
      if (!el) return
      onSelect(tile.project, el.getBoundingClientRect())
    },
    [onSelect],
  )

  return (
    <div
      ref={stageRef}
      className={`world-stage relative h-full w-full touch-none select-none overflow-hidden bg-paper animate-[worldFadeIn_900ms_100ms_both] ${
        dragging ? 'dragging' : ''
      }`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onPointerLeave={() => {
        setHovered(null)
        resetSep()
      }}
      onDoubleClick={() => setPan({ x: 0, y: 0 })}
    >
      {/* Ambient drifting clouds */}
      <Cloud top="11%" duration="74s" delay="-8s" />
      <Cloud top="22%" left="-280px" duration="98s" delay="-34s" opacity={0.55} />
      <Cloud top="68%" duration="118s" delay="-56s" opacity={0.38} />

      {/* Subtle paper grain */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            'radial-gradient(circle at 18% 12%, rgba(0,0,0,0.022), transparent 38%), radial-gradient(circle at 82% 88%, rgba(0,0,0,0.028), transparent 38%)',
        }}
      />

      {/* Panning camera */}
      <div
        className="absolute left-1/2 top-1/2 h-0 w-0"
        style={{ transform: `translate(${pan.x}px, ${pan.y}px)`, willChange: 'transform' }}
      >
        <RoadLayer />

        {sorted.map((tile) => {
          const { sx, sy } = gridToScreen(tile.gx, tile.gy)
          const isProject = tile.kind === 'project'
          const lift = hovered === tile.id ? 22 : 0
          const base = Math.round(-(tile.gx + tile.gy) * 10 + 500) + (isProject ? 1 : 0)
          const z = hovered === tile.id ? base + 1000 : base
          return (
            <div
              key={tile.id}
              ref={(el) => {
                tileRefs.current[tile.id] = el
              }}
              className="iso-tile"
              style={
                {
                  '--sx': `${sx}px`,
                  '--sy': `${sy}px`,
                  '--lift': `${lift}px`,
                  zIndex: z,
                  cursor: isProject ? 'pointer' : 'default',
                } as React.CSSProperties
              }
              onPointerEnter={() => {
                if (isProject && !drag.current.active) setHovered(tile.id)
              }}
              onPointerLeave={() => setHovered(null)}
              onClick={() => handleTileClick(tile)}
            >
              {/* Soft ground shadow */}
              <div
                className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[100px] w-[200px] transition-opacity duration-300"
                style={{
                  transform: `translate(-50%, -50%) translateY(20px) scale(${0.85 * tile.scale})`,
                  background: 'radial-gradient(ellipse, rgba(0,0,0,0.22), transparent 65%)',
                  opacity: hovered === tile.id ? 0.5 : 0.3,
                }}
              />
              <IsoTile
                biome={tile.kind === 'hub' ? undefined : quadrant(tile.gx, tile.gy)}
                fill={tile.kind === 'hub' ? PAPER : undefined}
                glyph={tile.glyph}
                size={tile.scale}
                isHub={tile.kind === 'hub'}
              />
              {isProject && tile.project && (
                <div
                  className="pointer-events-none absolute left-1/2 top-1/2 whitespace-nowrap text-center font-mono font-semibold uppercase tracking-[0.1em] text-ink"
                  style={{
                    fontSize: `${9 + tile.scale * 1.6}px`,
                    transform: 'translate(-50%, calc(-50% - 5px))',
                    textShadow: '0 1px 2px rgba(255,255,255,0.8), 0 0 8px rgba(255,255,255,0.6)',
                  }}
                >
                  {tile.project.label}
                  <span className="mt-0.5 block text-[7.5px] font-medium tracking-[0.12em] opacity-55">
                    {tile.project.sub}
                  </span>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Axis corner labels */}
      <div className="absolute left-1/2 top-5 z-10 flex -translate-x-1/2 items-center gap-[5px] font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-soft opacity-[0.55]">
        <span>↑</span> Enterprise
      </div>
      <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 items-center gap-[5px] font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-soft opacity-[0.55]">
        Consumer <span>↓</span>
      </div>
      <div className="absolute left-6 top-1/2 z-10 flex origin-left -translate-y-1/2 -rotate-90 items-center gap-[5px] font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-soft opacity-[0.55]">
        <span>←</span> Simple
      </div>
      <div className="absolute right-6 top-1/2 z-10 flex origin-right -translate-y-1/2 rotate-90 items-center gap-[5px] font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-soft opacity-[0.55]">
        Complex <span>→</span>
      </div>

      <Hero docked={docked} />
      <AboutPanel />

      <div className="absolute bottom-6 left-7 z-[15] flex items-center gap-[7px] font-mono text-[9px] uppercase tracking-[0.18em] text-ink-soft opacity-50">
        <span
          className="h-[5px] w-[5px] rounded-full bg-ink-soft"
          style={{ animation: 'pulseDot 1.8s ease-in-out infinite' }}
        />
        Drag to pan · Double-click to recentre · Click a tile to explore
      </div>
    </div>
  )
}

function Cloud({
  top,
  left,
  duration,
  delay,
  opacity = 0.5,
}: {
  top: string
  left?: string
  duration: string
  delay: string
  opacity?: number
}) {
  return (
    <div
      className="pointer-events-none absolute h-[28px] w-[120px] rounded-full bg-white/50 blur-[2.5px]"
      style={{
        top,
        left: left ?? '0px',
        opacity,
        animationName: 'drift',
        animationTimingFunction: 'linear',
        animationIterationCount: 'infinite',
        animationDuration: duration,
        animationDelay: delay,
      }}
    />
  )
}
