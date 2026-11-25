import { cabinet, mounts as payloadMounts } from './equipmentLayout'
import { standardBayMounts as mounts } from './equipmentLayout'

/** The overview artwork shares the bank's desk edge and station hit target. */
function ButtonMatrix({ x, y, columns, rows }: { x: number; y: number; columns: number; rows: number }) {
  return <g transform={`translate(${x} ${y})`}>
    <rect x="-2" y="-2" width={columns * 8 + 2} height={rows * 7 + 2} fill="var(--key-bed)" />
    {Array.from({ length: columns * rows }, (_, i) => (
      <g key={i} transform={`translate(${i % columns * 8} ${Math.floor(i / columns) * 7})`}>
        <rect width="6.6" height="5.6" rx=".6" fill={i === 3 || i === 10 ? 'var(--switch-amber)' : i === 5 ? 'var(--switch-blue)' : 'var(--keycap)'} />
        <path d="M1 1h4" stroke="#fff" opacity=".38" />
      </g>
    ))}
  </g>
}

function CrtBezel() {
  return <>
    <rect x="-2" y="-2" width="60" height="49" rx="9" fill="var(--bezel-edge)" />
    <rect width="56" height="45" rx="9" fill="var(--gasket)" stroke="var(--bezel-shadow)" strokeWidth="3" />
  </>
}

function ScopeTube({ x, y, trace }: { x: number; y: number; trace: string }) {
  return <g transform={`translate(${x} ${y})`}>
    <CrtBezel />
    <rect x="5" y="5" width="46" height="35" rx="7" fill="url(#payload-glass)" />
    <path d="M10 14h34m-34 8h34m-34 8h34m-25-19v23m12-23v23" stroke="#a5c7d1" opacity=".18" strokeWidth=".8" />
    <path d={trace} fill="none" stroke="var(--scope-trace)" strokeWidth="1.3" />
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
        <stop stopColor="var(--scope-center)" /><stop offset=".77" stopColor="var(--scope-mid)" /><stop offset="1" stopColor="var(--scope-edge)" />
      </radialGradient>
    </defs>
  )
}

function MeterRack() {
  return <g transform="translate(4 -60)">
    <rect width="57" height="46" rx="2" fill="#545953" />
    {[0, 1].map(row => <g key={row} transform={`translate(3 ${3 + row * 21})`}>
      <rect width="50" height="18" rx="1" fill="var(--meter-paper)" />
      <path d="M5 12q19-15 40 0m-34-3 2 3m22-4-2 3" fill="none" stroke="#57594e" />
      <path d={row ? 'M25 17l10-10' : 'M25 17L18 7'} stroke="#734b40" strokeWidth="1.8" />
    </g>)}
  </g>
}

export type Equipment = 'payloads' | 'scopes' | 'meters' | 'channels' | 'recorder'

// Compose the miniature from readable instrument symbols at the full-size
// rack positions. Curvature and bezel thickness survive the reduction.
function PayloadInstruments() {
  const rackX = (x: number) => -131 + 262 * x / cabinet.width
  return <g>
    {[payloadMounts.video, payloadMounts.readout].map((m, i) =>
      <g key={m.x} transform={`translate(${rackX(m.x)} -64) scale(${m.width * 262 / cabinet.width / 56} 1.08)`}>
        <ScopeTube x={0} y={0} trace={i ? 'M10 16h31m-31 6h25m-25 6h15' : 'M10 27h9l6-11 7 9h12'} />
      </g>)}
    <g transform={`translate(${rackX(payloadMounts.channels.x)} -62)`}>
      <rect width="38" height="13" fill="var(--meter-paper)" stroke="var(--bezel-shadow)" />
      <path d="M4 9q14-10 29 0m-15 2 8-8" fill="none" stroke="#595b4e" />
      <g transform="translate(1 18) scale(2.25 2)"><ButtonMatrix x={0} y={0} columns={2} rows={2} /></g>
    </g>
  </g>
}

