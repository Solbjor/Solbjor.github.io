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

const CLIP_VOLUME = 0.08
const HISS_GAIN = 0.003
const BEEP_GAIN = 0.0125
const GAP_MIN_MS = 7000
const GAP_MAX_MS = 15000

export class CommsAudio {
  private ctx: AudioContext | null = null
  private hiss: AudioBufferSourceNode | null = null
  private clip: HTMLAudioElement | null = null
  private timer: number | undefined
  private keySound: AudioBuffer | null = null
  private keySource: AudioBufferSourceNode | null = null
  private next = 0
  private running = false

  start() {
    if (this.running) return
    this.running = true
    this.ctx ??= new AudioContext()
    void this.ctx.resume()
    this.startHiss()
    this.playKey(false)
    document.addEventListener('click', this.onControlClick, true)
    this.timer = window.setTimeout(() => this.transmit(), 1200)
  }

  stop() {
    this.running = false
    document.removeEventListener('click', this.onControlClick, true)
    this.keySource?.stop()
    this.keySource = null
    window.clearTimeout(this.timer)
    this.clip?.pause()
    this.clip = null
    this.hiss?.stop()
    this.hiss = null
    void this.ctx?.suspend()
  }

  // Native click unifies pointer, touch and keyboard activation. A label's
  // forwarded radio click is the only event that matches its switch.
  private onControlClick = (event: MouseEvent) => {
    if (!(event.target instanceof Element)) return
    const key = event.target.closest('button, a.key, a.station-hit, input[type="radio"]')
    if (!key || key.matches(':disabled, [aria-disabled="true"], .audio-key')) return
    this.playKey(key.matches('.payload-power, input[type="radio"]'))
  }

  private playKey(latching: boolean) {
    const ctx = this.ctx!
    if (!this.keySound) {
      const buffer = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * .044), ctx.sampleRate)
      const samples = buffer.getChannelData(0)
      // A muted spring impact followed by the softer contact settling.
      for (let i = 0; i < samples.length; i++) {
        const t = i / ctx.sampleRate
        const attack = Math.min(t / .001, 1)
        const impact = Math.sin(2 * Math.PI * 610 * t) + .5 * Math.sin(2 * Math.PI * 1170 * t)
        const settle = t > .009 ? .38 * Math.sin(2 * Math.PI * 340 * (t - .009)) * Math.exp(-210 * (t - .009)) : 0
        samples[i] = .022 * attack * (impact * Math.exp(-240 * t) + settle)
      }
      this.keySound = buffer
    }
    // One voice keeps rapid channel changes at the same level as one press.
    this.keySource?.stop()
    const src = ctx.createBufferSource()
    src.buffer = this.keySound
    src.playbackRate.value = latching ? .75 : 1
    src.connect(ctx.destination)
    this.keySource = src
    src.onended = () => {
      src.disconnect()
      if (this.keySource === src) this.keySource = null
    }
    src.start()
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
