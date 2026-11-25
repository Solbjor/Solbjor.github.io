import { missions, STATUS_LABEL } from '../lib/missions'
import { SurfaceView } from './Planet'

export function MissionLog() {
  const log = [...missions].reverse()
  return (
    <section id="missions" className="console console-wide" aria-labelledby="missions-h">
      <h2 id="missions-h" className="placard">
        Mission log
      </h2>
      <div className="glass glass-paper">
        <ol className="log">
          {log.map((m) => (
            <li
              key={m.id}
              id={`mission-${m.id}`}
              tabIndex={-1}
              className={`log-row log-${m.status}${m.featured ? ' log-featured' : ''}`}
            >
              <div className="log-when">
                <span className="log-dates">
                  {m.start} – {m.end}
                </span>
                <span className={`status status-${m.status}`}>
                  <span className={`lamp lamp-${m.status}`} aria-hidden="true" />
                  {STATUS_LABEL[m.status]}
                </span>
              </div>
              <div className="log-body">
                <h3>
                  <span
                    className="log-planet"
                    style={{ background: `hsl(${m.hue} 32% 46%)` }}
                    aria-hidden="true"
                  />
                  {m.title} <span className="log-org">· {m.placement ?? m.org}</span>
                </h3>
                {m.location && <p className="log-site">{m.location}</p>}
                {m.summary && <p className="log-summary">{m.summary}</p>}
                {m.bullets && (
                  <ol className="modules" aria-label="Base modules: the work done">
                    {m.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ol>
                )}
              </div>
              <div className="log-surface">
                <SurfaceView m={m} />
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
