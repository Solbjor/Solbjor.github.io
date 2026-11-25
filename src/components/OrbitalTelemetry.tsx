import { useEffect, useState } from 'react'
import { jobPlanets, type TelemetryPlanet } from '../lib/telemetry'
import { PlanetMark } from './Planet'

const SOL = { x: 480, y: 247.5 }
const EARTH_ORBIT = { rx: 160, ry: 80, phase: 2.25, period: 104 }
const orbits = jobPlanets.map((planet, index) => {
  // Earth occupies the third orbital track, between the two innermost jobs and the rest.
  const track = index < 2 ? index : index + 1
  return { planet, rx: 68 + 46 * track, ry: 40 + 19.5 * track, phase: index * 2.39996 + 0.4, period: 65 + 19 * track }
})

function useOrbitTime(paused: boolean) {
  const [seconds, setSeconds] = useState(0)
  useEffect(() => {
    if (paused) return
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const timer = window.setInterval(() => {
      if (!motion.matches && !document.hidden) setSeconds((time) => time + 0.05)
    }, 50)
    return () => window.clearInterval(timer)
  }, [paused])
  return seconds
}

type Point = { x: number; y: number }
type Orbit = { rx: number; ry: number; phase: number; period: number }

function positionAt({ rx, ry, phase, period }: Orbit, seconds: number): Point {
  const angle = phase + seconds * 2 * Math.PI / period
  return { x: SOL.x + rx * Math.cos(angle), y: SOL.y + ry * Math.sin(angle) }
}

function leg(from: Point, to: Point, departureRadius: number, arrivalRadius: number) {
  const distance = Math.hypot(to.x - from.x, to.y - from.y) || 1
  const dx = (to.x - from.x) / distance
  const dy = (to.y - from.y) / distance
  const start = { x: from.x + dx * departureRadius, y: from.y + dy * departureRadius }
  const end = { x: to.x - dx * arrivalRadius, y: to.y - dy * arrivalRadius }
  const bend = Math.min(72, Math.max(18, distance * 0.23))
  const cx = (start.x + end.x) / 2 - dy * bend
  const cy = (start.y + end.y) / 2 + dx * bend
  return `M ${start.x} ${start.y} Q ${cx} ${cy} ${end.x} ${end.y}`
}

export function OrbitalTelemetry({ selected, showRoute, paused, onSelect }: {
  selected: TelemetryPlanet
  showRoute: boolean
  paused: boolean
  onSelect: (id: string) => void
}) {
  const seconds = useOrbitTime(paused)
  const positions = orbits.map((orbit) => ({ ...orbit.planet, ...positionAt(orbit, seconds) }))
  const earth = positionAt(EARTH_ORBIT, seconds)
  const target = positions.find(({ id }) => id === selected.id)!
  const returnLeg = target.mission.status === 'complete'
  const moonAngle = 0.85 + seconds * 2 * Math.PI / 8

  return (
    <>
      <defs>
        <marker id="telemetry-outbound-arrow" viewBox="0 0 8 8" refX="8" refY="4" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0 0L8 4L0 8Z" className="outbound-arrow" />
        </marker>
        <marker id="telemetry-return-arrow" viewBox="0 0 8 8" refX="8" refY="4" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0 0L8 4L0 8Z" className="return-arrow" />
        </marker>
      </defs>
      <g className="orbits">
        <ellipse cx={SOL.x} cy={SOL.y} rx={EARTH_ORBIT.rx} ry={EARTH_ORBIT.ry} className="earth-orbit" />
        {orbits.map(({ planet, rx, ry }) => (
          <ellipse key={planet.id} cx={SOL.x} cy={SOL.y} rx={rx} ry={ry} className={planet.id === selected.id ? 'orbit-selected' : undefined} />
        ))}
      </g>
      <circle cx={SOL.x} cy={SOL.y} r="31" className="sol-halo" />
      <circle cx={SOL.x} cy={SOL.y} r="25" className="sol" />
      {showRoute && (
        <g className="flight-legs" aria-hidden="true">
          <path d={leg(earth, target, 14, target.r + 3)} className="flight-leg-outbound" markerEnd="url(#telemetry-outbound-arrow)" />
          {returnLeg && <path d={leg(target, earth, target.r + 3, 14)} className="flight-leg-return" markerEnd="url(#telemetry-return-arrow)" />}
        </g>
      )}
      <g transform={`translate(${earth.x} ${earth.y})`}>
        <title>Earth and Moon</title>
        <ellipse rx="20" ry="13" className="moon-orbit" />
        <circle r="12" className="earth-disc" />
        <path d="M-10-5l6-4 5 2-2 4-4 2-3-1m10 3 6-3 3 5-4 4-3 1-2-4z" className="earth-continents" />
        <circle cx={20 * Math.cos(moonAngle)} cy={13 * Math.sin(moonAngle)} r="3" className="moon-disc" />
        <text y="27" textAnchor="middle" className="earth-name">EARTH</text>
      </g>
      {positions.map((planet) => (
        <g key={planet.id} className="plot-hit" onClick={() => onSelect(planet.id)}>
          <title>{planet.name}</title>
          <PlanetMark position={planet} mission={planet.mission} selected={planet.id === selected.id} sun={SOL} />
        </g>
      ))}
      <text x="24" y="34" className="telemetry-label">
        {target.mission.status === 'landed' ? 'NOW · ' : ''}{target.name.toUpperCase()}
      </text>
      {showRoute && (
        <text x="936" y="474" textAnchor="end" className="telemetry-key">
          {returnLeg ? 'OUTBOUND + RETURN' : 'OUTBOUND'}
        </text>
      )}
    </>
  )
}
