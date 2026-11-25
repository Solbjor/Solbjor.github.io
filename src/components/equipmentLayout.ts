import type { CSSProperties } from 'react'

// The rack order describes installed equipment. Each camera supplies its own apertures.
export const payloadRack = ['video', 'readout', 'channels'] as const
export const payloadDeck = ['power', 'transport', 'vent'] as const
export const equipmentRacks = {
  payloads: { face: payloadRack, deck: payloadDeck },
  scopes: { face: ['video', 'readout', 'keys'], deck: ['keys', 'switches', 'log'] },
  meters: { face: ['video', 'meters', 'keys'], deck: ['keys', 'switches', 'log'] },
  channels: { face: ['video', 'keys', 'meters'], deck: ['switches', 'keys', 'log'] },
  recorder: { face: ['video', 'readout', 'recorder'], deck: ['keys', 'switches', 'log'] },
} as const
export type Equipment = keyof typeof equipmentRacks
export type FaceModule = typeof equipmentRacks[Equipment]['face'][number]
export type DeckUnit = typeof equipmentRacks[Equipment]['deck'][number]

// Apertures for the seated view and its independent HTML controls.
export const cabinet = { width: 1200, height: 490 }
export const mounts = {
  video: { x: 48, y: 55, width: 357, height: 253 },
  readout: { x: 469, y: 55, width: 450, height: 253 },
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
