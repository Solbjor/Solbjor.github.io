import { useCallback, useEffect, useRef, useState } from 'react'
import { projects } from '../data/content'

const DWELL_MS = 6000

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function Payloads({ workstation = false }: { workstation?: boolean }) {
  const [index, setIndex] = useState(0)
  const [held, setHeld] = useState(prefersReducedMotion)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [hidden, setHidden] = useState(() => document.hidden)
  const [powered, setPowered] = useState(true)
  const [announce, setAnnounce] = useState('')
  const rootRef = useRef<HTMLElement>(null)
  const count = projects.length

  const go = useCallback(
    (next: number, speak: boolean) => {
      const i = (next + count) % count
      setIndex(i)
      if (speak) setAnnounce(`Payload ${i + 1} of ${count}: ${projects[i]!.name}`)
    },
    [count],
  )

  useEffect(() => {
    if (!powered || held || hidden || (!workstation && (hovered || focused))) return
    const t = window.setTimeout(() => go(index + 1, false), DWELL_MS)
    return () => window.clearTimeout(t)
  }, [index, held, hidden, hovered, focused, powered, workstation, go])

  useEffect(() => {
    const onVis = () => setHidden(document.hidden)
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  const p = projects[index]!

  return (
    <section
      id={workstation ? undefined : 'payloads'}
      ref={rootRef}
      className={workstation ? 'payload-hardware' : 'console console-wide'}
      data-powered={workstation ? powered : undefined}
      aria-labelledby={workstation ? 'payload-workstation-h' : 'payloads-h'}
      aria-roledescription="carousel"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(e) => {
        if (!rootRef.current?.contains(e.relatedTarget as Node)) setFocused(false)
      }}
      onKeyDown={(e) => {
        if (!powered || (e.target as HTMLElement).closest('input, textarea')) return
        if (e.key === 'ArrowRight') {
          e.preventDefault()
          go(index + 1, true)
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault()
          go(index - 1, true)
        }
      }}
    >
      {!workstation && <h2 id="payloads-h" className="placard">Payloads</h2>}

      <div className="payload-bay">
        <div className="glass glass-payload" role="group" aria-roledescription="slide" aria-label={powered ? `${index + 1} of ${count}: ${p.name}` : 'Video monitor off'}>
          {!powered ? null : p.image ? (
            <img key={p.name} src={p.image} alt={`${p.name} project image`} className="payload-img" />
          ) : (
            <div key={p.name} className="no-downlink">
              <div className="test-bars" aria-hidden="true" />
              <p>No downlink yet</p>
              <p className="no-downlink-sub">Screenshot pending</p>
            </div>
          )}
          {powered && (
            <span className="channel" aria-hidden="true">
              CH {index + 1}/{count}
              {held && <span className="hold-flag">Hold</span>}
            </span>
          )}
        </div>

        <div className={workstation ? 'glass payload-copy payload-monitor' : 'payload-copy'}>
          {powered && <>
            {workstation && <p className="payload-register">Project readout</p>}
            <h3 className="payload-name">{p.name}</h3>
            <p className="payload-desc">{p.description}</p>
            {p.award && (
              <p className="payload-award">
                <span className="lamp lamp-landed" aria-hidden="true" />
                {p.award}
              </p>
            )}
            {p.tags && (
              <ul className="tags" aria-label="Tags">
                {p.tags.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            )}
            {p.link && (
              <a className="key key-lit" href={p.link} target="_blank" rel="noopener noreferrer">
                Open {p.name}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            )}
          </>}
        </div>
      </div>

      <div className="payload-keys">
        {workstation && (
          <button type="button" className="key payload-power" aria-label="Console power" aria-pressed={powered} onClick={() => setPowered((on) => !on)}>
            <span className="power-toggle" aria-hidden="true" />
            Power {powered ? 'on' : 'off'}
          </button>
        )}
        <div className="channel-keys" role="group" aria-label="Choose a payload">
          {projects.map((proj, i) => (
            <button
              key={proj.name}
              type="button"
              className="key key-small"
              aria-pressed={i === index}
              disabled={!powered}
              onClick={() => go(i, true)}
            >
              {proj.name}
            </button>
          ))}
        </div>
        <div className="transport" role="group" aria-label="Carousel controls">
          <button type="button" className="key" disabled={!powered} onClick={() => go(index - 1, true)}>
            Prev
          </button>
          <button type="button" className="key" disabled={!powered} aria-pressed={held} onClick={() => setHeld((h) => !h)}>
            Hold
          </button>
          <button type="button" className="key" disabled={!powered} onClick={() => go(index + 1, true)}>
            Next
          </button>
        </div>
      </div>
      <p className="sr-only" aria-live="polite">
        {announce}
      </p>
    </section>
  )
}
