import type { Mission } from '../lib/missions'

/** Planet body with what Andrew left on it: a lander (current), or a flag plus base modules. */
export function PlanetMark({ m, selected }: { m: Mission; selected: boolean }) {
  const top = m.y - m.r
  const modules = m.status === 'landed' ? 0 : Math.min(m.bullets?.length ?? 1, 3)
  const fill = `hsl(${m.hue} 32% 46%)`
  const shade = `hsl(${m.hue} 38% 28%)`

  return (
    <g className={`planet planet-${m.status}${selected ? ' is-selected' : ''}`}>
      <circle cx={m.x} cy={m.y} r={m.r} fill={fill} />
      {/* terminator shading: the half facing away from Sol */}
      <path
        d={`M ${m.x} ${m.y - m.r} A ${m.r} ${m.r} 0 0 1 ${m.x} ${m.y + m.r} A ${m.r * 0.55} ${m.r} 0 0 0 ${m.x} ${m.y - m.r} Z`}
        fill={shade}
        opacity="0.85"
      />

      {m.status === 'landed' ? (
        <g className="lander" transform={`translate(${m.x - 4} ${top})`}>
          <path d="M -9 -4 L -13 2 M 9 -4 L 13 2" className="ink-line" />
          <path d="M -8 -4 L 8 -4 L 5 -14 L -5 -14 Z" className="ink-fill" />
          <rect x="-3" y="-19" width="6" height="5" className="ink-fill" />
          <line x1="20" y1="1" x2="20" y2="-22" className="ink-line" />
          <rect x="20" y="-22" width="12" height="8" className="flag" />
          <circle cx="0" cy="-22" r="2.4" className="beacon" />
        </g>
      ) : (
        <g className="outpost" transform={`translate(${m.x} ${top})`}>
          <line x1="-3" y1="1" x2="-3" y2="-14" className="ink-line" />
          <rect x="-3" y="-14" width="8" height="5" className="flag" />
          {Array.from({ length: modules }, (_, i) => (
            <rect key={i} x={4 + i * 6} y="-4" width="5" height="4" className="ink-fill" />
          ))}
        </g>
      )}

      {selected && (
        <path
          className="reticle"
          d={reticle(m.x, m.y, m.r + (m.status === 'landed' ? 30 : 12))}
        />
      )}
    </g>
  )
}

/** Close-up of a mission's surface: the lander (current), or the flag plus numbered base modules. */
export function SurfaceView({ m }: { m: Mission }) {
  const n = m.bullets?.length ?? 0
  return (
    <svg viewBox="0 0 360 110" className="surface" aria-hidden="true">
      <path d="M -10 110 Q 180 50 370 110 Z" fill={`hsl(${m.hue} 32% 40%)`} />
      {m.status === 'landed' ? (
        <g transform="translate(160 82)">
          <path d="M -16 -6 L -24 6 M 16 -6 L 24 6" className="ink-line" />
          <path d="M -15 -6 L 15 -6 L 9 -26 L -9 -26 Z" className="ink-fill" />
          <rect x="-5" y="-34" width="10" height="8" className="ink-fill" />
          <circle cx="0" cy="-38" r="3" className="beacon" />
          <line x1="44" y1="2" x2="44" y2="-34" className="ink-line" />
          <rect x="44" y="-34" width="20" height="13" className="flag" />
        </g>
      ) : (
        <g>
          <line x1="64" y1="84" x2="64" y2="44" className="ink-line" />
          <rect x="64" y="44" width="20" height="13" className="flag" />
          {Array.from({ length: Math.max(n, 1) }, (_, i) => {
            const x = 110 + i * 56
            const y = 72 - Math.sin((x / 360) * Math.PI) * 6
            return (
              <g key={i} transform={`translate(${x} ${y})`}>
                <path d="M 0 12 V 0 A 20 15 0 0 1 40 0 V 12 Z" className="ink-fill" />
                {n > 0 && (
                  <text x="20" y="6" className="module-num" textAnchor="middle">
                    {i + 1}
                  </text>
                )}
              </g>
            )
          })}
        </g>
      )}
    </svg>
  )
}

function reticle(x: number, y: number, s: number) {
  const k = Math.max(6, s * 0.35)
  return [
    `M ${x - s} ${y - s + k} V ${y - s} H ${x - s + k}`,
    `M ${x + s - k} ${y - s} H ${x + s} V ${y - s + k}`,
    `M ${x + s} ${y + s - k} V ${y + s} H ${x + s - k}`,
    `M ${x - s + k} ${y + s} H ${x - s} V ${y + s - k}`,
  ].join(' ')
}
