import { useCallback, useState } from 'react'

// The three room-lighting states. "mars" is the default (red-dark).
export const WATCHES = [
  { id: 'mars', label: 'Mars watch', hint: 'Red, dark' },
  { id: 'neptune', label: 'Neptune watch', hint: 'Blue, dark' },
  { id: 'day', label: 'Day shift', hint: 'Light' },
] as const

export type Watch = (typeof WATCHES)[number]['id']

const KEY = 'solbjor-watch'

function read(): Watch {
  const attr = document.documentElement.dataset.watch
  if (attr === 'mars' || attr === 'neptune' || attr === 'day') return attr
  return 'mars'
}

export function useWatch() {
  const [watch, setWatchState] = useState<Watch>(read)

  const setWatch = useCallback((next: Watch) => {
    document.documentElement.dataset.watch = next
    try {
      localStorage.setItem(KEY, next)
    } catch {
      // Storage can be unavailable (private mode); the choice still applies for this visit.
    }
    setWatchState(next)
  }, [])

  return { watch, setWatch }
}
