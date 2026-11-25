import { useRef, useState, useSyncExternalStore, type CSSProperties, type ReactNode } from 'react'
import { profile, projects, type Project } from '../data/content'
import { currentMission, STATUS_LABEL } from '../lib/missions'
import { jobPlanets, type TelemetryPlanet } from '../lib/telemetry'
import { EarthMap } from './EarthMap'
import { OrbitalTelemetry } from './OrbitalTelemetry'
import { Payloads } from './Payloads'
import { CONSOLE_BAY_OFFSET, ConsoleBank, ControllerChair, ProjectionCase, RoomArchitecture } from './RoomHardware'
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

const BANKS = [
  { x: 433, y: 477, scale: 0.65, bays: [{ id: 'missions', label: 'Missions' }, { id: null, label: 'Guidance' }] },
  { x: 1007, y: 477, scale: 0.65, bays: [{ id: 'systems', label: 'Systems' }, { id: 'training', label: 'Training' }] },
  { x: 409, y: 623, scale: 0.77, bays: [{ id: 'payloads', label: 'Payloads' }, { id: null, label: 'Telemetry' }] },
  { x: 1031, y: 623, scale: 0.77, bays: [{ id: null, label: 'Flight' }, { id: 'comms', label: 'Comms' }] },
]
const STATIONS = BANKS.flatMap(({ x, y, scale, bays }) =>
  bays.map((bay, index) => ({
    ...bay,
    x: x + (index === 0 ? -1 : 1) * CONSOLE_BAY_OFFSET * scale,
    y,
    scale,
  })),
)
const PAYLOAD_STATION = STATIONS.find(({ id }) => id === 'payloads')!

// On phones the room is cropped to the front wall so the big screen reads at a usable size.
const NARROW = '(max-width: 720px)'
function subscribeNarrow(cb: () => void) {
  const mq = window.matchMedia(NARROW)
  mq.addEventListener('change', cb)
  return () => mq.removeEventListener('change', cb)
}
const isNarrow = () => window.matchMedia(NARROW).matches

// Deep link: ?mission=<id> opens the solar screen with that mission route.
function linkedMission(): string | null {
  const id = new URLSearchParams(window.location.search).get('mission')
  return id && jobPlanets.some((planet) => planet.id === id) ? id : null
}

