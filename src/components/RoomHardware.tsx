import { InstrumentBay, InstrumentMaterials, OperatorChair, type Equipment } from './InstrumentBay'

// All room geometry uses the same vanishing point and 1440 × 900 canvas.
const VANISH_X = 720
const VANISH_Y = 285

function project(x: number, y: number, depth: number): [number, number] {
  return [VANISH_X + (x - VANISH_X) * depth, VANISH_Y + (y - VANISH_Y) * depth]
}

function quad(x1: number, x2: number, y: number, back: number, front: number) {
  return [project(x1, y, back), project(x2, y, back), project(x2, y, front), project(x1, y, front)]
    .map((point) => point.join(',')).join(' ')
}

// Map a panel corner onto the left return wall; mirror the assembly for the right.
function wallPoint(depth: number, height: number) {
  const scale = 1 + (1 - depth) * 140 / (VANISH_X - 140)
  return project(140, 139 + height * 298, scale).join(',')
}

const ceiling = 'M0 0H1440V104L1300 139H140L0 104Z'
const floor = 'M140 437H1300L1440 474V736H0V474Z'

// Scatter yarn on the floor plane. Apparent width grows with depth scale;
// the projected length along the aisle grows with its square.
function carpetPile() {
  let seed = 7151
  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0
    return seed / 4294967296
  }
  const paths = ['', '']
  for (let i = 0; i < 24000; i++) {
    const scale = 1 / (1 - random() * .664)
    const [x, y] = project(random() * 1440, 437, scale)
    if (x < 0 || x > 1440) continue
    paths[i % 2] += `M${x.toFixed(1)} ${y.toFixed(1)}l${(.38 * scale).toFixed(1)} ${(.11 * scale * scale).toFixed(1)}`
  }
  return paths
}
const yarn = carpetPile()

function WallPanels({ right }: { right?: boolean }) {
  const divisions = [0, .38, .66, .86, 1]
  return <g transform={right ? 'translate(1440) scale(-1 1)' : undefined}>
    {divisions.slice(1).map((end, i) => {
      const start = divisions[i]!
      return [[.012, .68], [.692, .964]].map(([top, bottom]) => (
        <polygon key={`${i}-${top}`} fill={top! > .68 ? 'url(#wall-dado)' : 'url(#wall-laminate)'}
          points={[wallPoint(start + .009, top!), wallPoint(end - .007, top!),
            wallPoint(end - .007, bottom!), wallPoint(start + .009, bottom!)].join(' ')} />
      ))
    })}
    <polygon points={[wallPoint(0,0), wallPoint(1,0), wallPoint(1,.67), wallPoint(0,.67)].join(' ')} fill="url(#surface-grain)" />
    <polygon points={[wallPoint(0,0), wallPoint(1,0), wallPoint(1,.09), wallPoint(0,.09)].join(' ')} opacity=".45" fill="url(#junction)" />
    <polygon points={[wallPoint(0,.675), wallPoint(1,.675), wallPoint(1,.694), wallPoint(0,.694)].join(' ')} fill="var(--trim-shadow)" />
    <path d={`M${wallPoint(0,.677)} L${wallPoint(1,.677)}`} stroke="var(--wall-light)" strokeWidth="1.5" />
    <path d="M0 464L140 429V437L0 474Z" fill="var(--trim-shadow)" />
  </g>
}

