import { useId } from 'react'
import { cabinet, mounts } from './equipmentLayout'

function Screw({ x, y }: { x: number; y: number }) {
  return <g transform={`translate(${x} ${y})`}>
    <circle r="3.5" fill="#41443b" /><circle cy="-.7" r="2.7" fill="#b2b3a3" />
    <path d="m-1.6 1.2 3.2-2.4" stroke="#50544c" strokeWidth="1.2" />
  </g>
}

function Module({ x, width, finish }: { x: number; width: number; finish: string }) {
  return <g>
    <rect x={x} y="15" width={width} height="313" rx="3" fill={finish} stroke="#495046" strokeWidth="2" />
    <path d={`M${x+2} 325V17h${width-4}`} fill="none" stroke="#e2e1ce" opacity=".6" />
    {[x+9,x+width-9].map(sx => <g key={sx}><Screw x={sx} y={25}/><Screw x={sx} y={319}/></g>)}
  </g>
}

function Legend({ x, y, children }: { x: number; y: number; children: string }) {
  return <text x={x} y={y} fill="#252b26" fontFamily="var(--f-data)" fontSize="10" letterSpacing="1.5">{children}</text>
}

export function PayloadCabinet({ miniature = false }: { miniature?: boolean }) {
  const id = useId()
  const paint = (name: string) => `url(#${id}-${name})`
  return <svg aria-hidden="true" focusable="false" className="payload-cabinet-art"
    width="100%" height="100%" viewBox={`0 0 ${cabinet.width} ${cabinet.height}`} preserveAspectRatio="none">
    <defs>
      <linearGradient id={id+'-plate'} x2=".12" y2="1"><stop stopColor="var(--cabinet-light)"/><stop offset=".25" stopColor="var(--cabinet-face)"/><stop offset="1" stopColor="var(--cabinet-shadow)"/></linearGradient>
      <linearGradient id={id+'-deck'} x2=".1" y2="1"><stop stopColor="#7a8376"/><stop offset=".09" stopColor="#c0c1ae"/><stop offset=".92" stopColor="#d3d1bb"/><stop offset="1" stopColor="#a3ac98"/></linearGradient>
      <linearGradient id={id+'-chrome'}><stop stopColor="#42483f"/><stop offset=".34" stopColor="#dcddd0"/><stop offset=".65" stopColor="#a4a99b"/><stop offset="1" stopColor="#4e554c"/></linearGradient>
    </defs>
    <path d="M14 0H1186V331l14 132v27H0v-27l14-132Z" fill="#58675a"/>
    <path d="M17 4h1166v10H17Z" fill="#99a896"/>
    <Module x={21} width={451} finish={paint('plate')}/><Module x={474} width={472} finish={paint('plate')}/>
    <Module x={948} width={230} finish={paint('plate')}/>
    {[mounts.video,mounts.readout].map((m,i) => <g key={m.x}>
      <Legend x={m.x+4} y={37}>{i ? 'PROJECT DATA' : 'VIDEO DOWNLINK'}</Legend>
      <rect x={m.x-9} y={m.y-11} width={m.width+18} height={m.height+20} rx="29" fill="#dde0cc"/>
      <rect x={m.x-7} y={m.y-10} width={m.width+14} height={m.height+17} rx="27" fill="#353a33" stroke="#697164" strokeWidth="3"/>
      <rect {...m} rx="19" fill="#192727"/>
      {[141, 224].map(y => <rect key={y} x={m.x+m.width+9} y={y} width="11" height="6" rx="2" fill="#5c6357" />)}
      <rect x={m.x+m.width+10} y="145" width="8" height="80" rx="4" fill={paint('chrome')}/>
      {miniature && <path d={`M${m.x+29} 139h238m-238 25h174m-174 34h61l24-21 28 16h113`} fill="none" stroke="#97bdc7" strokeWidth="5"/>}
    </g>)}
    <Legend x={981} y={40}>CHANNEL SELECT</Legend>
    <path d="M990 104V57h144v47Z" fill="#42483e" stroke="#dbddcb" strokeWidth="2"/>
    <path d="M995 99V62h134v37Z" fill="#dedbc7"/>
    <path d="M1005 88q54-38 112 0m-101-6 3 6m18-15 2 7m23-10v7m22-5-2 7m19-2-3 6" fill="none" stroke="#4d5547" strokeWidth="1.5"/>
    <path d="m1062 97 29-24" stroke="#7d4939" strokeWidth="2"/>
    <rect x={mounts.channels.x-5} y={mounts.channels.y-6} width={mounts.channels.width+10} height={mounts.channels.height+12} rx="3" fill="#485046" stroke="#d1d3c4" strokeWidth="2"/>
    {miniature && [0,1,2,3].map(i => <rect key={i} x={mounts.channels.x + 4 + i%2 * mounts.channels.width/2} y={mounts.channels.y + 4 + Math.floor(i/2)*mounts.channels.height/2} width={mounts.channels.width/2-8} height={mounts.channels.height/2-8} fill={i===0?'#e2b66a':'#adb3a4'}/>)}
    <path d="M16 332h1168l14 128H2Z" fill={paint('deck')} stroke="#666f61" strokeWidth="2"/>
    <path d="M32 352h244l-5 91H23Zm358 0h420l5 91H387Z" fill={paint('plate')} stroke="#70776b" />
    <Legend x={69} y={369}>MAIN POWER</Legend><Legend x={436} y={369}>TRANSPORT</Legend>
    {miniature && [mounts.power,mounts.transport].map(m=><rect key={m.x} {...m} fill="#42483f"/>)}
    {Array.from({length:24},(_,i)=><path key={i} d={`M${887+i*9} 374l5 43`} stroke="#667261" strokeWidth="4"/>)}
    {[38,264,400,799].map(x=><Screw key={x} x={x} y={360}/>)}
    <path d="M1 461h1198v6H1Z" fill="#a5b49e"/><path d="M1 482h1198v8H1Z" fill="#414d43"/>
  </svg>
}
