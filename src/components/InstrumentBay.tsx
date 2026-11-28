import { MaterialSurface } from './RoomFinishes'
import { equipmentRacks, type Equipment, type FaceModule, type DeckUnit } from './equipmentLayout'

/** The overview artwork shares the bank's desk edge and station hit target. */
function ButtonMatrix({ x, y, columns, rows }: { x: number; y: number; columns: number; rows: number }) {
  return <g transform={`translate(${x} ${y})`}>
    <rect x="-2" y="-2" width={columns * 8 + 2} height={rows * 7 + 2} fill="var(--key-bed)" />
    {Array.from({ length: columns * rows }, (_, i) => (
      <g key={i} transform={`translate(${i % columns * 8} ${Math.floor(i / columns) * 7})`}>
        <rect y="1" width="6.6" height="5.6" rx=".6" fill="var(--bezel-shadow)" />
        <rect width="6.6" height="5.2" rx=".6" fill={i === 3 || i === 10 ? 'var(--switch-amber)' : i === 5 ? 'var(--switch-blue)' : 'var(--keycap)'} />
        <path d="M1 1h4" stroke="#fff" opacity=".38" />
      </g>
    ))}
  </g>
}

function CrtBezel() {
  return <>
    <rect x="-2" y="-2" width="60" height="49" rx="9" fill="var(--bezel-edge)" />
    <rect data-surface="gasket" width="56" height="45" rx="9" fill="var(--gasket)" stroke="var(--bezel-shadow)" strokeWidth="3" />
    <path d="M2 13V10a8 8 0 0 1 8-8h36a8 8 0 0 1 8 8" stroke="var(--bezel-edge)" opacity=".53" fill="none" />
  </>
}

