import { useEffect, useRef, useState } from 'react'
import { PLAYLIST } from '../data/music'

// Compact play/skip player pill (bottom-left, above Layers). Click-to-play
// satisfies the autoplay policy; the track advances when one ends.
export function MusicPlayer() {
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const has = PLAYLIST.length > 0

  useEffect(() => {
    const a = new Audio()
    a.preload = 'metadata'
    audioRef.current = a
    const onEnded = () => setIndex((n) => (n + 1) % PLAYLIST.length)
    a.addEventListener('ended', onEnded)
    return () => {
      a.pause()
      a.removeEventListener('ended', onEnded)
      audioRef.current = null
    }
  }, [])

  useEffect(() => {
    const a = audioRef.current
    if (!a || !has) return
    a.src = encodeURI(`/music/${PLAYLIST[index].file}`)
    a.load()
    if (playing) a.play().catch(() => setPlaying(false))
    // `playing` intentionally omitted: pause/resume of the same track is handled
    // by the toggle; this effect only re-targets the source when the track changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, has])

  if (!has) return null
  const track = PLAYLIST[index]

  const toggle = () => {
    const a = audioRef.current
    if (!a) return
    if (playing) {
      a.pause()
      setPlaying(false)
    } else {
      a.play().then(() => setPlaying(true)).catch(() => setPlaying(false))
    }
  }
  const next = () => setIndex((n) => (n + 1) % PLAYLIST.length)

  return (
    <div className="pointer-events-auto absolute bottom-[calc(1rem+env(safe-area-inset-bottom)+64px)] left-3 z-20 sm:bottom-[80px] sm:left-4">
      <div className="flex max-w-[232px] items-center gap-[10px] rounded-full border border-black/10 bg-white/85 px-[10px] py-[7px] shadow-[0_3px_14px_rgba(0,0,0,0.12)] backdrop-blur-md">
        <button
          onClick={toggle}
          aria-label={playing ? 'Pause' : 'Play'}
          className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-ink text-paper transition-transform hover:scale-105"
        >
          {playing ? <PauseIcon /> : <PlayIcon />}
        </button>
        <div className="min-w-0 flex-1 leading-tight">
          <div className="truncate text-[12px] font-semibold text-ink">{track.title}</div>
          <div className="truncate text-[10px] text-ink-soft">{track.artist}</div>
        </div>
        {PLAYLIST.length > 1 && (
          <button
            onClick={next}
            aria-label="Next track"
            className="flex h-6 w-6 flex-shrink-0 items-center justify-center text-ink-soft transition-colors hover:text-ink"
          >
            <NextIcon />
          </button>
        )}
      </div>
    </div>
  )
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[13px] w-[13px] translate-x-[1px]" fill="currentColor">
      <path d="M7 5l12 7-12 7V5z" />
    </svg>
  )
}
function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[13px] w-[13px]" fill="currentColor">
      <path d="M7 5h4v14H7zM13 5h4v14h-4z" />
    </svg>
  )
}
function NextIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[15px] w-[15px]" fill="currentColor">
      <path d="M6 5l9 7-9 7V5zM16 5h2.5v14H16z" />
    </svg>
  )
}
