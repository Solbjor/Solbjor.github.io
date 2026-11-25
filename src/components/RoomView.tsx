import { useState, useSyncExternalStore, type CSSProperties } from 'react'
import { profile } from '../data/content'
import { currentMission, missions, SOL, STATUS_LABEL, trajectoryPath, type Mission } from '../lib/missions'
import { PlanetMark } from './Planet'

// The scene is drawn on a 1440 x 900 canvas; HTML overlays use the same coordinates.
const W = 1440
const H = 900
const at = (x: number, y: number, w?: number, h?: number): CSSProperties => ({
  left: `${(x / W) * 100}%`,
  top: `${(y / H) * 100}%`,
  ...(w !== undefined && { width: `${(w / W) * 100}%` }),
  ...(h !== undefined && { height: `${(h / H) * 100}%` }),
})

const STATIONS = [
  { id: 'missions', label: 'Missions', x: 470, y: 488, w: 160 },
  { id: 'payloads', label: 'Payloads', x: 720, y: 488, w: 160 },
  { id: 'systems', label: 'Systems', x: 970, y: 488, w: 160 },
  { id: 'training', label: 'Training', x: 400, y: 606, w: 200 },
  { id: 'comms', label: 'Comms', x: 1040, y: 606, w: 200, lit: true },
]

const ORBITS = missions.map((m) => Math.hypot(m.x - SOL.x, m.y - SOL.y))

// On phones the room is cropped to the front wall so the big screen reads at a usable size.
const NARROW = '(max-width: 720px)'
function subscribeNarrow(cb: () => void) {
  const mq = window.matchMedia(NARROW)
  mq.addEventListener('change', cb)
  return () => mq.removeEventListener('change', cb)
}
const isNarrow = () => window.matchMedia(NARROW).matches

// Zooming the front screen onto one planet: scale around the planet, clamped to the plot.
const PLOT_W = 960
const PLOT_H = 495
function zoomTransform(m: Mission, ZOOM: number, centerY = 0.5) {
  const tx = Math.min(0, Math.max(PLOT_W - PLOT_W * ZOOM, PLOT_W / 2 - m.x * ZOOM))
  const ty = Math.min(0, Math.max(PLOT_H - PLOT_H * ZOOM, PLOT_H * centerY - m.y * ZOOM))
  return `translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px) scale(${ZOOM})`
}

// Deep link: ?mission=<id> opens the front screen zoomed on that mission.
function linkedMission(): string | null {
  const id = new URLSearchParams(window.location.search).get('mission')
  return id && missions.some((m) => m.id === id) ? id : null
}

