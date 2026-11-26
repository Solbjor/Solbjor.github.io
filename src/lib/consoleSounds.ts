const TAU = 2 * Math.PI
const tone = (frequency: number, time: number) => Math.sin(TAU * frequency * time)

function sound(ctx: AudioContext, seconds: number, render: (time: number) => number) {
  const buffer = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * seconds), ctx.sampleRate)
  const samples = buffer.getChannelData(0)
  for (let i = 0; i < samples.length; i++) samples[i] = render(i / ctx.sampleRate)
  return buffer
}

function ring(t: number, frequency: number, decay: number) {
  if (t < 0) return 0
  return Math.min(t / .0006, 1) * tone(frequency, t) * Math.exp(-decay * t)
}

function makeRelaySound(ctx: AudioContext) {
  let previousNoise = 0
  return sound(ctx, .086, t => {
    const noise = Math.random() * 2 - 1
    const edge = (noise - previousNoise) * .5
    previousNoise = noise
    const contact = t - .012
    const snap = contact > 0 ? edge * Math.min(contact / .0006, 1) * Math.exp(-360 * contact) : 0
    const cap = .052 * ring(t, 266, 130)
    const body = .106 * ring(contact, 188, 112)
    const spring = .062 * ring(contact, 770, 235)
    const settle = .034 * ring(contact - .018, 315, 174)
    return cap + body + spring + .093 * snap + settle
  })
}

// Text begins drawing at these times in the room's CRT startup animation.
const SCAN_LINES = [.390, .740, 1.110]
const PACKETS = [0, .026, .057, .091, .140, .177, .203]

export function makeBootSound(ctx: AudioContext) {
  const relay = makeRelaySound(ctx).getChannelData(0)
  const ticks = SCAN_LINES.flatMap((line, index) => PACKETS.map((delay, key) => ({
    start: line + delay,
    pitch: [960, 1310, 1690, 870, 1490, 1170, 1560][(key + index * 2) % PACKETS.length]!,
  })))
  return sound(ctx, 1.64, t => {
    const secondsAfterRelay = Math.max(0, t - .012)
    const fadeIn = Math.min(secondsAfterRelay / .021, 1)
    // Inrush hum falls away as the tube warms and the flyback settles.
    const inrush = fadeIn * Math.exp(-10 * secondsAfterRelay)
      * (.082 * tone(60, secondsAfterRelay) + .032 * tone(120, secondsAfterRelay) + .014 * tone(180, secondsAfterRelay))
    const sweep = .026 * fadeIn * Math.exp(-5.5 * secondsAfterRelay)
      * Math.sin(TAU * (2170 * secondsAfterRelay + 940 * (1 - Math.exp(-9 * secondsAfterRelay)) / 9))
    let terminal = 0
    for (const { start, pitch } of ticks) {
      const age = t - start
      if (age < 0 || age >= .022) continue
      const envelope = Math.min(age / .002, 1) * (1 - age / .022) ** 2
      terminal += envelope * (.038 * tone(pitch, age) + .009 * tone(pitch * 2.01, age))
    }
    const ready = .030 * ring(t - 1.39, 660, 25) + .022 * ring(t - 1.45, 910, 34)
    return (relay[Math.round(t * ctx.sampleRate)] ?? 0) * .87 + inrush + sweep + terminal + ready
  })
}
