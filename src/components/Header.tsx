import { profile } from '../data/content'
import { WATCHES, type Watch } from '../lib/useWatch'

const SECTIONS = [
  { id: 'missions', label: 'Missions' },
  { id: 'payloads', label: 'Payloads' },
  { id: 'systems', label: 'Systems' },
  { id: 'training', label: 'Training' },
  { id: 'comms', label: 'Comms' },
]

interface Props {
  watch: Watch
  onWatch: (w: Watch) => void
}

export function Header({ watch, onWatch }: Props) {
  return (
    <header className="room-head">
      <a className="plate" href="#top" aria-label={`${profile.name}, back to top`}>
        <span className="plate-sun" aria-hidden="true" />
        Sol <span aria-hidden="true">·</span> Home
      </a>

      <nav aria-label="Consoles" className="head-nav">
        <ul>
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <a className="key" href={`#${s.id}`}>
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <fieldset className="watch-switch">
        <legend>Room lighting</legend>
        {WATCHES.map((w) => (
          <label key={w.id} className="watch-pos" title={w.hint}>
            <input
              type="radio"
              name="watch"
              value={w.id}
              checked={watch === w.id}
              onChange={() => onWatch(w.id)}
            />
            <span className="lamp" aria-hidden="true" />
            <span className="watch-name">{w.label}</span>
          </label>
        ))}
      </fieldset>
    </header>
  )
}
