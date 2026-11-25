// Ambient mission-control comms: NASA public-domain clips wrapped in
// Quindar tones, over a faint radio hiss. Opt-in only; never autoplays.

const CLIPS = [
  'audio/apollo11-countdown.mp3',
  'audio/sts-houston-discovery.mp3',
  'audio/mercury4-clock-started.mp3',
  'audio/sts-roger-roll.mp3',
  'audio/apollo11-eagle-has-landed.mp3',
  'audio/sts-go-at-throttle-up.mp3',
]

const CLIP_VOLUME = 0.32
const HISS_GAIN = 0.012
const BEEP_GAIN = 0.05
const GAP_MIN_MS = 7000
const GAP_MAX_MS = 15000

export class CommsAudio {
  private ctx: AudioContext | null = null
  private hiss: AudioBufferSourceNode | null = null
  private clip: HTMLAudioElement | null = null
  private timer: number | undefined
  private next = 0
  private running = false

  start() {
    if (this.running) return
    this.running = true
    this.ctx ??= new AudioContext()
    void this.ctx.resume()
    this.startHiss()
    this.timer = window.setTimeout(() => this.transmit(), 1200)
  }

  stop() {
    this.running = false
    window.clearTimeout(this.timer)
    this.clip?.pause()
    this.clip = null
    this.hiss?.stop()
    this.hiss = null
    void this.ctx?.suspend()
  }

  private startHiss() {
    const ctx = this.ctx!
    const seconds = 2
    const buffer = ctx.createBuffer(1, ctx.sampleRate * seconds, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
    const src = ctx.createBufferSource()
    src.buffer = buffer
    src.loop = true
    const band = ctx.createBiquadFilter()
    band.type = 'bandpass'
    band.frequency.value = 1800
    band.Q.value = 0.6
    const gain = ctx.createGain()
    gain.gain.value = HISS_GAIN
    src.connect(band).connect(gain).connect(ctx.destination)
    src.start()
    this.hiss = src
  }

  /** One Quindar tone: 2525 Hz opens a transmission, 2475 Hz closes it. */
  private beep(freq: number): Promise<void> {
    const ctx = this.ctx!
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.frequency.value = freq
    const t = ctx.currentTime
    gain.gain.setValueAtTime(0, t)
    gain.gain.linearRampToValueAtTime(BEEP_GAIN, t + 0.01)
    gain.gain.setValueAtTime(BEEP_GAIN, t + 0.24)
    gain.gain.linearRampToValueAtTime(0, t + 0.25)
    osc.connect(gain).connect(ctx.destination)
    osc.start(t)
    osc.stop(t + 0.26)
    return new Promise((resolve) => window.setTimeout(resolve, 300))
  }

  private async transmit() {
    if (!this.running) return
    const src = CLIPS[this.next % CLIPS.length]!
    this.next++
    await this.beep(2525)
    if (!this.running) return
    const clip = new Audio(src)
    clip.volume = CLIP_VOLUME
    this.clip = clip
    const done = async () => {
      if (!this.running || this.clip !== clip) return
      await this.beep(2475)
      const gap = GAP_MIN_MS + Math.random() * (GAP_MAX_MS - GAP_MIN_MS)
      this.timer = window.setTimeout(() => this.transmit(), gap)
    }
    clip.addEventListener('ended', done, { once: true })
    clip.addEventListener('error', done, { once: true })
    try {
      await clip.play()
    } catch {
      void done()
    }
  }
}
