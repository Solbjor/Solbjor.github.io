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

export function RoomArchitecture() {
  const depths = [0.51, 0.58, 0.68, 0.82, 1, 1.24]
  return (
    <g aria-hidden="true">
      <defs>
        <pattern id="carpet" width="7" height="5" patternUnits="userSpaceOnUse">
          <path d="M0 2h2m2 2h2M5 0h1" className="carpet-thread" />
        </pattern>
        <linearGradient id="floor-shade" x2="0" y2="1">
          <stop className="floor-back" />
          <stop offset="1" className="floor-near" />
        </linearGradient>
      </defs>
      <path d="M0 0H1440L1300 139H140Z" className="acoustic-ceiling" />
      <path d="M0 0L140 139V437L0 736ZM1440 0L1300 139V437L1440 736Z" className="r-wall" />
      <path d="M140 139H1300V437H140Z" className="r-front" />
      <path d="M140 437H1300L1440 736H0Z" fill="url(#floor-shade)" />
      <path d="M140 437H1300L1440 736H0Z" fill="url(#carpet)" />
      <polygon points={quad(635, 805, 583, 0.51, 1.52)} className="carpet-aisle" />
      {depths.slice(0, -1).map((back, i) => (
        <g key={back}>
          <polygon points={quad(-410, 1850, 0, back, depths[i + 1]!)} className="tile-seam" />
          {[-30, 485, 955, 1470].map((x) => (
            <g key={x}>
              <polygon points={quad(x - 82, x + 82, 0, back + 0.008, back + 0.049)} className="fixture" />
              <polygon points={quad(x - 72, x + 72, 0, back + 0.015, back + 0.044)} className="fluorescent" />
            </g>
          ))}
        </g>
      ))}
      {[0, 240, 480, 720, 960, 1200, 1440].map((x) => (
        <line key={x} x1={x} y1="0" x2={project(x, 0, 0.51)[0]} y2="139" className="tile-seam" />
      ))}
      <path d="M0 115L140 215H1300L1440 115M0 311L140 312H1300L1440 311M0 603L140 428H1300L1440 603M64 64V599M1376 64V599" className="wall-seams" />
      <path d="M140 432H1300L1440 710M140 432L0 710" className="baseboard" />
    </g>
  )
}

export function ProjectionCase({ x, y, width, height }: { x: number; y: number; width: number; height: number }) {
  return (
    <g aria-hidden="true">
      <rect x={x - 9} y={y - 7} width={width + 24} height={height + 24} rx="4" className="projection-shadow" />
      <rect x={x - 8} y={y - 8} width={width + 16} height={height + 16} rx="4" className="projection-frame" />
      <rect x={x} y={y} width={width} height={height} rx="4" className="r-glass" />
    </g>
  )
}

// Bay centers share this offset with the room's station links and chairs.
export const CONSOLE_BAY_OFFSET = 136

function ConsoleBay({ x }: { x: number }) {
  return (
    <g transform={`translate(${x} 0)`}>
      {[-44, 44].map((monitorX) => (
        <g key={monitorX} transform={`translate(${monitorX} -39)`}>
          <rect x="-39" y="-29" width="78" height="57" rx="3" className="crt-bezel" />
          <rect x="-32" y="-23" width="64" height="44" rx="8" className="crt-tube" />
          <path d="M-25-11H15M-25-5H5M-25 9H-9L-2 1L5 7H24" className="crt-trace" />
          <circle cx="32" cy="24" r="2" className="lamp-on" />
        </g>
      ))}
      {[-107, 79].map((start) => (
        <g key={start}>
          {Array.from({ length: 5 }, (_, i) => (
            <rect key={i} x={start + i * 6} y="14" width="4" height="7" rx="1" className={i % 3 === 0 ? 'lamp-on' : 'hardware-key'} />
          ))}
        </g>
      ))}
      <path d="M-113 12l2-7m219 7l2-7" className="toggle-stem" />
      <path d="M-108 55h26m-26 3h26m56-3h26m-26 3h26m52-3h26m-26 3h26" className="vent-slots" />
    </g>
  )
}

export function ConsoleBank({ x, y, scale }: { x: number; y: number; scale: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} className="room-workstation" aria-hidden="true">
      <path d="M-268 55H268L282 77H-282Z" className="station-shadow" />
      <path d="M-253 22H253V62H-253Z" className="housing-base" />
      <path d="M-241-83H241L250-73H-250Z" className="housing-top" />
      <path d="M-250-73H250L258 3H-258Z" className="housing-face" />
      <path d="M-258 3H258L268 31H-268Z" className="housing-deck" />
      <path d="M-268 31H268V49H-268Z" className="housing-lip" />
      <path d="M0-73V62M-250 52H250M-205 52V62M205 52V62" className="hardware-seam" />
      <ConsoleBay x={-CONSOLE_BAY_OFFSET} />
      <ConsoleBay x={CONSOLE_BAY_OFFSET} />
      {[-257, -10, 10, 257].map((pin) => (
        <circle key={pin} cx={pin} cy="40" r="2.2" className="hardware-screw" />
      ))}
    </g>
  )
}

export function ControllerChair({ x, y, scale }: { x: number; y: number; scale: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} aria-hidden="true">
      <ellipse cy="67" rx="43" ry="9" className="station-shadow" />
      <path d="M0 38V61M0 60l-34 7m34-7 34 7m-34-7 11 13" className="chair-frame" />
      <path d="M-31 41Q0 33 31 41L35 50Q0 58-35 50Z" className="chair-seat" />
      <path d="M-31 33h-9v10m71-10h9v10" className="chair-frame" />
      <path d="M-31 5Q0-3 31 5L29 34Q0 44-29 34Z" className="chair-back" />
      <path d="M-25 10Q0 4 25 10M-29 34Q0 40 29 34" className="chair-stitch" />
    </g>
  )
}
