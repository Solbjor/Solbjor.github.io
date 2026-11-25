import { experience, type Role } from '../data/content'

export type MissionStatus = 'landed' | 'active' | 'complete'

export interface Mission extends Role {
  id: string
  callsign: string
  status: MissionStatus
  /** Position on the front-screen plot (viewBox 0 0 960 540). */
  x: number
  y: number
  r: number
  hue: number
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function monthIndex(date: string): number {
  const [mon, year] = date.split(' ')
  return Number(year) * 12 + MONTHS.indexOf(mon)
}

export const SOL = { x: -10, y: 270 }

// Each mission sits on its own orbit around Sol, the earliest closest in.
// The angle sweeps steadily so the trajectory reads as one arc outward.
const R_MIN = 140
const R_MAX = 800
const A_FROM = -42
const A_TO = 8
const HUES = [28, 200, 140, 260, 45, 175, 320, 12]

/** Short call signs for the plot labels. */
const CALLSIGN: Record<string, string> = {
  'MSU Verizon Innovative Learning': 'Verizon VIL',
  'Dream Enrichment Classes': 'Dream Enrichment',
  'Align Technology': 'Align',
  'Tegra Medical': 'Tegra',
}

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export const missions: Mission[] = [...experience]
  .sort((a, b) => monthIndex(a.start) - monthIndex(b.start))
  .map((role, i, all) => {
    const status: MissionStatus = role.current ? 'landed' : role.end === 'Present' ? 'active' : 'complete'
    const t = i / Math.max(all.length - 1, 1)
    const radius = R_MIN + t * (R_MAX - R_MIN)
    const angle = ((A_FROM + t * (A_TO - A_FROM)) * Math.PI) / 180
    return {
      ...role,
      id: slug(role.org),
      callsign: CALLSIGN[role.org] ?? role.org,
      status,
      x: SOL.x + radius * Math.cos(angle),
      y: SOL.y + radius * Math.sin(angle),
      r: status === 'landed' ? 44 : role.featured ? 22 : 15,
      hue: HUES[i % HUES.length] ?? 0,
    }
  })

export const currentMission: Mission = missions.find((m) => m.status === 'landed') ?? missions[missions.length - 1]!

export const STATUS_LABEL: Record<MissionStatus, string> = {
  landed: 'Landed',
  active: 'Base active',
  complete: 'Mission complete',
}

/** Smooth trajectory from Sol through every mission, in order. */
export function trajectoryPath(points: { x: number; y: number }[]): string {
  const pts = [{ x: 46, y: SOL.y }, ...points]
  let d = `M ${pts[0]!.x} ${pts[0]!.y}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i]!
    const p1 = pts[i]!
    const p2 = pts[i + 1]!
    const p3 = pts[i + 2] ?? p2
    const c1x = p1.x + (p2.x - p0.x) / 6
    const c1y = p1.y + (p2.y - p0.y) / 6
    const c2x = p2.x - (p3.x - p1.x) / 6
    const c2y = p2.y - (p3.y - p1.y) / 6
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`
  }
  return d
}
