import { cloneElement, useId, type ReactElement, type SVGProps } from 'react'
import { VANISH_X, VANISH_Y } from './roomLayout'
import enamel from '../assets/materials/painted-enamel.png'
import carpet from '../assets/materials/loop-carpet.png'
import acoustic from '../assets/materials/acoustic-weave.png'
import ceiling from '../assets/materials/ceiling-mineral.png'
import upholstery from '../assets/materials/chair-upholstery.png'

// Dimensions are in local drawing units. Lighting and blend strength live in apollo.css.
const materials = {
  enamel: { source: enamel, width: 108, height: 108 },
  acoustic: { source: acoustic, width: 93, height: 124 },
  ceiling: { source: ceiling, width: 145, height: 88 },
  upholstery: { source: upholstery, width: 98, height: 98 },
  carpet: { source: carpet, width: 106, height: 106 },
}

export function MaterialPatterns() {
  return <defs>
    {Object.entries(materials).map(([name, { source, width, height }]) => (
      <pattern key={name} id={`material-${name}`} width={width} height={height} patternUnits="userSpaceOnUse">
        <image href={source} width={width} height={height} preserveAspectRatio="none" />
      </pattern>
    ))}
    {floorBands.map(({ transform }, i) => (
      <pattern key={i} id={`material-carpet-band-${i}`} href="#material-carpet" patternTransform={transform} />
    ))}
  </defs>
}

type SurfaceShape = ReactElement<SVGProps<SVGElement> & { 'data-surface'?: string }>

// The same path is used as the paint mask. Draw detail and lettering above this layer.
export function MaterialSurface({ material, finish, children }: {
  material: Exclude<keyof typeof materials, 'carpet'>
  finish?: 'panel' | 'deck'
  children: SurfaceShape
}) {
  return <>
    {children}
    {cloneElement(children, {
      fill: `url(#material-${material})`,
      stroke: 'none',
      className: `material-overlay material-${material}${finish ? ` finish-${finish}` : ''}`,
      'data-surface': undefined,
      'aria-hidden': true,
    })}
  </>
}

// Sample the floor-plane projection in narrow bands. Map both band edges back to
// the same world-space carpet tile so its phase continues from one band to the next.
const farEdge = 437
const nearEdge = 736
const floorTileDistance = 620
const distanceAt = (y: number) => floorTileDistance * (1 - (farEdge - VANISH_Y) / (y - VANISH_Y))
const screenYAt = (depth: number) => VANISH_Y + (farEdge - VANISH_Y) / (1 - depth / floorTileDistance)
const floorScaleAt = (y: number) => (y - VANISH_Y) / 310
const floorBands = Array.from({ length: 40 }, (_, index) => {
  const distance = distanceAt(nearEdge) / 40
  const top = Math.round(screenYAt(index * distance))
  const bottom = Math.round(screenYAt((index + 1) * distance))
  const scaleX = floorScaleAt((top + bottom) / 2)
  const scaleY = (bottom - top) / (distanceAt(bottom) - distanceAt(top))
  const originY = top - distanceAt(top) * scaleY
  return { top, bottom, transform: `translate(${VANISH_X} ${originY}) scale(${scaleX} ${scaleY})` }
})

// Checker edges use the exact projection so they don't inherit the fine pile's bands.
const square = 52
const halfColumns = Math.ceil(960 / floorScaleAt(farEdge) / square)
const checker = Array.from({ length: Math.ceil(distanceAt(nearEdge) / square) }, (_, row) => {
  const top = screenYAt(row * square)
  const bottom = screenYAt((row + 1) * square)
  const xAt = (column: number, y: number) => VANISH_X + column * square * floorScaleAt(y)
  return Array.from({ length: halfColumns }, (_, i) => {
    const column = 2 * i - halfColumns + row % 2
    return `M${xAt(column, top)} ${top}H${xAt(column + 1, top)}L${xAt(column + 1, bottom)} ${bottom}H${xAt(column, bottom)}Z`
  }).join('')
}).join('')

export function CarpetMaterial({ path }: { path: string }) {
  const id = useId()
  return <g aria-hidden="true">
    <defs>
      <clipPath id={`${id}-floor`}><path d={path} /></clipPath>
    </defs>
    <path d={checker} className="carpet-checks" clipPath={`url(#${id}-floor)`} />
    <g className="material-overlay material-carpet">
      <g clipPath={`url(#${id}-floor)`}>
        {floorBands.map(({ top, bottom }, i) => (
          <rect key={i} x="-240" y={top} width="1920" height={bottom - top}
            shapeRendering="crispEdges" fill={`url(#material-carpet-band-${i})`} />
        ))}
      </g>
    </g>
  </g>
}
