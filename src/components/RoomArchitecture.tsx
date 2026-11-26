import { CarpetMaterial, MaterialPatterns, MaterialSurface } from './RoomFinishes'
import { InstrumentMaterials } from './InstrumentBay'
import { quad, wallPoint } from './roomLayout'

const ceiling = 'M0 0H1440V104L1300 139H140L0 104Z'
const floor = 'M140 437H1300L1440 474V736H0V474Z'

function WallPanels({ right }: { right?: boolean }) {
  const divisions = [0, .38, .66, .86, 1]
  return <g transform={right ? 'translate(1440) scale(-1 1)' : undefined}>
    {divisions.slice(1).map((end, i) => {
      const start = divisions[i]!
      const panel = (top: number, bottom: number, fill: string) => (
        <polygon fill={fill} points={[wallPoint(start + .009, top), wallPoint(end - .007, top),
          wallPoint(end - .007, bottom), wallPoint(start + .009, bottom)].join(' ')} />
      )
      return <g key={end}>
        <MaterialSurface material="acoustic">{panel(.012, .68, 'url(#wall-laminate)')}</MaterialSurface>
        {panel(.692, .964, 'url(#wall-dado)')}
      </g>
    })}
    <polygon points={[wallPoint(0,0), wallPoint(1,0), wallPoint(1,.09), wallPoint(0,.09)].join(' ')} opacity=".45" fill="url(#junction)" />
    <polygon points={[wallPoint(0,.675), wallPoint(1,.675), wallPoint(1,.694), wallPoint(0,.694)].join(' ')} fill="var(--trim-shadow)" />
    <path d={`M${wallPoint(0,.677)} L${wallPoint(1,.677)}`} stroke="var(--wall-light)" strokeWidth="1.5" />
    <path d="M0 464L140 429V437L0 474Z" fill="var(--trim-shadow)" />
  </g>
}

export function RoomMaterials() {
  return (
    <>
      <InstrumentMaterials />
      <MaterialPatterns />
      <defs>
        <clipPath id="floor-spill-field"><path d={floor} /></clipPath>
        <clipPath id="acoustic-field"><path d={ceiling} /></clipPath>
        <linearGradient id="wall-laminate" x2="0" y2="1">
          <stop stopColor="var(--wall-light)" /><stop offset=".12" stopColor="var(--wall-body)" />
          <stop offset=".94" stopColor="var(--wall-body)" /><stop offset="1" stopColor="color-mix(in srgb, var(--wall-body) 75%, var(--wall-foot))" />
        </linearGradient>
        <linearGradient id="wall-dado" x2="0" y2="1">
          <stop stopColor="var(--wall-foot)" /><stop offset=".12" stopColor="var(--dado)" />
          <stop offset=".9" stopColor="var(--dado)" /><stop offset="1" stopColor="var(--wall-foot)" />
        </linearGradient>
        <linearGradient id="junction" x2="0" y2="1">
          <stop stopColor="#121610" stopOpacity=".32" /><stop offset="1" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="fixture-spill">
          <stop className="light-spill" stopOpacity=".34" />
          <stop offset=".54" className="light-spill" stopOpacity=".15" />
          <stop offset="1" className="light-spill" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="screen-recess" x2="0" y2="1">
          <stop stopColor="var(--trim-shadow)" stopOpacity=".78" />
          <stop offset="1" stopColor="var(--trim-shadow)" stopOpacity="0" />
        </linearGradient>
        <filter id="diffusion" x="-25%" y="-75%" width="150%" height="250%"><feGaussianBlur stdDeviation="3" /></filter>
        <radialGradient id="contact"><stop stopColor="#10120e" stopOpacity=".64" />
          <stop offset=".62" stopColor="#10120e" stopOpacity=".34" /><stop offset="1" stopOpacity="0" /></radialGradient>
        <linearGradient id="floor-shade" x2="0" y2="1">
          <stop className="floor-back" />
          <stop offset="1" className="floor-near" />
        </linearGradient>
      </defs>
    </>
  )
}

export function RoomArchitecture() {
  return (
    <g aria-hidden="true">
      <RoomWalls />
      <RoomFloor />
      <RoomCeiling />
      <EnvironmentLighting />
    </g>
  )
}

function RoomWalls() {
  return <>
      <path d="M0 104L140 139V437L0 474ZM1440 104L1300 139V437L1440 474Z" className="r-wall" />
      <WallPanels /><WallPanels right />
      <rect x="140" y="139" width="1160" height="298" fill="var(--trim-shadow)" />
      {Array.from({ length: 12 }, (_, i) => (
        <MaterialSurface key={i} material="acoustic">
          <rect x={141 + i * 96.5} y="140" width="95" height="291" fill="url(#wall-laminate)" />
        </MaterialSurface>
      ))}
      <MaterialSurface material="acoustic">
        <rect x="150" y="89" width="1140" height="306" rx="2" fill="var(--wall-foot)" />
      </MaterialSurface>
      <rect x="140" y="139" width="1160" height="24" fill="url(#junction)" />
      <path d="M140 433H1300" stroke="var(--trim-shadow)" strokeWidth="7" />
  </>
}

function RoomFloor() {
  return <>
      <path d={floor} fill="url(#floor-shade)" />

      <CarpetMaterial path={floor} />
      <polygon points={quad(635, 805, 583, 0.51, 1.52)} className="carpet-aisle" />
      <g clipPath="url(#floor-spill-field)" opacity=".34">
        <ellipse cx="344" cy="515" rx="348" ry="92" fill="url(#fixture-spill)" />
        <ellipse cx="1096" cy="515" rx="348" ry="92" fill="url(#fixture-spill)" />
      </g>
  </>
}

const depths = [0.51, 0.58, 0.68, 0.82, 1, 1.24]
const ceilingTiles = depths.slice(0, -1).flatMap((back, row) =>
  Array.from({ length: 22 }, (_, col) => ({
    x: -1128 + col * 168, back, front: depths[row + 1]!,
    lighter: (row + col) % 3 === 0, lit: col % 4 === 0 && row > 0,
  })),
)

function RoomCeiling() {
  return <g clipPath="url(#acoustic-field)">
    <path d={ceiling} className="acoustic-ceiling" />
    {ceilingTiles.map(({ x, back, front, lighter }) => (
      <MaterialSurface key={`${x}-${back}`} material="ceiling">
        <polygon points={quad(x + 2, x + 167, 0, back + .003, front)}
          fill={lighter ? 'var(--tile-light)' : 'var(--wall-body)'} />
      </MaterialSurface>
    ))}
  </g>
}

function EnvironmentLighting() {
  return <>
    <rect x="140" y="437" width="1160" height="14" fill="url(#junction)" />
    <g clipPath="url(#acoustic-field)">
      {ceilingTiles.filter(tile => tile.lit).map(({ x, back, front }) => (
        <g key={`${x}-${back}`}>
          <polygon points={quad(x - 11, x + 178, 0, back - .024, front + .025)}
            className="fluorescent fixture-halo" filter="url(#diffusion)" />
          <polygon points={quad(x + 12, x + 157, 0, back + .012, front - .009)} fill="var(--trim-shadow)" />
          <polygon points={quad(x + 15, x + 154, 0, back + .015, front - .01)}
            className="fluorescent" opacity=".22" filter="url(#diffusion)" />
          {[.26, .53].map(offset => <polygon key={offset} className="fluorescent"
            points={quad(x + 20, x + 149, 0, back + (front-back)*offset, back + (front-back)*(offset+.17))} />)}
        </g>
      ))}
    </g>
  </>
}
