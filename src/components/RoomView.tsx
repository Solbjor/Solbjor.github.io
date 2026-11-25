import { RoomArchitecture, RoomMaterials } from './RoomArchitecture'
import { at, BANKS, stationTarget, H, PROJECTION_WALL_DROP, SIDE_PROJECTION, STATIONS, W } from './roomLayout'
import { useRef, useState, useSyncExternalStore, type ReactNode } from 'react'
import { profile, projects, type Project } from '../data/content'
import { currentMission, STATUS_LABEL } from '../lib/missions'
import { jobPlanets, type TelemetryPlanet } from '../lib/telemetry'
import { EarthMap } from './EarthMap'
import { OrbitalTelemetry } from './OrbitalTelemetry'
import { Payloads } from './Payloads'
import { ConsoleBank, ProjectionCase } from './RoomHardware'
import { SeatedRoom, WritingShelf } from './SeatedRoom'
import './apollo.css'

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
        className="scene"
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
          <RoomMaterials />
          <g id="flight-room-shell"><RoomArchitecture /></g>
          <g id="flight-projection-wall" transform={`translate(0 ${PROJECTION_WALL_DROP})`}>
          <g transform={narrow ? 'translate(0 46) scale(1 .69)' : 'translate(72 46) scale(.9 .69)'}>
          <ProjectionCase x={396} y={80} width={648} height={338} />
          <svg x="400" y="84" width="640" height="330" viewBox="0 0 960 495" className="plot-screen">
            {mode === 'earth'
              ? <EarthMap selectedProject={selectedProject} onSelect={setSelectedProject} />
              : <OrbitalTelemetry selected={selected} showRoute={showRoute} paused={orbitsPaused} onSelect={select} />}
          </svg>
          <rect x="400" y="84" width="640" height="330" fill="url(#scan)" className="r-scanlines" />

          </g>
          <g transform={narrow ? undefined : "translate(72 0) scale(.9 1)"}>
          {[SIDE_PROJECTION.left, SIDE_PROJECTION.right].map(x => (
            <g key={x}>
              <ProjectionCase x={x} y={SIDE_PROJECTION.y} width={SIDE_PROJECTION.width} height={SIDE_PROJECTION.height} />
              <rect x={x + 2} y={SIDE_PROJECTION.y + 2} width={SIDE_PROJECTION.width - 4}
                height={SIDE_PROJECTION.height - 4} fill="url(#scan)" className="r-scanlines" />
            </g>
          ))}
          {/* status lamps beside each bezel */}
          <g className="r-lamps">
            {[180, 214, 248].map((x, i) => (
              <circle key={`l${x}`} cx={x} cy={SIDE_PROJECTION.y + SIDE_PROJECTION.height + 16} r="5" className={i === 0 ? 'lamp-on' : 'lamp-off'} />
            ))}
            {[1192, 1226, 1260].map((x, i) => (
              <circle key={`r${x}`} cx={x} cy={SIDE_PROJECTION.y + SIDE_PROJECTION.height + 16} r="5" className={i === 2 ? 'lamp-alert' : 'lamp-on'} />
            ))}
          </g>

          </g>
          </g>
          {BANKS.map((bank) => (
            <ConsoleBank bays={bank.bays} key={bank.bays[0]?.label} x={bank.x} y={bank.y} scale={bank.scale} />
          ))}
          {/* your flight console */}
          <polygon points="0,736 1440,736 1440,900 0,900" className="r-console" />
          <rect x="0" y="726" width="1440" height="12" className="r-desk" />
        </svg>

        {/* stations: real navigation set into the consoles */}
        <nav aria-label="Stations" className="stations">
          {STATIONS.map((station) => {
            const bounds = stationTarget(station)
            if (station.id === null) return null
            return station.id === 'payloads' ? (
              <button key={station.id} type="button" className="station-hit" style={bounds} aria-haspopup="dialog" onClick={enterPayloads}>
                <span className="sr-only">{station.label}</span>
              </button>
            ) : (
              <a key={station.id} className="station-hit" style={bounds} href={`#${station.id}`}>
                <span className="sr-only">{station.label}</span>
              </a>
            )
          })}
        </nav>

        <div className="telemetry-modes" role="group" aria-label="Main telemetry screen mode">
          <button type="button" className="key key-small" aria-pressed={mode === 'solar'} onClick={() => setMode('solar')}>Solar system</button>
          <button type="button" className="key key-small" aria-pressed={mode === 'earth'} onClick={() => setMode('earth')}>Earth map</button>
        </div>

        <div className="side-screen side-left" style={at(72 + SIDE_PROJECTION.left * .9, SIDE_PROJECTION.y + PROJECTION_WALL_DROP, SIDE_PROJECTION.width * .9, SIDE_PROJECTION.height)}>
          {readout}
        </div>
        <div className="side-screen side-right" style={at(72 + SIDE_PROJECTION.right * .9, SIDE_PROJECTION.y + PROJECTION_WALL_DROP, SIDE_PROJECTION.width * .9, SIDE_PROJECTION.height)}>
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
        {stationOpen && <SeatedRoom narrow={narrow} readout={readout} catalog={catalog} />}
        <div className="station-closeup">
          <div className="station-closeup-head">
            <h2 id="payload-workstation-h" className="placard">Payloads workstation</h2>
            <button type="button" className="key" autoFocus onClick={() => workstation.current?.close()}>
              Return to room
            </button>
          </div>
          {stationOpen && <Payloads workstation />}
          <WritingShelf />
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
