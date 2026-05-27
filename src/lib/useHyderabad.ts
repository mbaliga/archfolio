import { useEffect, useState } from 'react'
import { getHyderabadTime, type HyderabadClock } from './sky'
import { fetchHyderabadWeather, type Weather } from './weather'

// Drives the day/night + weather: ticks Hyderabad time for the HUD readout and
// polls Open-Meteo. Weather is best-effort — it stays null if the fetch fails.
export function useHyderabad(): { time: HyderabadClock; weather: Weather | null } {
  const [time, setTime] = useState<HyderabadClock>(() => getHyderabadTime())
  const [weather, setWeather] = useState<Weather | null>(null)

  useEffect(() => {
    const id = setInterval(() => setTime(getHyderabadTime()), 30_000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    let active = true
    const ctrl = new AbortController()
    const load = () =>
      fetchHyderabadWeather(ctrl.signal).then((w) => {
        if (active && w) setWeather(w)
      })
    load()
    const id = setInterval(load, 15 * 60_000)
    return () => {
      active = false
      ctrl.abort()
      clearInterval(id)
    }
  }, [])

  return { time, weather }
}