export function RoomView() {
  const [selectedId, setSelectedId] = useState(() => linkedMission() ?? currentMission.id)
  const [zoomed, setZoomed] = useState(() => linkedMission() !== null)
  const narrow = useSyncExternalStore(subscribeNarrow, isNarrow, () => false)
  const selected = missions.find((m) => m.id === selectedId) ?? currentMission

  const select = (id: string) => {
    setSelectedId(id)
    setZoomed(true)
  }

  return (
    <section id="top" className="flight" aria-labelledby="flight-name">
      <div className="scene">
        <svg
          viewBox={narrow ? '300 40 840 540' : `0 0 ${W} ${H}`}
          className="scene-art"
          role="img"
          aria-label="Mission control room seen from the back row. The front-wall screen plots Andrew's career trajectory, landed at his current mission."
        >
          <defs>
            <pattern id="scan" width="4" height="3" patternUnits="userSpaceOnUse">
              <rect width="4" height="1" y="2" className="r-scan" />
            </pattern>
          </defs>
          {/* room shell, one-point perspective */}
          <polygon points="0,0 1440,0 1300,56 140,56" className="r-ceil" />
          <polygon points="0,0 140,56 140,470 0,900" className="r-wall" />
          <polygon points="1440,0 1300,56 1300,470 1440,900" className="r-wall" />
          <polygon points="140,470 1300,470 1440,900 0,900" className="r-floor" />
          <rect x="140" y="56" width="1160" height="414" className="r-front" />
          <g className="r-lights">
            {[300, 560, 880, 1140].map((x) => (
              <rect key={x} x={x - 50} y="20" width="100" height="10" rx="2" />
            ))}
          </g>

          {/* main screen: the trajectory */}
          <rect x="396" y="80" width="648" height="338" rx="8" className="r-glass" />
          <svg x="400" y="84" width="640" height="330" viewBox={`0 0 ${PLOT_W} ${PLOT_H}`} className="plot-screen">
            <clipPath id="screen-clip">
              <rect width={PLOT_W} height={PLOT_H} />
            </clipPath>
            <g clipPath="url(#screen-clip)">
            <g className={`plot-zoom${zoomed ? ' is-zoomed' : ''}`} style={{ transform: zoomed ? zoomTransform(selected, narrow ? 4.2 : 2.4, narrow ? 0.46 : 0.5) : 'none' }}>
            <g className="orbits">
              {ORBITS.map((r, i) => (
                <circle key={i} cx={SOL.x} cy={SOL.y} r={r} />
              ))}
            </g>
            <circle cx={SOL.x} cy={SOL.y} r={56} className="sol" />
            <text x={58} y={SOL.y + 5} className="plot-label sol-label">SOL</text>
            <path d={trajectoryPath(missions)} className="trajectory" pathLength={1} />
            {missions.map((m, i) => (
              // Pointer shortcut only: the mission list on the side screen is the keyboard/AT control.
              <g key={m.id} className="plot-hit" onClick={() => select(m.id)}>
                <PlanetMark m={m} selected={m.id === selected.id} />
                <text
                  x={m.status === 'landed' ? m.x + m.r + 24 : m.x}
                  y={m.status === 'landed' ? m.y + m.r + 58 : i % 2 === 1 || missions[i + 1]?.status === 'landed' ? m.y - m.r - 22 : m.y + m.r + 20}
                  textAnchor={m.status === 'landed' ? 'end' : 'middle'}
                  className={`plot-label${m.status === 'landed' ? ' plot-label-now' : ''}${m.id === selected.id ? ' plot-label-selected' : ''}`}
                >
                  {m.status === 'landed' ? `NOW · ${m.callsign.toUpperCase()}` : `${m.callsign.split(' ')[0]!.toUpperCase()} '${m.start.slice(-2)}`}
                </text>
              </g>
            ))}
            </g>
            </g>
          </svg>
          <rect x="400" y="84" width="640" height="330" fill="url(#scan)" className="r-scanlines" />

          {/* side screens (contents are HTML overlays) */}
          <rect x="166" y="100" width="210" height="270" rx="6" className="r-glass" />
          <rect x="1064" y="100" width="210" height="270" rx="6" className="r-glass" />
          <rect x="168" y="102" width="206" height="266" fill="url(#scan)" className="r-scanlines" />
          <rect x="1066" y="102" width="206" height="266" fill="url(#scan)" className="r-scanlines" />
          {/* status lamps beside each bezel */}
          <g className="r-lamps">
            {[180, 214, 248].map((x, i) => (
              <circle key={`l${x}`} cx={x} cy="386" r="5" className={i === 0 ? 'lamp-on' : 'lamp-off'} />
            ))}
            {[1192, 1226, 1260].map((x, i) => (
              <circle key={`r${x}`} cx={x} cy="386" r="5" className={i === 2 ? 'lamp-alert' : 'lamp-on'} />
            ))}
          </g>

          {/* console tiers */}
          <polygon points="300,478 1140,478 1172,528 268,528" className="r-desk" />
          <polygon points="150,588 1290,588 1340,664 100,664" className="r-desk" />
          {[318, 1062].map((x) => (
            <g key={x}>
              <rect x={x} y="484" width="60" height="22" rx="3" className="r-glass-sm" />
              <circle cx={x + 14} cy="495" r="4" className="lamp-on" />
              <circle cx={x + 30} cy="495" r="4" className="lamp-off" />
              <circle cx={x + 46} cy="495" r="4" className="lamp-on" />
            </g>
          ))}
          {[190, 640, 1140].map((x, i) => (
            <g key={x}>
              <rect x={x} y="598" width="110" height="34" rx="3" className="r-glass-sm" />
              <rect x={x + 10} y="606" width={60 - i * 12} height="5" className="r-trace" />
              <rect x={x + 10} y="616" width={42 + i * 14} height="5" className="r-trace" />
              <circle cx={x + 95} cy="615" r="4" className={i === 2 ? 'lamp-alert' : 'lamp-on'} />
            </g>
          ))}
          {/* your flight console */}
          <polygon points="0,736 1440,736 1440,900 0,900" className="r-console" />
          <rect x="0" y="726" width="1440" height="12" className="r-desk" />
        </svg>

        {/* stations: real navigation set into the consoles */}
        <nav aria-label="Stations" className="stations">
          {STATIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={`station${s.lit ? ' station-lit' : ''}`}
              style={at(s.x - s.w / 2, s.y, s.w)}
            >
              {s.label}
            </a>
          ))}
        </nav>

        {zoomed && (
          <button type="button" className="zoom-out" style={at(880, 372, 150)} onClick={() => setZoomed(false)}>
            <span className="zoom-out-long">Full trajectory</span>
            <span className="zoom-out-short">Full view</span>
          </button>
        )}

        <div className="side-screen side-left" style={at(166, 100, 210, 270)}>
          <Readout m={selected} />
        </div>
        <div className="side-screen side-right" style={at(1064, 100, 210, 270)}>
          <MissionList selectedId={selected.id} onSelect={select} />
        </div>

        <div className="ident" style={at(0, 746, W)}>
          <div>
            <h1 id="flight-name">{profile.name}</h1>
            <p className="flight-title">
              Software Engineer <span aria-hidden="true">·</span> Forward Deployed Engineer{' '}
              <span aria-hidden="true">·</span> Claude Corps Fellow
            </p>
          </div>
          <a className="key key-lit key-large open-comms" href="#comms">
            Open comms
          </a>
        </div>
      </div>

      {/* small screens: the side screens move below the scene */}
      <div className="scene-fallback">
        <div className="glass glass-readout">
          <Readout m={selected} />
        </div>
        <div className="glass glass-readout">
          <MissionList selectedId={selected.id} onSelect={select} />
          {zoomed && (
            <button type="button" className="key key-small fallback-zoom-out" onClick={() => setZoomed(false)}>
              Full trajectory
            </button>
          )}
        </div>
      </div>
    </section>
  )
}

