export interface Track {
  /** File served from public/music/ — referenced as /music/<file>. */
  file: string
  title: string
  artist: string
}

// Prachi's playlist. Drop audio files into public/music/ and list them here;
// each plays in order (the player advances on track end). The entry below is a
// placeholder demo tone — replace it with the real tracks + song/artist labels.
export const PLAYLIST: Track[] = [
  { file: 'demo-loop.wav', title: 'Ambient Sketch', artist: 'Demo track — replace in src/data/music.ts' },
]
