/** The overview artwork shares the bank's desk edge and station hit target. */
function ButtonMatrix({ x, y, columns, rows }: { x: number; y: number; columns: number; rows: number }) {
  return <g transform={`translate(${x} ${y})`}>
    <rect x="-2" y="-2" width={columns * 8 + 2} height={rows * 7 + 2} fill="#55564e" />
    {Array.from({ length: columns * rows }, (_, i) => (
      <g key={i} transform={`translate(${i % columns * 8} ${Math.floor(i / columns) * 7})`}>
        <rect width="6.6" height="5.6" rx=".6" fill={i === 3 || i === 10 ? '#deb66e' : i === 5 ? '#93adba' : 'var(--keycap)'} />
        <path d="M1 1h4" stroke="#fff" opacity=".38" />
      </g>
    ))}
  </g>
}

function ScopeTube({ x, trace }: { x: number; trace: string }) {
  return <g transform={`translate(${x} -61)`}>
    <rect x="-2" y="-2" width="60" height="49" rx="9" fill="#99998b" />
    <rect width="56" height="45" rx="9" fill="#21221e" stroke="#575a52" strokeWidth="3" />
    <rect x="5" y="5" width="46" height="35" rx="7" fill="url(#payload-glass)" />
    <path d="M10 14h34m-34 8h34m-34 8h34m-25-19v23m12-23v23" stroke="#a5c7d1" opacity=".18" strokeWidth=".8" />
    <path d={trace} fill="none" stroke="#afcdda" strokeWidth="1.3" />
    <path d="M8 13q0-6 6-6 15-2 31 1l-2 2q-18-2-35 5Z" fill="#e4edf2" opacity=".19" />
    <path d="M47 25q3 11-4 12H31" fill="none" stroke="#bed5de" opacity=".24" />
  </g>
}

export function InstrumentMaterials() {
  return (
    <defs className="instrument-materials">
      <linearGradient id="payload-metal" x2=".15" y2="1">
        <stop stopColor="var(--panel-hi)" /><stop offset=".82" stopColor="var(--panel-lo)" /><stop offset="1" stopColor="var(--panel-hi)" />
      </linearGradient>
      <linearGradient id="upholstery" x2=".12" y2="1">
        <stop stopColor="color-mix(in srgb, var(--enamel-hi) 30%, #aaa99a)" />
        <stop offset=".22" stopColor="color-mix(in srgb, var(--enamel-hi) 30%, #868779)" />
        <stop offset="1" stopColor="color-mix(in srgb, var(--enamel-hi) 30%, #52564e)" />
      </linearGradient>
      <radialGradient id="payload-glass" cx=".45" cy=".4" r=".65">
        <stop stopColor="#456575" /><stop offset=".77" stopColor="#2e4a59" /><stop offset="1" stopColor="#14252b" />
      </radialGradient>
    </defs>
  )
}

function MeterRack() {
  return <g transform="translate(4 -60)">
    <rect width="57" height="46" rx="2" fill="#545953" />
    {[0, 1].map(row => <g key={row} transform={`translate(3 ${3 + row * 21})`}>
      <rect width="50" height="18" rx="1" fill="#c9c7b2" />
      <path d="M5 12q19-15 40 0m-34-3 2 3m22-4-2 3" fill="none" stroke="#57594e" />
      <path d={row ? 'M25 17l10-10' : 'M25 17L18 7'} stroke="#734b40" strokeWidth="1.8" />
    </g>)}
  </g>
}

export type Equipment = 'scopes' | 'meters' | 'channels' | 'recorder'

