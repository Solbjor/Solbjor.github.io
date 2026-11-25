import { InstrumentBay, InstrumentMaterials, OperatorChair, type Equipment } from './InstrumentBay'

// All room geometry uses the same vanishing point and 1440 × 900 canvas.
const VANISH_X = 720
const VANISH_Y = 285

function project(x: number, y: number, depth: number) {
  return [VANISH_X + (x - VANISH_X) * depth, VANISH_Y + (y - VANISH_Y) * depth]
}

function quad(x1: number, x2: number, y: number, back: number, front: number) {
  return [project(x1, y, back), project(x2, y, back), project(x2, y, front), project(x1, y, front)]
    .map((point) => point.join(',')).join(' ')
}

// Map a panel corner onto the left return wall; mirror the assembly for the right.
function wallPoint(depth: number, height: number) {
  const top = depth * 139
  const bottom = 736 - depth * 299
  return `${140 * depth},${top + height * (bottom - top)}`
}

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
    <polygon points={[wallPoint(0,.675), wallPoint(1,.675), wallPoint(1,.694), wallPoint(0,.694)].join(' ')} fill="var(--trim-shadow)" />
    <path d={`M${wallPoint(0,.677)} L${wallPoint(1,.677)}`} stroke="var(--wall-light)" strokeWidth="1.5" />
    <path d="M0 710L140 429V437L0 736Z" fill="var(--trim-shadow)" />
  </g>
}

export function RoomArchitecture() {
  const depths = [0.51, 0.58, 0.68, 0.82, 1, 1.24]
  return (
    <g aria-hidden="true">
      <InstrumentMaterials />
      <defs>
        <clipPath id="acoustic-field"><path d="M0 0H1440L1300 139H140Z" /></clipPath>
        <linearGradient id="wall-laminate" x2=".16" y2="1">
          <stop stopColor="var(--wall-light)" /><stop offset=".12" stopColor="var(--wall-body)" />
          <stop offset=".92" stopColor="var(--wall-body)" /><stop offset="1" stopColor="var(--wall-foot)" />
        </linearGradient>
        <linearGradient id="wall-dado" x2="0" y2="1">
          <stop stopColor="var(--wall-foot)" /><stop offset=".12" stopColor="var(--dado)" />
          <stop offset=".9" stopColor="var(--dado)" /><stop offset="1" stopColor="var(--wall-foot)" />
        </linearGradient>
        <filter id="carpet-fibre" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency=".42 .77" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <pattern id="carpet" width="96" height="96" patternUnits="userSpaceOnUse">
          <rect width="96" height="96" filter="url(#carpet-fibre)" opacity=".14" />
        </pattern>
        <linearGradient id="floor-shade" x2="0" y2="1">
          <stop className="floor-back" />
          <stop offset="1" className="floor-near" />
        </linearGradient>
      </defs>
      <path d="M0 0H1440L1300 139H140Z" className="acoustic-ceiling" />
      <path d="M0 0L140 139V437L0 736ZM1440 0L1300 139V437L1440 736Z" className="r-wall" />
      <WallPanels /><WallPanels right />
      <rect x="140" y="139" width="1160" height="298" fill="var(--trim-shadow)" />
      {Array.from({ length: 12 }, (_, i) => <rect key={i} x={141 + i * 96.5} y="140"
        width="95" height="291" fill="url(#wall-laminate)" />)}
      <rect x="150" y="89" width="1140" height="306" rx="2" fill="var(--wall-foot)" />
      <path d="M140 437H1300L1440 736H0Z" fill="url(#floor-shade)" />
      <path d="M140 437H1300L1440 736H0Z" fill="url(#carpet)" />
      <polygon points={quad(635, 805, 583, 0.51, 1.52)} className="carpet-aisle" />
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
      <rect x={x - 9} y={y - 7} width={width + 24} height={height + 24} rx="4" className="projection-shadow" />
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
      <path d="M-268 55H268L282 77H-282Z" className="station-shadow" />
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
