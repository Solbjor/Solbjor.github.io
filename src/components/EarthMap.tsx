const longitudeLines = [-150, -120, -90, -60, -30, 0, 30, 60, 90, 120, 150]
const latitudeLines = [-60, -45, -30, -15, 0, 15, 30, 45, 60]
const xAt = (longitude: number) => (longitude + 180) * 640 / 360
const yAt = (latitude: number) => 215 - 640 / (2 * Math.PI) * Math.asinh(Math.tan(latitude * Math.PI / 180))

const clockFormat: Intl.DateTimeFormatOptions = {
  hour: 'numeric',
  minute: '2-digit',
  second: '2-digit',
}

function LocalClock() {
  const [formatter] = useState(() => new Intl.DateTimeFormat(undefined, clockFormat))
  const [time, setTime] = useState(() => formatter.format(new Date()))
  useEffect(() => {
    const timer = window.setInterval(() => setTime(formatter.format(new Date())), 1000)
    return () => window.clearInterval(timer)
  }, [formatter])
  return <text x="936" y="484" textAnchor="end" className="telemetry-key map-clock">LOCAL {time}</text>
}

export function EarthMap({ selectedProject, onSelect }: {
  selectedProject: number
  onSelect: (index: number) => void
}) {
  return (
    <>
      <text x="24" y="34" className="telemetry-label">EARTH MAP</text>
      <svg x="160" y="32.5" width="640" height="430" viewBox="0 0 640 430" className="earth-map">
        <defs>
          <mask id="mercator-land" maskUnits="userSpaceOnUse" x="0" y="0" width="640" height="430">
            <image href={`${import.meta.env.BASE_URL}maps/earth-land.svg`} width="640" height="430" />
          </mask>
        </defs>
        <rect width="640" height="430" className="map-water" />
        <rect width="640" height="430" mask="url(#mercator-land)" className="map-land" />
        <g className="map-grid">
          {longitudeLines.map((longitude) => (
            <line key={longitude} x1={xAt(longitude)} x2={xAt(longitude)} y1="0" y2="430" />
          ))}
          {latitudeLines.map((latitude) => (
            <line key={latitude} x1="0" x2="640" y1={yAt(latitude)} y2={yAt(latitude)} className={latitude === 0 ? 'map-equator' : undefined} />
          ))}
        </g>
        <rect x="1" y="1" width="638" height="428" className="map-border" />
        {projects.map(({ name, mapMarker }, index) => mapMarker && (
          <g
            key={name}
            className={`map-marker${index === selectedProject ? ' map-marker-selected' : ''}`}
            transform={`translate(${xAt(mapMarker.longitude)} ${yAt(mapMarker.latitude)})`}
            onClick={() => onSelect(index)}
          >
            <title>{name}</title>
            <circle r="16" fill="transparent" />
            <circle r="10" className="map-marker-dot" />
            <text textAnchor="middle" dominantBaseline="central">{index + 1}</text>
          </g>
        ))}
      </svg>
      <text x="24" y="484" className="telemetry-key">MERCATOR</text>
      <LocalClock />
    </>
  )
}
import { useEffect, useState } from 'react'
import { projects } from '../data/content'