export function RoomArchitecture() {
  const depths = [0.51, 0.58, 0.68, 0.82, 1, 1.24]
  return (
    <g aria-hidden="true">
      <InstrumentMaterials />
      <defs>
        <clipPath id="acoustic-field"><path d={ceiling} /></clipPath>
        <linearGradient id="wall-laminate" x2="0" y2="1">
          <stop stopColor="var(--wall-light)" /><stop offset=".12" stopColor="var(--wall-body)" />
          <stop offset=".94" stopColor="var(--wall-body)" /><stop offset="1" stopColor="color-mix(in srgb, var(--wall-body) 75%, var(--wall-foot))" />
        </linearGradient>
        <linearGradient id="wall-dado" x2="0" y2="1">
          <stop stopColor="var(--wall-foot)" /><stop offset=".12" stopColor="var(--dado)" />
          <stop offset=".9" stopColor="var(--dado)" /><stop offset="1" stopColor="var(--wall-foot)" />
        </linearGradient>
        <filter id="material-grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency=".55" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <pattern id="surface-grain" width="117" height="83" patternUnits="userSpaceOnUse">
          <rect width="117" height="83" filter="url(#material-grain)" opacity=".19" />
        </pattern>
        <clipPath id="floor-plane"><path d={floor} /></clipPath>
        <linearGradient id="junction" x2="0" y2="1">
          <stop stopColor="#121610" stopOpacity=".32" /><stop offset="1" stopOpacity="0" />
        </linearGradient>
        <filter id="diffusion" x="-25%" y="-75%" width="150%" height="250%"><feGaussianBlur stdDeviation="3" /></filter>
        <radialGradient id="contact"><stop stopColor="#10120e" stopOpacity=".64" />
          <stop offset=".62" stopColor="#10120e" stopOpacity=".34" /><stop offset="1" stopOpacity="0" /></radialGradient>
        <linearGradient id="floor-shade" x2="0" y2="1">
          <stop className="floor-back" />
          <stop offset="1" className="floor-near" />
        </linearGradient>
      </defs>
      <path d={ceiling} className="acoustic-ceiling" />
      <path d="M0 104L140 139V437L0 474ZM1440 104L1300 139V437L1440 474Z" className="r-wall" />
      <WallPanels /><WallPanels right />
      <rect x="140" y="139" width="1160" height="298" fill="var(--trim-shadow)" />
      {Array.from({ length: 12 }, (_, i) => <rect key={i} x={141 + i * 96.5} y="140"
        width="95" height="291" fill="url(#wall-laminate)" />)}
      <rect x="140" y="139" width="1160" height="292" fill="url(#surface-grain)" />
      <rect x="150" y="89" width="1140" height="306" rx="2" fill="var(--wall-foot)" />
      <path d={floor} fill="url(#floor-shade)" />

      <polygon points={quad(635, 805, 583, 0.51, 1.52)} className="carpet-aisle" />
      <g clipPath="url(#floor-plane)" fill="none" strokeWidth=".74" strokeLinecap="round">
        <path d={yarn[0]} stroke="#eee7d3" opacity=".085" />
        <path d={yarn[1]} stroke="#1f211b" opacity=".105" />
      </g>
      <rect x="140" y="437" width="1160" height="14" fill="url(#junction)" />
      <g clipPath="url(#acoustic-field)">
        {depths.slice(0, -1).map((back, row) => {
          const front = depths[row + 1]!
          return Array.from({ length: 22 }, (_, col) => {
            const x = -1128 + col * 168
            const lit = col % 4 === 0 && row > 0
            return <g key={`${row}-${col}`}>
              <polygon points={quad(x + 2, x + 167, 0, back + .003, front)}
                fill={(row + col) % 3 === 0 ? 'var(--tile-light)' : 'var(--wall-body)'} />
              {lit && <g>
                <polygon points={quad(x + 12, x + 157, 0, back + .012, front - .009)} fill="var(--trim-shadow)" />
                <polygon points={quad(x + 15, x + 154, 0, back + .015, front - .01)}
                  className="fluorescent" opacity=".22" filter="url(#diffusion)" />
                {[.26, .53].map(offset => <polygon key={offset} className="fluorescent"
                  points={quad(x + 20, x + 149, 0, back + (front-back)*offset, back + (front-back)*(offset+.17))} />)}
              </g>}
            </g>
          })
        })}
      </g>
      <path d="M140 433H1300" stroke="var(--trim-shadow)" strokeWidth="7" />
    </g>
  )
}

export function ProjectionCase({ x, y, width, height }: { x: number; y: number; width: number; height: number }) {
  return (
    <g aria-hidden="true">
      <rect x={x - 9} y={y - 7} width={width + 24} height={height + 24} rx="4" className="projection-shadow" filter="url(#diffusion)" />
      <rect x={x - 8} y={y - 8} width={width + 16} height={height + 16} rx="4" className="projection-frame" />
      <path d={`M${x-6} ${y+height+5}V${y-6}h${width+12}`} fill="none" stroke="var(--wall-light)" strokeWidth="2" />
      <rect x={x-2} y={y-2} width={width+4} height={height+4} fill="var(--trim-shadow)" />
      {[-4, width+4].map(dx => <g key={dx} fill="var(--trim-shadow)">
        <circle cx={x+dx} cy={y-4} r="1.4" /><circle cx={x+dx} cy={y+height+4} r="1.4" />
      </g>)}
      <rect x={x} y={y} width={width} height={height} rx="4" className="r-glass" />
    </g>
  )
}

// Bay centers share this offset with the room's station links and chairs.
export const CONSOLE_BAY_OFFSET = 136

export function ConsoleBank({ x, y, scale, bays }: {
  x: number; y: number; scale: number; bays: readonly { equipment: Equipment }[]
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} className="room-workstation" aria-hidden="true">
      <ellipse cy="78" rx="280" ry="17" fill="url(#contact)" />
      <path d="M-253 22H253V62H-253Z" className="housing-base" />
      <path d="M-241-83H241L250-73H-250Z" className="housing-top" />
      <path d="M-250-73H250L258 3H-258Z" className="housing-face" />
      <path d="M-258 3H258L268 31H-268Z" className="housing-deck" />
      <path d="M-268 31H268V49H-268Z" className="housing-lip" />
      <path d="M0-73V62M-250 52H250M-205 52V62M205 52V62" className="hardware-seam" />
      {bays.map((bay, index) => <InstrumentBay key={index} equipment={bay.equipment}
        x={index === 0 ? -CONSOLE_BAY_OFFSET : CONSOLE_BAY_OFFSET} />)}
      {[-257, -10, 10, 257].map((pin) => (
        <circle key={pin} cx={pin} cy="40" r="2.2" className="hardware-screw" />
      ))}
    </g>
  )
}

export function ControllerChair({ x, y, scale }: { x: number; y: number; scale: number }) {
  return <g transform={`translate(${x} ${y}) scale(${scale})`} aria-hidden="true"><OperatorChair /></g>
}
