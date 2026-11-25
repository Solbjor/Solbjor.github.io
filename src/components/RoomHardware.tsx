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

export function Workstation({ x, y, scale, monitorCount = 2 }: { x: number; y: number; scale: number; monitorCount?: number }) {
  const skew = (x - VANISH_X) * 0.085 / scale
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} className="room-workstation" aria-hidden="true">
      <polygon points={`-132,53 132,53 ${142 + skew},77 ${-142 + skew},77`} className="station-shadow" />
      <path d="M-119 0H119V62H-119Z" className="housing-base" />
      <path d={`M-110-83H110L${116 + skew},-73H${-116 + skew}Z`} className="housing-top" />
      <path d={`M110-83L${116 + skew},-73L126,5V59L114,62V4Z`} className="housing-side" />
      <path d={`M-110-83L${-116 + skew},-73L-126,5V59L-114,62V4Z`} className="housing-side" />
      <path d={`M${-116 + skew}-73H${116 + skew}L114 3H-114Z`} className="housing-face" />
      {Array.from({ length: monitorCount }, (_, i) => {
        const monitorX = (i - (monitorCount - 1) / 2) * 88
        return (
          <g key={i} transform={`translate(${monitorX + skew * 0.4} -39)`}>
            <rect x="-39" y="-29" width="78" height="57" rx="3" className="crt-bezel" />
            <rect x="-32" y="-23" width="64" height="44" rx="8" className="crt-tube" />
            <path d="M-25-11H15M-25-5H5M-25 9H-9L-2 1L5 7H24" className="crt-trace" />
            <circle cx="32" cy="24" r="2" className="lamp-on" />
          </g>
        )
      })}
      <path d="M-114 3H114L132 31H-132Z" className="housing-deck" />
      <path d="M-132 31H132V49H-132Z" className="housing-lip" />
      <path d="M-114 52H114M-69 51V62M69 51V62" className="hardware-seam" />
      {[-107, 79].map((start) => (
        <g key={start}>
          {Array.from({ length: 5 }, (_, i) => (
            <rect key={i} x={start + i * 6} y="14" width="4" height="7" rx="1" className={i % 3 === 0 ? 'lamp-on' : 'hardware-key'} />
          ))}
        </g>
      ))}
      <path d="M-113 12l2-7m219 7l2-7" className="toggle-stem" />
      <path d="M-108 55h26m-26 3h26m56-3h26m-26 3h26m52-3h26m-26 3h26" className="vent-slots" />
      {[-121, 121].map((pin) => <circle key={pin} cx={pin} cy="40" r="2.2" className="hardware-screw" />)}
    </g>
  )
}