export function InstrumentPanel({ equipment }: { equipment: Equipment }) {
  if (equipment === 'payloads') return <PayloadInstruments />
  return <g>
    <path d="M-106-68H132M-69-66v62m138-62v62" fill="none" stroke="#484c44" opacity=".65" />
    {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M-104 ${-57 + i * 4}h27`} stroke="#424940" strokeWidth="2" />)}
    <ScopeTube {...mounts.video} trace="M10 26h6l5-9 5 12 5-7h13" />
    {equipment === 'meters' ? <MeterRack /> : equipment === 'channels'
      ? <ButtonMatrix x={8} y={-59} columns={6} rows={6} />
      : <ScopeTube {...mounts.readout} trace="M10 29h9v-4h6v-5h9v-4h10" />}
    {equipment === 'recorder' ? <g transform="translate(76 -59)">
      <rect width="51" height="40" rx="2" fill="#454b45" />
      <path d="M5 5h41v24H5Z" fill="#d0cdb8" />
      <path d="M6 20h7l3-8 3 13 4-7h10l3-6 4 9h5" fill="none" stroke="#785b52" />
      <path d="M4 33h43" stroke="#202521" strokeWidth="3" />
    </g> : <ButtonMatrix {...mounts.channels} columns={6} rows={5} />}
    {[-99,-84,85,102,118].map((cx) => <g key={cx}>
      <circle cx={cx} cy="-12" r="4.4" fill="#343731" stroke="#9b9d91" />
      <path d={`M${cx} -12l1-3`} stroke="#d2d2c4" />
    </g>)}
    {[-108,-65,71,129].map((cx) => <g key={cx} fill="#5b6058"><circle cx={cx} cy="-66" r="1.6"/><circle cx={cx} cy="-4" r="1.6"/></g>)}
  </g>
}

export function DeckControls({ equipment }: { equipment: Equipment }) {
  if (equipment === 'payloads') {
    const x = (pos: number) => -131 + pos * 262 / cabinet.width
    return <g>
      <rect x={x(payloadMounts.power.x)} y="6" width="33" height="14" fill="var(--bezel-edge)" />
      <path d={`M${x(payloadMounts.power.x)+13} 16l3-8`} stroke="#434b43" strokeWidth="4" />
      <g transform={`translate(${x(payloadMounts.transport.x)} 6) scale(2.6 2)`}><ButtonMatrix x={0} y={0} columns={3} rows={1}/></g>
      <path d="M63 8h46m-46 4h46m-46 4h46" stroke="var(--bezel-shadow)" />
    </g>
  }
  return <g>
    <ButtonMatrix {...mounts.power} columns={6} rows={2} />
    <g transform={`translate(${mounts.transport.x} ${mounts.transport.y})`}>
      <path d="M0 0h76l5 13H-4Z" fill="var(--panel-lo)" stroke="#777a70" />
      {[8,22,36,50,64].map(cx => <g key={cx}>
        <ellipse cx={cx} cy="8" rx="3.5" ry="2" fill="#44473f" />
        <path d={`M${cx} 8l2-6`} stroke="#c8c9bb" strokeWidth="2.3" />
      </g>)}
    </g>
    <path d="M55 9h53l7 15H51Z" fill="#d0caba" /><path d="M61 13h34m-33 4h30" stroke="#88877d" />
  </g>
}

// Origin is the caster contact point, projected onto the room floor.
export function OperatorChair({ lean }: { lean: number }) {
  return <g>
    <ellipse cy="-1" rx="46" ry="8" fill="url(#contact)" />
    <path d="M0-34v22m0-2L-32-2m32-12 29 12m-29-12 5 15" fill="none" stroke="#838880" strokeWidth="4" />
    {[-32,29,5].map(x => <ellipse key={x} cx={x} cy={x===5 ? 2 : -1} rx="4" ry="3" fill="#272a25" />)}
    <g transform={`skewX(${lean})`}>
      <path d="M-29-61h58l8 21q-36 8-74 0Z" fill="url(#upholstery)" stroke="#454a40" strokeWidth="2"/>
      <path d="M-34-36v-22l6-9m61 31v-22l-6-9M-22-35v-31m44 31v-31" fill="none" stroke="#8a9086" strokeWidth="3.5"/>
      <path d="M-36-60l6-10m65 10-6-10" stroke="#62675c" strokeWidth="6" strokeLinecap="round"/>
      <path d="M-31-85Q0-92 31-85l-2 33q-29 9-58 0Z" fill="url(#upholstery)" stroke="#464b42" strokeWidth="2" />
      <path d="M-27-82q25-5 54 0m-52 27q23 5 49 0" fill="none" stroke="#b4b5a6" opacity=".45"/>
    </g>
  </g>
}