export function InstrumentBay({ x, equipment }: { x: number; equipment: Equipment }) {
  return <g transform={`translate(${x} 0) scale(${x > 0 ? -1 : 1} 1)`} className="instrument-materials">
    <ellipse cx="4" cy="84" rx="124" ry="8" fill="url(#contact)" />
    <path d="M-116 45H129V68H-116Z" fill="#222720" />
    <path d="M-121 45h46v39h-46zm215 0h32v39H94Z" fill="var(--steel-dark)" stroke="var(--enamel-edge)" />
    <rect x="-116" y="49" width="242" height="16" fill="url(#junction)" />
    <path d="M-114 54h33v23h-33zm216-1h18v25h-18Z" fill="var(--enamel)" />
    <path d="M-106-87H135v15h-249Z" fill="var(--hood)" />
    <path d="M-106-87l-8 15-8 75 9-5 11-77Z" fill="var(--steel-dark)" />
    <path d="M-113-72H135V2h-254Z" fill="url(#payload-metal)" stroke="var(--hood)" strokeWidth="3" />
    <path d="M-106-87H135V2h-254l6-74Z" fill="url(#surface-grain)" />
    <path d="M-106-68H132M-69-66v62m138-62v62" fill="none" stroke="#484c44" opacity=".65" />
    {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M-104 ${-57 + i * 4}h27`} stroke="#424940" strokeWidth="2" />)}
    <ScopeTube x={-62} trace="M10 26h6l5-9 5 12 5-7h13" />
    {equipment === 'meters' ? <MeterRack /> : equipment === 'channels'
      ? <ButtonMatrix x={8} y={-59} columns={6} rows={6} />
      : <ScopeTube x={4} trace="M10 29h9v-4h6v-5h9v-4h10" />}
    {equipment === 'recorder' ? <g transform="translate(76 -59)">
      <rect width="51" height="40" rx="2" fill="#454b45" />
      <path d="M5 5h41v24H5Z" fill="#d0cdb8" />
      <path d="M6 20h7l3-8 3 13 4-7h10l3-6 4 9h5" fill="none" stroke="#785b52" />
      <path d="M4 33h43" stroke="#202521" strokeWidth="3" />
    </g> : <ButtonMatrix x={79} y={-57} columns={6} rows={5} />}
    {[-99,-84,85,102,118].map((cx) => <g key={cx}>
      <circle cx={cx} cy="-12" r="4.4" fill="#343731" stroke="#9b9d91" />
      <path d={`M${cx} -12l1-3`} stroke="#d2d2c4" />
    </g>)}
    {[-108,-65,71,129].map((cx) => <g key={cx} fill="#5b6058"><circle cx={cx} cy="-66" r="1.6"/><circle cx={cx} cy="-4" r="1.6"/></g>)}
    <path d="M-121 2H135v29h-266Z" fill="var(--panel-hi)" stroke="var(--hood)" />
    <path d="M-121 4H135" stroke="#363d36" opacity=".45" strokeWidth="3" />
    <ButtonMatrix x={-110} y={9} columns={6} rows={2} />
    <path d="M-49 10h76l5 13h-85Z" fill="var(--panel-lo)" stroke="#777a70" />
    {[-41,-27,-13,1,15].map(cx => <g key={cx}><ellipse cx={cx} cy="18" rx="3.5" ry="2" fill="#44473f"/><path d={`M${cx} 18l2-6`} stroke="#c8c9bb" strokeWidth="2.3"/></g>)}
    <path d="M55 9h53l7 15H51Z" fill="#d0caba" /><path d="M61 13h34m-33 4h30" stroke="#88877d" />
    <path d="M-131 31H135v7h-266Z" fill="var(--hood)" />
  </g>
}

export function OperatorChair() {
  return <g transform="translate(0 17)">
    <ellipse cy="69" rx="40" ry="7" fill="url(#contact)" />
    <path d="M0 38v24m0-2-32 8m32-8 32 8m-32-8 9 14" fill="none" stroke="#848982" strokeWidth="4" />
    {[-30,30,9].map(x => <ellipse key={x} cx={x} cy={x === 9 ? 74 : 69} rx="4" ry="3" fill="#252724"/>)}
    <path d="M-29 24h58l7 19q-35 8-72 0Z" fill="color-mix(in srgb, var(--enamel-hi) 32%, #696e67)" stroke="#3d403a" strokeWidth="2"/>
    <path d="M-35 41v-15h9m61 15v-15h-9M-20 38v10m40-10v10" fill="none" stroke="#a0a399" strokeWidth="3"/>
    <path d="M-25 44l2-20m48 20-2-20" stroke="#7f867f" strokeWidth="4" />
    <path d="M-31 5Q0-2 31 5l-2 24q-1 4-6 5-23 5-46 0-5-1-6-5Z"
      fill="url(#upholstery)" stroke="#444940" strokeWidth="1.4" />
    <path d="M-27 9q27-6 54 0m-51 21q24 5 48 0" fill="none" stroke="#adaea1" opacity=".45" />
  </g>
}
