// Ambient mission-control comms: NASA public-domain clips wrapped in
// Quindar tones, over a faint radio hiss. Opt-in only; never autoplays.

import { makeBootSound } from './consoleSounds'

const CLIPS = [
  'audio/apollo11-countdown.mp3',
  'audio/sts-houston-discovery.mp3',
  'audio/mercury4-clock-started.mp3',
  'audio/sts-roger-roll.mp3',
  'audio/apollo11-eagle-has-landed.mp3',
  'audio/sts-go-at-throttle-up.mp3',
]

const CLIP_VOLUME = 0.08
const KEY_VOLUME = 0.32
// The supplied recording has a short lead-in and a quiet tail.
const KEY_START = 0.19
const KEY_END = 0.34
const HISS_GAIN = 0.003
const BEEP_GAIN = 0.0125
const GAP_MIN_MS = 7000
const GAP_MAX_MS = 15000

export class CommsAudio {
  private ctx: AudioContext | null = null
  private hiss: AudioBufferSourceNode | null = null
  private clip: HTMLAudioElement | null = null
  private timer: number | undefined
  private keyBuffer?: Promise<AudioBuffer | null>
  private keySource: AudioBufferSourceNode | null = null
  private bootSource: AudioBufferSourceNode | null = null
  private next = 0
  private generation = 0
  private running = false

  start(boot: boolean) {
    if (this.running) return
    this.running = true
    this.ctx ??= new AudioContext()
    void this.ctx.resume()
    void this.loadKey()
    this.startHiss()
    if (boot) {
      const src = this.play(makeBootSound(this.ctx))
      this.bootSource = src
      src.addEventListener('ended', () => {
        if (this.bootSource === src) this.bootSource = null
      }, { once: true })
    } else {
      void this.playKey()
    }
    document.addEventListener('click', this.onControlClick, true)
    this.timer = window.setTimeout(() => this.transmit(), boot ? 2350 : 1200)
  }

  stop() {
    this.running = false
    this.generation++
    document.removeEventListener('click', this.onControlClick, true)
    this.keySource?.stop()
    this.keySource = null
    this.bootSource?.stop()
    this.bootSource = null
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
    void this.playKey()
  }

  private loadKey() {
    const ctx = this.ctx!
    this.keyBuffer ??= fetch(`${import.meta.env.BASE_URL}audio/console-button.mp3`)
      .then(async response => {
        if (!response.ok) throw new Error(`Button sound: HTTP ${response.status}`)
        const recording = await ctx.decodeAudioData(await response.arrayBuffer())
        const start = Math.round(KEY_START * recording.sampleRate)
        const end = Math.min(recording.length, Math.round(KEY_END * recording.sampleRate))
        const sample = ctx.createBuffer(recording.numberOfChannels, end - start, recording.sampleRate)
        for (let channel = 0; channel < sample.numberOfChannels; channel++) {
          const source = recording.getChannelData(channel)
          const target = sample.getChannelData(channel)
          for (let i = 0; i < target.length; i++) target[i] = source[start + i]! * KEY_VOLUME
        }
        return sample
      })
      .catch(() => {
        this.keyBuffer = undefined
        return null
      })
    return this.keyBuffer
  }

  private async playKey() {
    const generation = this.generation
    const sample = await this.loadKey()
    if (!sample || !this.running || generation !== this.generation) return

    // One voice keeps rapid channel changes at the same level as one press.
    this.keySource?.stop()
    const src = this.play(sample)
    this.keySource = src
    src.addEventListener('ended', () => {
      if (this.keySource === src) this.keySource = null
    }, { once: true })
  }

  private play(buffer: AudioBuffer) {
    const ctx = this.ctx!
    const src = ctx.createBufferSource()
    src.buffer = buffer
    src.connect(ctx.destination)
    src.addEventListener('ended', () => src.disconnect(), { once: true })
    src.start()
    return src
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
    const generation = this.generation
    const src = CLIPS[this.next % CLIPS.length]!
    this.next++
    await this.beep(2525)
    if (generation !== this.generation) return
    const clip = new Audio(src)
    clip.volume = CLIP_VOLUME
    this.clip = clip
    const done = async () => {
      if (this.clip !== clip) return
      this.clip = null
      await this.beep(2475)
      if (generation !== this.generation) return
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
