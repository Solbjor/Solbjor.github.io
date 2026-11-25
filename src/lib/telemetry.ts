import { missions } from './missions'

export const jobPlanets = missions.map((mission) => ({
  id: mission.id, name: mission.callsign, mission,
  hue: mission.hue, r: mission.status === 'landed' ? 21 : mission.featured ? 15 : 12,
}))
export type TelemetryPlanet = (typeof jobPlanets)[number]
