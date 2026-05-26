import type { Landmark, LandmarkKind } from '../types'
import { TakeoverShell } from './TakeoverShell'

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
  tileRect: DOMRect
  onClose: () => void
}

// Full-screen "takeover" for a civic landmark — an "about Prachi" place.
export function PlaceOverlay({ landmark, tileRect, onClose }: PlaceOverlayProps) {
  const meta = KIND_META[landmark.kind]

  return (
    <TakeoverShell tileRect={tileRect} accent={landmark.accent} onClose={onClose}>
      <div className="mb-5 flex items-center gap-[10px] font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-ink-soft">
        <span
          className="h-[3px] w-[28px] flex-shrink-0 rounded-[2px]"
          style={{ background: landmark.accent }}
        />
        {meta.eyebrow}
      </div>
      <div className="mb-[10px] text-[clamp(42px,7vw,80px)] font-extrabold leading-none tracking-[-0.03em] text-ink">
        {landmark.label}
      </div>
      <p className="mt-4 max-w-[640px] text-[17px] leading-[1.7] text-[#2a2622]">{landmark.blurb}</p>

      <div className="mb-10 mt-12 h-px bg-black/[0.08]" />

      <label className="mb-[6px] block font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-ink-soft">
        {meta.heading}
      </label>
      <ul className="flex flex-col">
        {landmark.items.map((it, i) => (
          <li
            key={i}
            className="flex items-baseline gap-4 border-b border-black/[0.07] py-[14px]"
          >
            <span className="font-mono text-[12px] tabular-nums text-ink-soft opacity-50">
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className="text-[19px] font-semibold tracking-[-0.01em] text-ink">{it.primary}</span>
            {it.secondary && <span className="text-[14px] text-ink-soft">— {it.secondary}</span>}
          </li>
        ))}
      </ul>
    </TakeoverShell>
  )
}
