import { EFFORT_RAMP, OWNERSHIP_COLORS } from '../scene/lib/cityTheme'
import type { MapLayer } from '../types'

// Legend for the active map layer, shown bottom-center.
export function Legend({ layer }: { layer: MapLayer }) {
  return (
    <div className="pointer-events-none absolute bottom-[58px] left-1/2 z-20 -translate-x-1/2 rounded-full border border-black/10 bg-white/90 px-[16px] py-[8px] shadow-[0_4px_18px_rgba(0,0,0,0.12)] backdrop-blur-md">
      {layer === 'effort' ? <EffortLegend /> : <OwnershipLegend />}
    </div>
  )
}

function EffortLegend() {
  return (
    <div className="flex items-center gap-[10px] text-[10px] font-medium text-ink-soft">
      <span className="font-mono uppercase tracking-[0.14em] text-ink">Effort</span>
      <span>Light</span>
      <span className="flex overflow-hidden rounded-[3px]">
        {EFFORT_RAMP.map((c) => (
          <span key={c} className="h-[12px] w-[16px]" style={{ background: c }} />
        ))}
      </span>
      <span>Heavy</span>
    </div>
  )
}

const OWNERSHIP_LABELS: Record<string, string> = {
  solo: 'Solo',
  lead: 'Lead',
  collab: 'Collab',
  support: 'Support',
}

function OwnershipLegend() {
  return (
    <div className="flex items-center gap-[12px] text-[10px] font-medium text-ink-soft">
      <span className="font-mono uppercase tracking-[0.14em] text-ink">Ownership</span>
      {Object.entries(OWNERSHIP_COLORS).map(([key, color]) => (
        <span key={key} className="flex items-center gap-[5px]">
          <span className="h-[11px] w-[11px] rounded-[2px]" style={{ background: color }} />
          {OWNERSHIP_LABELS[key]}
        </span>
      ))}
    </div>
  )
}