function ScopeTube({ x, y, trace }: { x: number; y: number; trace: string }) {
  return <g transform={`translate(${x} ${y})`}>
    <CrtBezel />
    <rect data-surface="crt-glass" x="5" y="5" width="46" height="35" rx="7" fill="url(#payload-glass)" />
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

function Vent({ x, y, width, rows }: { x: number; y: number; width: number; rows: number }) {
  return <g transform={`translate(${x} ${y})`}>
    {Array.from({ length: rows }, (_, i) => <path key={i} d={`M0 ${i * 4}h${width}`} stroke="var(--bezel-shadow)" strokeWidth="1.8" />)}
  </g>
}

function Meter({ y }: { y: number }) {
  return <g transform={`translate(3 ${y})`}>
    <rect width="50" height="17" rx="1.5" fill="var(--meter-paper)" stroke="var(--bezel-shadow)" strokeWidth="2"/>
    <path d="M5 11q20-14 40 0m-33-3 2 3m22-4-2 3" fill="none" stroke="var(--key-bed)"/>
    <path d={y ? 'M25 15l10-9' : 'M25 15L18 6'} stroke="var(--bezel-shadow)" strokeWidth="1.8"/>
  </g>
}

function RackInstrument({ kind }: { kind: FaceModule }) {
  switch (kind) {
    case 'video':
    case 'readout':
      return <ScopeTube x={0} y={0} trace={kind === 'video' ? 'M10 26h6l5-9 5 12 5-7h13' : 'M10 29h9v-4h6v-5h9v-4h10'} />
    case 'meters': return <><Meter y={0}/><Meter y={23}/></>
    case 'keys': return <ButtonMatrix x={5} y={3} columns={6} rows={6}/>
    case 'channels': return <>
      <Meter y={0}/>
      <g transform="translate(12 21) scale(2 1.7)"><ButtonMatrix x={0} y={0} columns={2} rows={2}/></g>
    </>
    case 'recorder': return <g>
      <rect width="56" height="44" rx="2" fill="var(--key-bed)"/>
      <rect x="4" y="4" width="48" height="28" fill="var(--meter-paper)"/>
      <path d="M6 22h7l3-8 3 13 4-7h10l3-6 4 9h9" fill="none" stroke="var(--bezel-shadow)"/>
      <Vent x={5} y={37} width={46} rows={1}/>
    </g>
  }
}

export function AisleModule({ x }: { x: number }) {
  return <g transform={`translate(${x} -75)`}>
    <MaterialSurface material="enamel" finish="panel">
      <rect width="32" height="79" fill="url(#payload-metal)" stroke="var(--hood)" />
    </MaterialSurface>
    <Vent x={6} y={10} width={20} rows={4}/>
    <ButtonMatrix x={5} y={35} columns={3} rows={4}/>
  </g>
}

export function InstrumentPanel({ equipment }: { equipment: Equipment }) {
  return <g>
    <Vent x={-124} y={-60} width={25} rows={9}/>
    {equipmentRacks[equipment].face.map((kind, i) => <g key={i} transform={`translate(${-86 + i * 74} -60)`}>
      <MaterialSurface material="enamel" finish="panel">
        <rect data-surface="faceplate" x="-7" y="-10" width="72" height="68" rx="1.5" fill="url(#payload-metal)" stroke="var(--bezel-shadow)"/>
      </MaterialSurface>
      <path d="M-5 55V-8h68" fill="none" stroke="var(--panel-hi)"/>
      {[-3,61].map(x => <circle key={x} cx={x} cy="-6" r="1.6" fill="var(--key-bed)"/>)}
      <RackInstrument kind={kind}/>
      <path d="M3 51h20" stroke="var(--bezel-shadow)" strokeWidth="2"/>
      {[40,51].map(x => <circle key={x} cx={x} cy="51" r="3" fill="var(--gasket)" stroke="var(--bezel-edge)"/>)}
    </g>)}
  </g>
}

function DeckInstrument({ kind }: { kind: DeckUnit }) {
  switch (kind) {
    case 'vent': return <Vent x={0} y={1} width={49} rows={4}/>
    case 'keys': return <ButtonMatrix x={0} y={0} columns={6} rows={2}/>
    case 'transport': return <g transform="scale(1.8)"><ButtonMatrix x={0} y={0} columns={3} rows={1}/></g>
    case 'log': return <><path d="M0 0h50l4 15H-3Z" fill="var(--meter-paper)"/><path d="M4 4h34M5 8h28" stroke="var(--bezel-edge)"/></>
    case 'power':
    case 'switches': return <g>
      <rect x="-3" y="-2" width={kind === 'power' ? 23 : 56} height="17" fill="var(--panel-lo)" stroke="var(--bezel-shadow)"/>
      {(kind === 'power' ? [8] : [5,18,31,44]).map(x => <g key={x}>
        <ellipse cx={x} cy="9" rx="3.6" ry="2.4" fill="var(--gasket)"/>
        <path d={`M${x} 9l2-7`} stroke="var(--keycap)" strokeWidth="2.8"/>
      </g>)}
    </g>
  }
}

export function DeckControls({ equipment }: { equipment: Equipment }) {
  return equipmentRacks[equipment].deck.map((kind, i) =>
    <g key={i} transform={`translate(${-114 + 85 * i} 8)`}><DeckInstrument kind={kind}/></g>)
}

// Origin is the caster contact point, projected onto the room floor.
export function OperatorChair({ lean }: { lean: number }) {
  return <g>
    <ellipse cy="-1" rx="46" ry="8" fill="url(#contact)" />
    <path d="M0-34v22m0-2L-32-2m32-12 29 12m-29-12 5 15" fill="none" stroke="#838880" strokeWidth="4" />
    {[-32,29,5].map(x => <ellipse key={x} cx={x} cy={x===5 ? 2 : -1} rx="4" ry="3" fill="#272a25" />)}
    <g transform={`skewX(${lean})`}>
      <MaterialSurface material="upholstery">
        <path d="M-29-61h58l8 21q-36 8-74 0Z" fill="url(#upholstery)" stroke="#454a40" strokeWidth="2"/>
      </MaterialSurface>
      <path d="M-34-36v-22l6-9m61 31v-22l-6-9M-22-35v-31m44 31v-31" fill="none" stroke="#8a9086" strokeWidth="3.5"/>
      <path d="M-36-60l6-10m65 10-6-10" stroke="#62675c" strokeWidth="6" strokeLinecap="round"/>
      <MaterialSurface material="upholstery">
        <path data-surface="upholstery" d="M-31-85Q0-92 31-85l-2 33q-29 9-58 0Z" fill="url(#upholstery)" stroke="#464b42" strokeWidth="2" />
      </MaterialSurface>
      <path d="M-27-82q25-5 54 0m-52 27q23 5 49 0" fill="none" stroke="#b4b5a6" opacity=".45"/>
    </g>
  </g>
}
