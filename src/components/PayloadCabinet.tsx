import { MaterialSurface } from './RoomFinishes'
import { useId } from 'react'
import { cabinet, mounts, payloadRack } from './equipmentLayout'

function Screw({ x, y }: { x: number; y: number }) {
  return <g transform={`translate(${x} ${y})`}>
    <circle r="3.5" fill="#41443b" /><circle cy="-.7" r="2.7" fill="#b2b3a3" />
    <path d="m-1.6 1.2 3.2-2.4" stroke="#50544c" strokeWidth="1.2" />
  </g>
}

function Module({ x, width, finish }: { x: number; width: number; finish: string }) {
  return <g>
    <MaterialSurface material="enamel" finish="panel">
      <rect data-surface="faceplate" x={x} y="15" width={width} height="313" rx="3" fill={finish} stroke="#495046" strokeWidth="2" />
    </MaterialSurface>
    <path d={`M${x+2} 325V17h${width-4}`} fill="none" stroke="#e2e1ce" opacity=".6" />
    {[x+9,x+width-9].map(sx => <g key={sx}><Screw x={sx} y={25}/><Screw x={sx} y={319}/></g>)}
  </g>
}

// Only the inner edges of the neighboring bays are in frame. The bank
// continues beyond the crop, along the same hood, face and deck datums.
function AdjacentModules({ finish }: { finish: string }) {
  return <>
    <Module x={-190} width={209} finish={finish} />
    <Module x={1180} width={210} finish={finish} />
    <rect x="-105" y="57" width="111" height="69" rx="4" fill="var(--console-case)" stroke="var(--cabinet-light)" />
    <rect x="-98" y="64" width="97" height="55" rx="3" fill="var(--cabinet-light)" />
    <path d="M-89 102q39-42 80 0m-40 11 23-29" fill="none" stroke="var(--console-case)" strokeWidth="2" />
    {Array.from({ length: 8 }, (_, i) => (
      <path key={i} d={`M-73 ${157 + i * 10}h68`} stroke="var(--cabinet-shadow)" strokeWidth="5" />
    ))}
    <rect x="1196" y="58" width="155" height="125" rx="6" fill="var(--console-case)" />
    <rect x="1204" y="66" width="139" height="105" rx="4" fill="var(--console-worktop)" />
    <path d="M1206 88h132m-132 27h132m-132 27h132m-112-66v85m25-85v85m25-85v85" fill="none"
      stroke="var(--cabinet-shadow)" opacity=".55" />
    <path d="M1211 123h16l8-18 12 36 13-21h18l10-14 12 23h32" fill="none" stroke="var(--console-case)" strokeWidth="2" />
    <path d="M1208 205h132m-132 10h132m-132 10h132" stroke="var(--cabinet-shadow)" strokeWidth="4" />
  </>
}

function Legend({ x, y, children }: { x: number; y: number; children: string }) {
  return <text x={x} y={y} fill="#252b26" fontFamily="var(--f-data)" fontSize="10" letterSpacing="1.5">{children}</text>
}

