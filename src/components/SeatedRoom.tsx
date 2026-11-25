import { BANKS, PAYLOAD_STATION, W } from './roomLayout'
import { ConsoleBank } from './RoomHardware'

// Translate the eye from the back row to the left Payloads bay. Nearby rows
// shift farther than the projection wall. Lowering the eye lifts desk backs
// into the sightline; the horizon stays level.
function seatTransform(depth: number) {
  const seat = PAYLOAD_STATION
  const eyeX = (seat.x - W / 2) / seat.scale
  const zoom = .7 / (1 - depth / (seat.scale * 1.25))
  return `translate(570 282) scale(${zoom}) translate(${-W/2-eyeX*depth} ${-285-170*depth})`
}

export function SeatedRoom({ callsign, mode }: { callsign: string; mode: 'solar' | 'earth' }) {
  return <div className="seated-sightline" aria-hidden="true">
    <svg className="scene-art" viewBox="0 0 1440 460" preserveAspectRatio="none" focusable="false">
      <rect width="1440" height="460" fill="var(--wall-body)" />
      <g transform={seatTransform(.34)}>
        <use href="#flight-room-shell" />
        <use href="#flight-projection-wall" />
        <g fill="var(--phos)" fontFamily="var(--f-data)">
          <text x="239" y="132" fontSize="11">MISSION CONTROL</text>
          <text x="239" y="158" fontSize="12">{mode === 'solar' ? callsign : 'Ground stations'}</text>
          <text x="1048" y="132" fontSize="11">PROJECTION</text>
          <text x="1048" y="158" fontSize="12">{mode === 'solar' ? 'Orbital telemetry' : 'Earth map'}</text>
        </g>
      </g>
      {BANKS.filter(bank => bank.scale < PAYLOAD_STATION.scale).map(bank =>
        <g key={bank.x} transform={seatTransform(bank.scale)}>
          <ConsoleBank {...bank} showPlates={false} />
        </g>
      )}
    </svg>
  </div>
}

export function WritingShelf() {
  return <svg className="writing-shelf" viewBox="0 0 1200 130" preserveAspectRatio="none" aria-hidden="true" focusable="false">
    <defs>
      <linearGradient id="shelf-enamel" x2=".12" y2="1"><stop stopColor="#aaa997"/><stop offset=".14" stopColor="#d1ceba"/><stop offset="1" stopColor="#e2ddca"/></linearGradient>
      <linearGradient id="mug-glaze"><stop stopColor="#a4a390"/><stop offset=".22" stopColor="#e1deca"/><stop offset=".55" stopColor="#eee8d5"/><stop offset="1" stopColor="#a6a593"/></linearGradient>
    </defs>
    <path d="M19 0H1181l35 112H-16Z" fill="url(#shelf-enamel)" />
    <path d="M0 111h1200v19H0Z" fill="#607466"/><path d="M0 113h1200" stroke="#a9b2a0" strokeWidth="4"/>
    <g transform="matrix(1 -.045 -.32 .60 191 19)">
      <rect x="3" y="6" width="244" height="137" fill="#817f70" opacity=".45"/>
      <rect y="4" width="244" height="136" fill="#c9c6b6" stroke="#95917d"/>
      <rect width="241" height="135" fill="#eee9d4" stroke="#c2beaa"/>
      <path d="M17 35h206m-206 20h206m-206 17h206m-206 17h206m-206 17h206M49 36v86m111-86v86" fill="none" stroke="#929888" />
      <text x="17" y="25" fontFamily="monospace" fontSize="12" fill="#41483e">PAYLOAD OPERATIONS LOG</text>
      {[48,66,84,100].map(y=><path key={y} d={`M24 ${y}h12m22 0q8-5 14-1t17-1l12 1`} fill="none" stroke="#667482"/>)}
    </g>
    <path d="m435 81 100-37 3 4-101 37-12 2Z" fill="#ac874c"/><path d="m425 87 8-5 2 3Z" fill="#4e5047"/>
    <g transform="translate(1002 18)">
      <ellipse cx="6" cy="62" rx="57" ry="10" fill="#686c59" opacity=".29"/>
      <path d="M31 10c36-13 37 38 0 35" fill="none" stroke="#929382" strokeWidth="11"/>
      <path d="M31 8c34-11 35 36 0 34" fill="none" stroke="#dedac8" strokeWidth="7"/>
      <path d="M-33 4q0-9 33-9t33 9l-4 48q-1 12-29 12t-29-12Z" fill="url(#mug-glaze)" stroke="#999b8a"/>
      <ellipse cy="3" rx="32" ry="9" fill="#ece7d4"/><ellipse cy="4" rx="28" ry="6.5" fill="#514437"/>
      <path d="M-21 5q11 4 25 2" fill="none" stroke="#99816a" strokeWidth="1.5"/>
    </g>
  </svg>
}
