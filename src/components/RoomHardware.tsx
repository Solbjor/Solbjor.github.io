import { DeckControls, InstrumentPanel, OperatorChair, type Equipment } from './InstrumentBay'

import { CONSOLE_BAY_OFFSET, project, W } from './roomLayout'

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

type BankProps = {
  x: number; y: number; scale: number
  bays: readonly { label: string; equipment: Equipment }[]
}

export function ConsoleBank({ x, y, scale, bays }: BankProps) {
  // Local coordinates are on the aisle-facing edge. Move each rear corner
  // toward the room horizon before joining faces; both banks use one camera.
  function point(u: number, v: number, depth = 1): [number, number] {
    const [px, py] = project(x + u * scale, y + v * scale, depth)
    return [ (px - x) / scale, (py - y) / scale ]
  }
  const plane = (points: number[][]) => points.map(p => p.join(',')).join(' ')
  const faceDepth = .94
  const rear = .90
  const edge = x < W / 2 ? 270 : -270
  const faceOrigin = point(0, 0, faceDepth)
  return <g transform={`translate(${x} ${y}) scale(${scale})`} className="room-workstation instrument-materials" aria-hidden="true">
    <ellipse cy="85" rx="278" ry="13" fill="url(#contact)" />
    <polygon points={plane([point(-261,16,rear),point(261,16,rear),point(261,86,rear),point(-261,86,rear)])} fill="var(--steel-dark)" />
    {[-260,-18,219].map(left => {
      const right = left + 41
      const inside = x < W / 2 ? right : left
      return <g key={left}>
        <polygon points={plane([point(inside,18,rear),point(inside,18),point(inside,86),point(inside,86,rear)])} fill="var(--steel-dark)" />
        <rect x={left} y="17" width="41" height="69" fill="var(--hood)" />
        <rect x={left+3} y="52" width="35" height="29" fill="var(--steel)" />
      </g>
    })}
    <polygon points={plane([point(edge,-75,rear),point(edge,-75,faceDepth),point(edge,3,faceDepth),point(edge,15),point(edge,38),point(edge,86,rear)])} fill="var(--steel-dark)" />
    <polygon points={plane([point(-270,-75,rear),point(270,-75,rear),point(270,-75,faceDepth),point(-270,-75,faceDepth)])} fill="var(--hood)" />
    <g transform={`translate(${faceOrigin.join(' ')}) scale(${faceDepth})`}>
      {bays.map((bay,i) => <g key={bay.label} transform={`translate(${i ? 136 : -136}) scale(${i ? -1 : 1} 1)`}>
        <rect x="-134" y="-75" width="270" height="79" fill="url(#payload-metal)" stroke="var(--hood)" strokeWidth="2" />
        <InstrumentPanel equipment={bay.equipment} />
      </g>)}
    </g>
    <polygon points={plane([point(-270,3,faceDepth),point(270,3,faceDepth),point(270,15),point(-270,15)])} fill="var(--panel-hi)" stroke="var(--hood)" />
    {bays.map((bay,i) => {
      const center = (i ? 1 : -1) * CONSOLE_BAY_OFFSET
      const [bx,by] = point(center,3,faceDepth)
      // Affine tangent plane for the small controls on each half of the desk.
      const transform = `matrix(${i ? -.97 : .97} 0 ${(center-bx)/30} ${(15-by)/30} ${bx} ${by})`
      return <g key={bay.label} transform={transform}><DeckControls equipment={bay.equipment}/></g>
    })}
    <rect x="-270" y="15" width="540" height="24" fill="var(--hood)" stroke="var(--steel-dark)" />
    {bays.map((bay,i) => <g key={bay.label} transform={`translate(${(i ? 136 : -136) + (x < W / 2 ? 60 : -60)} 27)`}>
      <rect x="-61" y="-10" width="122" height="20" rx="1" fill="var(--plate)" />
      <text textAnchor="middle" y="5.7" fill="var(--plate-ink)" fontFamily="var(--f-sans)" fontWeight="750" fontSize="16" letterSpacing=".7">{bay.label.toUpperCase()}</text>
    </g>)}
    {bays.map((bay,i) => {
      const offset = i ? -9 : 12
      const distance = i ? 1.085 : 1.095
      const [cx,cy] = point((i ? 136 : -136)+offset,86,distance)
      return <g key={bay.label} transform={`translate(${cx} ${cy}) scale(${distance})`}>
        <OperatorChair lean={i ? -4 : 5}/>
      </g>
    })}
  </g>
}
