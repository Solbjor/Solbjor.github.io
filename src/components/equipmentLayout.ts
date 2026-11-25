import type { CSSProperties } from 'react'

// Mounting coordinates in a single unmirrored bay. Both views use these datums.
export const standardBayMounts = {
  video: { x: -62, y: -61, width: 56 },
  readout: { x: 4, y: -61, width: 56 },
  channels: { x: 79, y: -57, width: 48 },
  power: { x: -110, y: 9, width: 48 },
  transport: { x: -49, y: 10, width: 76 },
} as const

// Face-on cabinet drawing, in millimetre-like local units. The overview
// foreshortens this entire assembly; the seated view overlays HTML at the apertures.
export const cabinet = { width: 1200, height: 490 }
export const mounts = {
  video: { x: 44, y: 59, width: 398, height: 248 },
  readout: { x: 504, y: 59, width: 413, height: 248 },
  channels: { x: 965, y: 134, width: 196, height: 140 },
  power: { x: 69, y: 378, width: 155, height: 55 },
  transport: { x: 436, y: 378, width: 312, height: 55 },
} as const

export function seatedPosition(mount: typeof mounts[keyof typeof mounts]) {
  return {
    '--mount-x': `${100 * mount.x / cabinet.width}%`,
    '--mount-y': `${100 * mount.y / cabinet.height}%`,
    '--mount-w': `${100 * mount.width / cabinet.width}%`,
    '--mount-h': `${100 * mount.height / cabinet.height}%`,
  } as CSSProperties
}
