import { useState, type FormEvent } from 'react'
import { profile } from '../data/content'

type Link = 'ready' | 'sending' | 'sent' | 'failed'

const LINK_TEXT: Record<Link, string> = {
  ready: 'Channel open. Ready to transmit.',
  sending: 'Transmitting…',
  sent: 'Message received. Andrew will reply by email.',
  failed: 'Transmission failed. Try again, or email directly.',
}

export function Comms() {
  const [link, setLink] = useState<Link>('ready')
  const [copied, setCopied] = useState(false)

  async function transmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    setLink('sending')
    try {
      const res = await fetch(profile.formspree, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      })
      if (!res.ok) throw new Error(String(res.status))
      form.reset()
      setLink('sent')
    } catch {
      setLink('failed')
    }
  }

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2400)
    } catch {
      window.location.href = `mailto:${profile.email}`
    }
  }

  return (
    <section id="comms" className="console console-wide comms" aria-labelledby="comms-h">
      <h2 id="comms-h" className="placard">
        Comms
      </h2>
      <div className="comms-grid">
        <div className="comms-direct">
          <p className="comms-lead">Building something mission-driven? Open a channel.</p>
          <p className="comms-email">
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
          </p>
          <div className="comms-keys">
            <button type="button" className="key" onClick={copyEmail} aria-live="polite">
              {copied ? 'Copied' : 'Copy email'}
            </button>
            <a className="key" href={profile.links.linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn<span className="sr-only"> (opens in a new tab)</span>
            </a>
            <a className="key" href={profile.links.github} target="_blank" rel="noopener noreferrer">
              GitHub<span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        </div>

        <form className="glass glass-form" action={profile.formspree} method="POST" onSubmit={transmit}>
          <p className={`link-status link-${link}`} role="status">
            <span className={`lamp lamp-${link === 'failed' ? 'alert' : link === 'sent' ? 'active' : 'idle'}`} aria-hidden="true" />
            {LINK_TEXT[link]}
          </p>
          <label>
            <span>Name</span>
            <input name="name" type="text" autoComplete="name" required />
          </label>
          <label>
            <span>Email</span>
            <input name="email" type="email" autoComplete="email" required />
          </label>
          <label>
            <span>Message</span>
            <textarea name="message" rows={5} required />
          </label>
          <button type="submit" className="key key-lit key-large" disabled={link === 'sending'}>
            {link === 'sending' ? 'Transmitting…' : 'Transmit'}
          </button>
        </form>
      </div>
    </section>
  )
}
