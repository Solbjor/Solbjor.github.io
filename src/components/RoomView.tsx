import { useRef, useState, useSyncExternalStore, type CSSProperties } from 'react'
import { profile } from '../data/content'
import { currentMission, missions, SOL, STATUS_LABEL, trajectoryPath, type Mission } from '../lib/missions'
import { PlanetMark } from './Planet'
import { Payloads } from './Payloads'
import { ProjectionCase, RoomArchitecture, Workstation } from './RoomHardware'
import './apollo.css'

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
  { id: 'missions', label: 'Missions', x: 390, y: 527, scale: 0.77 },
  { id: 'systems', label: 'Systems', x: 720, y: 527, scale: 0.77 },
  { id: 'training', label: 'Training', x: 1050, y: 527, scale: 0.77 },
  { id: 'payloads', label: 'Payloads', x: 445, y: 656, scale: 1.05 },
  { id: 'comms', label: 'Comms', x: 995, y: 656, scale: 1.05 },
]
const PAYLOAD_STATION = STATIONS[3]!

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
  const [stationOpen, setStationOpen] = useState(false)
  const workstation = useRef<HTMLDialogElement>(null)
  const narrow = useSyncExternalStore(subscribeNarrow, isNarrow, () => false)
  const selected = missions.find((m) => m.id === selectedId) ?? currentMission

  const select = (id: string) => {
    setSelectedId(id)
    setZoomed(true)
  }

  const enterPayloads = () => {
    workstation.current?.showModal()
    setStationOpen(true)
  }

  return (
    <section id="top" className="flight" aria-labelledby="flight-name">
      <div className="scene-frame">
      <div
        className={`scene${stationOpen ? ' scene-station-open' : ''}`}
        style={{ transformOrigin: `${PAYLOAD_STATION.x / W * 100}% ${PAYLOAD_STATION.y / H * 100}%` }}
      >
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
          {/* the room continues past the drawing so it fills any window */}
          <rect x="-4000" y="-4000" width="9440" height="4000" className="r-ceil" />
          <rect x="-4000" y="0" width="4000" height="740" className="r-wall" />
          <rect x="1440" y="0" width="4000" height="740" className="r-wall" />
          <rect x="-4000" y="736" width="9440" height="4000" className="r-console" />
          <rect x="-4000" y="726" width="9440" height="12" className="r-desk" />
          <RoomArchitecture />
          <ProjectionCase x={396} y={80} width={648} height={338} />
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

          <ProjectionCase x={166} y={100} width={210} height={270} />
          <ProjectionCase x={1064} y={100} width={210} height={270} />
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

          {STATIONS.map((station) => (
            <Workstation key={station.id} x={station.x} y={station.y} scale={station.scale} />
          ))}
          {/* your flight console */}
          <polygon points="0,736 1440,736 1440,900 0,900" className="r-console" />
          <rect x="0" y="726" width="1440" height="12" className="r-desk" />
        </svg>

        {/* stations: real navigation set into the consoles */}
        <nav aria-label="Stations" className="stations">
          {STATIONS.map((station) => {
            const bounds = at(station.x - 132 * station.scale, station.y - 83 * station.scale, 264 * station.scale, 145 * station.scale)
            return station.id === 'payloads' ? (
              <button key={station.id} type="button" className="station-hit" style={bounds} aria-haspopup="dialog" onClick={enterPayloads}>
                <span className="station-name station-name-interactive">{station.label}</span>
              </button>
            ) : (
              <a key={station.id} className="station-hit" style={bounds} href={`#${station.id}`}>
                <span className="station-name">{station.label}</span>
              </a>
            )
          })}
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
      </div>

      <button type="button" className="key mobile-payload-station" aria-haspopup="dialog" onClick={enterPayloads}>
        Open Payloads workstation
      </button>

      <dialog
        ref={workstation}
        className="station-dialog"
        aria-labelledby="payload-workstation-h"
        onClose={() => setStationOpen(false)}
      >
        <div className="station-closeup">
          <div className="rack-hardware" aria-hidden="true">
            <span className="rack-screw" />
            <span className="rack-vent" />
            <span className="rack-vent" />
            <span className="rack-screw" />
          </div>
          <div className="station-closeup-head">
            <h2 id="payload-workstation-h" className="placard">Payloads workstation</h2>
            <button type="button" className="key" autoFocus onClick={() => workstation.current?.close()}>
              Return to room
            </button>
          </div>
          {stationOpen && <Payloads workstation />}
        </div>
      </dialog>

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
