import type { CSSProperties } from 'react'

export const CONSOLE_BAY_OFFSET = 136
export const PROJECTION_WALL_DROP = 64
export const SIDE_PROJECTION = { left: 166, right: 1064, y: 100, width: 210, height: 232 }

// The scene is drawn on a 1440 x 900 canvas; HTML overlays use the same coordinates.
export const W = 1440
export const H = 900
export const at = (x: number, y: number, w?: number, h?: number): CSSProperties => ({
  left: `${(x / W) * 100}%`,
  top: `${(y / H) * 100}%`,
  ...(w !== undefined && { width: `${(w / W) * 100}%` }),
  ...(h !== undefined && { height: `${(h / H) * 100}%` }),
})

export const VANISH_X = 720
export const VANISH_Y = 285

export function project(x: number, y: number, depth: number): [number, number] {
  return [VANISH_X + (x - VANISH_X) * depth, VANISH_Y + (y - VANISH_Y) * depth]
}

// Banks share a floor datum and lateral spacing. Only the row depth changes.
function bankPosition(side: -1 | 1, scale: number) {
  const [x, y] = project(VANISH_X + side * 385, VANISH_Y + 405 + (scale < .6 ? -21 : 4), scale)
  return { x, y, scale }
}
export const BANKS = [
  { ...bankPosition(-1, .50), bays: [{ id: 'missions', label: 'Missions', equipment: 'recorder' }, { id: null, label: 'Guidance', equipment: 'meters' }] },
  { ...bankPosition(1, .50), bays: [{ id: 'systems', label: 'Systems', equipment: 'meters' }, { id: 'training', label: 'Training', equipment: 'scopes' }] },
  { ...bankPosition(-1, .80), bays: [{ id: 'payloads', label: 'Payloads', equipment: 'payloads' }, { id: null, label: 'Telemetry', equipment: 'recorder' }] },
  { ...bankPosition(1, .80), bays: [{ id: null, label: 'Flight', equipment: 'channels' }, { id: 'comms', label: 'Comms', equipment: 'channels' }] },
] as const
export const STATIONS = BANKS.flatMap(({ x, y, scale, bays }) =>
  bays.map((bay, index) => ({
    ...bay,
    x: x + (index === 0 ? -1 : 1) * CONSOLE_BAY_OFFSET * scale,
    y,
    scale,
  })),
)
export const PAYLOAD_STATION = STATIONS.find(({ id }) => id === 'payloads')!

export function quad(x1: number, x2: number, y: number, back: number, front: number) {
  return [project(x1, y, back), project(x2, y, back), project(x2, y, front), project(x1, y, front)]
    .map((point) => point.join(',')).join(' ')
}

// Map a panel corner onto the left return wall; mirror the assembly for the right.
export function wallPoint(depth: number, height: number) {
  const scale = 1 + (1 - depth) * 140 / (VANISH_X - 140)
  return project(140, 139 + height * 298, scale).join(',')
}


// Follow the rear corners of the hood and the front edge of the desk. Neighboring
// hit regions meet at the same projected seam as the illustrated bays.
export function stationTarget(station: typeof STATIONS[number]): CSSProperties {
  const { x, y, scale } = station
  const half = CONSOLE_BAY_OFFSET * scale
  const corners = [
    project(x-half, y-75*scale, .9), project(x+half, y-75*scale, .9),
    [x+half, y+39*scale], [x-half, y+39*scale],
  ] as [number, number][]
  const left = Math.min(...corners.map(p => p[0]))
  const top = corners[0]![1]
  const width = Math.max(...corners.map(p => p[0])) - left
  const height = corners[2]![1] - top
  const polygon = corners.map(([px,py]) => `${100*(px-left)/width}% ${100*(py-top)/height}%`).join(',')
  return { ...at(left, top, width, height), clipPath: `polygon(${polygon})` }
}