export function RoomView({ header }: { header: ReactNode }) {
  const [selectedId, setSelectedId] = useState(() => linkedMission() ?? currentMission.id)
  const [mode, setMode] = useState<'earth' | 'solar'>('solar')
  const [selectedProject, setSelectedProject] = useState(0)
  const [showRoute, setShowRoute] = useState(() => linkedMission() !== null)
  const [stationOpen, setStationOpen] = useState(false)
  const workstation = useRef<HTMLDialogElement>(null)
  const narrow = useSyncExternalStore(subscribeNarrow, isNarrow, () => false)
  const selected = jobPlanets.find((planet) => planet.id === selectedId)!
  const [orbitsPaused, setOrbitsPaused] = useState(false)
  const catalogProps = {
    selectedId, onSelect: select, orbitsPaused, setOrbitsPaused,
    clearRoute: mode === 'solar' && showRoute ? () => setShowRoute(false) : undefined,
  }
  const readout = mode === 'earth'
    ? <ProjectReadout project={projects[selectedProject]!} />
    : <Readout planet={selected} />
  const catalog = mode === 'earth'
    ? <ProjectCatalog selected={selectedProject} onSelect={setSelectedProject} />
    : <PlanetCatalog {...catalogProps} />

  function select(id: string) {
    setSelectedId(id)
    setMode('solar')
    setShowRoute(true)
  }

  const enterPayloads = () => {
    workstation.current?.showModal()
    setStationOpen(true)
  }

  return (
    <section id="top" className="flight" aria-labelledby="flight-name">
      <div className="flight-viewport">
      {header}
      <div className="scene-frame">
      <div
        className={`scene${stationOpen ? ' scene-station-open' : ''}`}
        style={{ transformOrigin: `${PAYLOAD_STATION.x / W * 100}% ${PAYLOAD_STATION.y / H * 100}%` }}
      >
        <svg
          viewBox={narrow ? '300 40 840 540' : `0 0 ${W} ${H}`}
          preserveAspectRatio={narrow ? 'xMidYMid slice' : 'none'}
          className="scene-art"
          role="img"
          aria-label="Mission control room seen from the back row. The front-wall screen shows either a Mercator Earth map or a solar system with Andrew's job planets."
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
          <svg x="400" y="84" width="640" height="330" viewBox="0 0 960 495" className="plot-screen">
            {mode === 'earth'
              ? <EarthMap selectedProject={selectedProject} onSelect={setSelectedProject} />
              : <OrbitalTelemetry selected={selected} showRoute={showRoute} paused={orbitsPaused} onSelect={select} />}
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

          {BANKS.map((bank) => (
            <ConsoleBank key={bank.bays[0]?.label} x={bank.x} y={bank.y} scale={bank.scale} />
          ))}
          {STATIONS.map((station) => (
            <ControllerChair key={station.label} x={station.x} y={station.y + 43 * station.scale} scale={station.scale} />
          ))}
          {/* your flight console */}
          <polygon points="0,736 1440,736 1440,900 0,900" className="r-console" />
          <rect x="0" y="726" width="1440" height="12" className="r-desk" />
        </svg>

        {/* stations: real navigation set into the consoles */}
        <nav aria-label="Stations" className="stations">
          {STATIONS.map((station) => {
            const bounds = at(station.x - CONSOLE_BAY_OFFSET * station.scale, station.y - 83 * station.scale, 2 * CONSOLE_BAY_OFFSET * station.scale, 145 * station.scale)
            if (station.id === null) {
              return <span key={station.label} className="station-hit station-passive" style={bounds} aria-hidden="true">
                <span className="station-name">{station.label}</span>
              </span>
            }
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

        <div className="telemetry-modes" role="group" aria-label="Main telemetry screen mode">
          <button type="button" className="key key-small" aria-pressed={mode === 'earth'} onClick={() => setMode('earth')}>Earth map</button>
          <button type="button" className="key key-small" aria-pressed={mode === 'solar'} onClick={() => setMode('solar')}>Solar system</button>
        </div>

        <div className="side-screen side-left" style={at(166, 100, 210, 270)}>
          {readout}
        </div>
        <div className="side-screen side-right" style={at(1064, 100, 210, 270)}>
          {catalog}
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
        <div className="room-startup" aria-hidden="true">
          <div className="startup-bezel">
            <div className="startup-crt">
              <span>FLIGHT CONTROL</span>
              <span>PROJECTOR CHECK</span>
              <span>TELEMETRY ONLINE</span>
            </div>
            <i className="startup-lamp" />
          </div>
        </div>
      </div>

      <button type="button" className="key mobile-payload-station" aria-haspopup="dialog" onClick={enterPayloads}>
        Open Payloads workstation
      </button>
      </div>

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
          {readout}
        </div>
        <div className="glass glass-readout">
          {catalog}
        </div>
      </div>
    </section>
  )
}

function ProjectReadout({ project }: { project: Project }) {
  return (
    <div className="readout" aria-live="polite">
      <p className="status">Project</p>
      <p className="readout-role">{project.name}</p>
      <p className="project-map-summary">{project.description}</p>
      <a className="readout-link" href={project.link ?? '#payloads'}>
        {project.link ? 'Project details' : 'Payloads gallery'}
      </a>
    </div>
  )
}

function ProjectCatalog({ selected, onSelect }: { selected: number; onSelect: (index: number) => void }) {
  return (
    <div className="mission-list">
      <p className="mission-list-head">Projects</p>
      <div role="group" aria-label="Select a project">
        {projects.map((project, index) => (
          <button key={project.name} type="button" aria-pressed={index === selected} onClick={() => onSelect(index)}>
            {project.mapMarker && <span className="ml-year" aria-hidden="true">{index + 1}</span>}
            <span className="ml-name">{project.name}</span>
          </button>
        ))}
      </div>
      <p className="project-map-note">Illustrative marker locations</p>
    </div>
  )
}

function Readout({ planet }: { planet: TelemetryPlanet }) {
  const m = planet.mission
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

function PlanetCatalog({ selectedId, onSelect, orbitsPaused, setOrbitsPaused, clearRoute }: {
  selectedId: string
  onSelect: (id: string) => void
  orbitsPaused: boolean
  setOrbitsPaused: (paused: boolean) => void
  clearRoute?: () => void
}) {
  return (
    <div className="mission-list">
      <p className="mission-list-head">Job planets</p>
      <div role="group" aria-label="Job planets">
        {[...jobPlanets].reverse().map((planet) => (
          <button key={planet.id} type="button" aria-pressed={planet.id === selectedId} onClick={() => onSelect(planet.id)}>
            <span className={`lamp lamp-${planet.mission.status}`} aria-hidden="true" />
            <span className="ml-name">{planet.name}</span>
            <span className="ml-year">'{planet.mission.start.slice(-2)}</span>
          </button>
        ))}
      </div>
      <div className="orbit-controls" role="group" aria-label="Orbit controls">
        <button type="button" aria-pressed={orbitsPaused} onClick={() => setOrbitsPaused(!orbitsPaused)}>Pause orbits</button>
        {clearRoute && <button type="button" onClick={clearRoute}>Clear route</button>}
      </div>
    </div>
  )
}
