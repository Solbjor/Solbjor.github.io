import { useEffect, useRef, useState } from 'react'
import { CommsAudio } from '../lib/commsAudio'
import { WATCHES, type Watch } from '../lib/useWatch'

function AudioKey() {
  const [on, setOn] = useState(false)
  const engine = useRef<CommsAudio | null>(null)

  useEffect(() => () => engine.current?.stop(), [])

  const toggle = () => {
    engine.current ??= new CommsAudio()
    if (on) engine.current.stop()
    else engine.current.start()
    setOn(!on)
  }

  return (
    <button type="button" className="key key-small audio-key" title="Toggle radio communications and console button sounds" aria-pressed={on} onClick={toggle}>
      <span className={`lamp ${on ? 'lamp-landed' : 'lamp-complete'}`} aria-hidden="true" />
      Comms audio {on ? 'on' : 'off'}
    </button>
  )
}

interface Props {
  watch: Watch
  onWatch: (w: Watch) => void
}

export function Header({ watch, onWatch }: Props) {
  return (
    <header className="room-head">
      <span className="plate">
        <span className="plate-sun" aria-hidden="true" />
        Sol <span aria-hidden="true">·</span> Home
      </span>

      <div className="head-controls">
      <AudioKey />
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
      </div>
    </header>
  )
}