export function PayloadCabinet() {
  const id = useId()
  const paint = (name: string) => `url(#${id}-${name})`
  return <svg aria-hidden="true" focusable="false" className="payload-cabinet-art"
    width="100%" height="100%" viewBox={`0 0 ${cabinet.width} ${cabinet.height}`} preserveAspectRatio="none">
    <defs>
      <linearGradient id={id+'-plate'} x2=".12" y2="1"><stop stopColor="var(--cabinet-light)"/><stop offset=".25" stopColor="var(--cabinet-face)"/><stop offset="1" stopColor="var(--cabinet-shadow)"/></linearGradient>
      <linearGradient id={id+'-deck'} x2=".1" y2="1"><stop stopColor="#7a8376"/><stop offset=".09" stopColor="#c0c1ae"/><stop offset=".92" stopColor="#d3d1bb"/><stop offset="1" stopColor="var(--console-worktop)"/></linearGradient>
      <linearGradient id={id+'-chrome'}><stop stopColor="#42483f"/><stop offset=".34" stopColor="#dcddd0"/><stop offset=".65" stopColor="#a4a99b"/><stop offset="1" stopColor="#4e554c"/></linearGradient>
      <linearGradient id={id+'-bevel'} x2="0" y2="1">
        <stop stopColor="var(--cabinet-shadow)" />
        <stop offset=".18" stopColor="#454c42" />
        <stop offset=".8" stopColor="#61695b" />
        <stop offset="1" stopColor="var(--cabinet-light)" />
      </linearGradient>
      <linearGradient id={id+'-gasket'} x2=".05" y2="1">
        <stop stopColor="#121a19" />
        <stop offset=".6" stopColor="#27302d" />
        <stop offset="1" stopColor="#3a433c" />
      </linearGradient>
    </defs>
    <MaterialSurface material="enamel">
      <path d="M-190 0H1390V490H-190Z" fill="var(--console-case)"/>
    </MaterialSurface>
    <MaterialSurface material="enamel">
      <path d="M-190 0H1390V15H-190Z" fill="var(--console-edge)" />
    </MaterialSurface>
    <path d="M-190 14H1390" stroke="var(--console-case)" strokeWidth="2" />
    <AdjacentModules finish={paint('plate')} />
    <Module x={21} width={415} finish={paint('plate')}/><Module x={438} width={508} finish={paint('plate')}/>
    <Module x={948} width={230} finish={paint('plate')}/>
    {payloadRack.map(slot => {
      if (slot === 'channels') return null
      const m = mounts[slot]
      return <g key={slot}>
      <Legend x={m.x+4} y={37}>{slot === 'readout' ? 'PROJECT DATA' : 'VIDEO DOWNLINK'}</Legend>
      <rect x={m.x-15} y={m.y-14} width={m.width+30} height={m.height+28} rx="32"
        fill={paint('bevel')} stroke="var(--cabinet-shadow)" strokeWidth="1.5" />
      <path d={`M${m.x + 13} ${m.y + m.height + 11}H${m.x + m.width - 13}`}
        stroke="var(--cabinet-light)" strokeOpacity=".66" strokeWidth="1.6" />
      <rect x={m.x-9} y={m.y-9} width={m.width+18} height={m.height+18} rx="28"
        fill={paint('gasket')} stroke="#222a25" strokeWidth="1.5" />
      <rect data-surface="crt-glass" {...m} rx="21" fill="var(--crt-edge)" />
      {[141, 224].map(y => <rect key={y} x={m.x+m.width+18} y={y} width="11" height="6" rx="2" fill="#5c6357" />)}
      <rect x={m.x+m.width+19} y="145" width="8" height="80" rx="4" fill={paint('chrome')}/>
    </g>})}
    <Legend x={981} y={40}>CHANNEL SELECT</Legend>
    <path d="M990 104V57h144v47Z" fill="#42483e" stroke="#dbddcb" strokeWidth="2"/>
    <path d="M995 99V62h134v37Z" fill="#dedbc7"/>
    <path d="M1005 88q54-38 112 0m-101-6 3 6m18-15 2 7m23-10v7m22-5-2 7m19-2-3 6" fill="none" stroke="#4d5547" strokeWidth="1.5"/>
    <path d="m1062 97 29-24" stroke="#7d4939" strokeWidth="2"/>
    <rect x={mounts.channels.x-5} y={mounts.channels.y-6} width={mounts.channels.width+10} height={mounts.channels.height+12} rx="3" fill="#485046" stroke="#d1d3c4" strokeWidth="2"/>
    <MaterialSurface material="enamel" finish="deck">
      <path data-surface="deck" d="M-190 332H1390V460H-190Z" fill={paint('deck')} stroke="#666f61" strokeWidth="2"/>
    </MaterialSurface>
    <path d="M16 334 2 459m1182-125 14 125" stroke="var(--cabinet-shadow)" strokeWidth="1.7" />
    <path d="M-190 335H1390" stroke="var(--console-case)" opacity=".24" strokeWidth="3" />
    <MaterialSurface material="enamel" finish="panel">
      <path d="M-118 354H-17l-7 78h-101ZM1220 354h122l8 78h-122Z" fill={paint('plate')} stroke="var(--cabinet-shadow)" />
    </MaterialSurface>
    <path d="M-102 374h67m-68 9h67m-68 9h67m-68 9h67" stroke="var(--console-case)" opacity=".7" strokeWidth="2.4" />
    <path d="M1232 373h73v36h-69Z" fill="var(--console-case)" />
    <path d="M1239 379h19v9h-19Zm1 13h19v10h-19Zm23-13h19v9h-19Zm1 13h19v10h-19Z" fill="var(--cabinet-light)" />
    <MaterialSurface material="enamel" finish="panel">
      <path d="M32 352h244l-5 91H23Zm358 0h420l5 91H387Z" fill={paint('plate')} stroke="#70776b" />
    </MaterialSurface>
    <Legend x={69} y={369}>MAIN POWER</Legend><Legend x={436} y={369}>TRANSPORT</Legend>
    {Array.from({length:24},(_,i)=><path key={i} d={`M${887+i*9} 374l5 43`} stroke="#667261" strokeWidth="4"/>)}
    {[38,264,400,799].map(x=><Screw key={x} x={x} y={360}/>)}
    <path d="M-190 461H1390v5H-190Z" fill="var(--console-edge)" />
    <path d="M-190 466H1390v14H-190Z" fill="var(--console-case)" />
    <path d="M-190 480H1390v10H-190Z" fill="var(--console-worktop)" />
  </svg>
}
