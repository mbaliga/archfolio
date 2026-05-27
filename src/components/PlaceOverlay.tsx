import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import type { Landmark, LandmarkKind } from '../types'

const KIND_META: Record<LandmarkKind, { eyebrow: string; heading: string }> = {
  cinema: { eyebrow: 'Cinema · Now showing', heading: 'On the marquee' },
  stadium: { eyebrow: 'Stadium · Box score', heading: 'Personal bests' },
  library: { eyebrow: 'Library · Currently reading', heading: 'On the shelf' },
  gallery: { eyebrow: 'Gallery · Latest works', heading: 'On the walls' },
  cafe: { eyebrow: 'Café · Right now', heading: 'Currently into' },
  music: { eyebrow: 'Music · On repeat', heading: 'Playlists' },
}

interface PlaceOverlayProps {
  landmark: Landmark
  onClose: () => void
}

// A compact, centred "place card" for a civic landmark — a stylised banner
// (gradient keyed to the accent + a faint kind silhouette) over a short list.
export function PlaceOverlay({ landmark, onClose }: PlaceOverlayProps) {
  const [open, setOpen] = useState(false)
  const meta = KIND_META[landmark.kind]

  useEffect(() => {
    let inner = 0
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setOpen(true))
    })
    return () => {
      cancelAnimationFrame(outer)
      cancelAnimationFrame(inner)
    }
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        setTimeout(onClose, 240)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const handleClose = () => {
    setOpen(false)
    setTimeout(onClose, 240)
  }

  return createPortal(
    <>
      <div
        onClick={handleClose}
        className="fixed inset-0 z-[45] transition-all duration-300"
        style={{
          background: open ? 'rgba(251,247,238,0.5)' : 'rgba(251,247,238,0)',
          backdropFilter: open ? 'blur(4px)' : 'none',
          pointerEvents: open ? 'auto' : 'none',
        }}
      />

      <div
        className="fixed left-1/2 top-1/2 z-[50] w-[min(440px,92vw)] transition-all duration-300 ease-[cubic-bezier(.4,0,.2,1)]"
        style={{ opacity: open ? 1 : 0, transform: `translate(-50%,-50%) scale(${open ? 1 : 0.92})` }}
      >
        <div className="relative overflow-hidden rounded-[20px] bg-paper shadow-[0_30px_80px_rgba(0,0,0,0.3)]">
          {/* Stylised banner */}
          <div
            className="relative h-[132px] overflow-hidden"
            style={{
              background: `linear-gradient(130deg, ${landmark.accent}, color-mix(in srgb, ${landmark.accent} 46%, #14110e))`,
            }}
          >
            <div
              className="absolute inset-0 opacity-[0.13]"
              style={{ backgroundImage: 'repeating-linear-gradient(135deg, #fff 0 2px, transparent 2px 12px)' }}
            />
            <div className="pointer-events-none absolute -right-4 -top-5 text-white/20">
              <KindIcon kind={landmark.kind} />
            </div>
            <div className="absolute inset-x-0 bottom-0 p-[18px]">
              <div className="mb-[6px] font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-white/75">
                {meta.eyebrow}
              </div>
              <div className="text-[30px] font-extrabold leading-none tracking-[-0.02em] text-white drop-shadow-[0_1px_10px_rgba(0,0,0,0.28)]">
                {landmark.label}
              </div>
            </div>
          </div>

          <button
            onClick={handleClose}
            aria-label="Close"
            className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/25 text-[18px] leading-none text-white backdrop-blur-sm transition-colors hover:bg-black/40"
          >
            ×
          </button>

          {/* Body */}
          <div className="max-h-[min(60vh,500px)] overflow-y-auto px-[20px] pb-[20px] pt-[15px]">
            <p className="text-[14px] leading-[1.6] text-[#2a2622]">{landmark.blurb}</p>
            <div className="mb-[8px] mt-[16px] font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-ink-soft">
              {meta.heading}
            </div>
            <ul className="flex flex-col">
              {landmark.items.map((it, i) => (
                <li
                  key={i}
                  className="flex items-baseline gap-3 border-b border-black/[0.07] py-[10px] last:border-b-0"
                >
                  <span className="font-mono text-[11px] tabular-nums text-ink-soft/50">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-[15px] font-semibold tracking-[-0.01em] text-ink">{it.primary}</span>
                  {it.secondary && <span className="text-[12px] text-ink-soft">— {it.secondary}</span>}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>,
    document.body,
  )
}

// Faint per-kind silhouette used as a banner watermark.
function KindIcon({ kind }: { kind: LandmarkKind }) {
  const cls = 'h-32 w-32'
  switch (kind) {
    case 'cinema':
      return (
        <svg viewBox="0 0 24 24" className={cls} fill="currentColor">
          <path d="M3 6h18v12H3z" opacity="0.5" />
          <path d="M3 6l4 4H4zM9 6l4 4h-3zM15 6l4 4h-3z" />
        </svg>
      )
    case 'stadium':
      return (
        <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="2">
          <ellipse cx="12" cy="12" rx="9" ry="6" />
          <ellipse cx="12" cy="12" rx="5" ry="3" />
        </svg>
      )
    case 'library':
      return (
        <svg viewBox="0 0 24 24" className={cls} fill="currentColor">
          <path d="M4 4h7v16H4zM13 4h7v16h-7z" opacity="0.65" />
          <path d="M4 9h7v2H4zM13 13h7v2h-7z" />
        </svg>
      )
    case 'gallery':
      return (
        <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="4" y="4" width="16" height="16" rx="1" />
          <path d="M7 15l3-4 3 3 2-2 2 3" />
        </svg>
      )
    case 'cafe':
      return (
        <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 8h11v5a5 5 0 01-5 5H10a5 5 0 01-5-5z" />
          <path d="M16 9h2.5a2 2 0 010 4H16" />
        </svg>
      )
    case 'music':
      return (
        <svg viewBox="0 0 24 24" className={cls} fill="currentColor">
          <path d="M9 5l10-2v11a3 3 0 11-2-2.8V6.5L11 7.8V18a3 3 0 11-2-2.8z" />
        </svg>
      )
  }
}