function Readout({ m }: { m: Mission }) {
  return (
    <div className="readout" aria-live="polite">
      <p className={`status status-${m.status}`}>
        <span className={`lamp lamp-${m.status}`} aria-hidden="true" />
        {STATUS_LABEL[m.status]}
      </p>
      <p className="readout-role">{m.title}</p>
      <p className="readout-org">{m.placement ?? m.org}</p>
      <p className="readout-window">
        {m.start} – {m.end}
      </p>
      {m.location && <p className="readout-site">{m.location}</p>}
      <a className="readout-link" href={`#mission-${m.id}`}>
        Base report
      </a>
    </div>
  )
}

function MissionList({ selectedId, onSelect }: { selectedId: string; onSelect: (id: string) => void }) {
  return (
    <div className="mission-list" role="group" aria-label="Select a mission">
      <p className="mission-list-head">Missions flown</p>
      {[...missions].reverse().map((m) => (
        <button
          key={m.id}
          type="button"
          aria-pressed={m.id === selectedId}
          onClick={() => onSelect(m.id)}
        >
          <span className={`lamp lamp-${m.status}`} aria-hidden="true" />
          <span className="ml-name">{m.callsign}</span>
          <span className="ml-year">'{m.start.slice(-2)}</span>
        </button>
      ))}
    </div>
  )
}
