import { experience, type Role } from '../data/content'

export type MissionStatus = 'landed' | 'active' | 'complete'

export interface Mission extends Role {
  id: string
  callsign: string
  status: MissionStatus
  hue: number
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function monthIndex(date: string): number {
  const [mon, year] = date.split(' ')
  return Number(year) * 12 + MONTHS.indexOf(mon)
}

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
  .map((role, i) => {
    const status: MissionStatus = role.current ? 'landed' : role.end === 'Present' ? 'active' : 'complete'
    return {
      ...role,
      id: slug(role.org),
      callsign: CALLSIGN[role.org] ?? role.org,
      status,
      hue: HUES[i % HUES.length] ?? 0,
    }
  })

export const currentMission: Mission = missions.find((m) => m.status === 'landed') ?? missions[missions.length - 1]!

export const STATUS_LABEL: Record<MissionStatus, string> = {
  landed: 'Landed',
  active: 'Base active',
  complete: 'Mission complete',
}
