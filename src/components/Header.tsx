import { useEffect, useRef, useState } from 'react'
import { CommsAudio } from '../lib/commsAudio'
import { WATCHES, type Watch } from '../lib/useWatch'

function AudioKey({ onBoot }: { onBoot: () => void }) {
  const [on, setOn] = useState(false)
  const engine = useRef<CommsAudio | null>(null)
  const booted = useRef(false)

  useEffect(() => () => engine.current?.stop(), [])

  const toggle = () => {
    engine.current ??= new CommsAudio()
    if (on) {
      engine.current.stop()
    } else {
      engine.current.start(!booted.current)
      if (!booted.current) {
        booted.current = true
        onBoot()
      }
    }
    setOn(!on)
  }

  return (
    <button type="button" className="key key-small audio-key" title="Toggle CRT startup, console controls and radio audio" aria-pressed={on} onClick={toggle}>
      <span className={`lamp ${on ? 'lamp-landed' : 'lamp-complete'}`} aria-hidden="true" />
      Comms audio {on ? 'on' : 'off'}
    </button>
  )
}

export function TextureKey({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button type="button" className="key key-small texture-key" aria-label="Material textures"
      aria-pressed={enabled} onClick={onToggle}>
      Textures {enabled ? 'on' : 'off'}
    </button>
  )
}

interface Props {
  watch: Watch
  onWatch: (w: Watch) => void
  onAudioBoot: () => void
  textures: { enabled: boolean; onToggle: () => void }
}

export function Header({ watch, onWatch, textures, onAudioBoot }: Props) {
  return (
    <header className="room-head">
      <span className="plate">
        <span className="plate-sun" aria-hidden="true" />
        Sol <span aria-hidden="true">·</span> Home
      </span>

      <div className="head-controls">
      <AudioKey onBoot={onAudioBoot} />
      <TextureKey {...textures} />
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
