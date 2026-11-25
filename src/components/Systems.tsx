import { certifications, education, profile, skills } from '../data/content'

export function Systems() {
  return (
    <section id="systems" className="console" aria-labelledby="systems-h">
      <h2 id="systems-h" className="placard">
        Systems
      </h2>
      <div className="glass glass-paper systems">
        {skills.map((g) => (
          <div key={g.label} className="system">
            <h3>{g.label}</h3>
            <ul className="tags">
              {g.skills.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}

export function Training() {
  return (
    <section id="training" className="console" aria-labelledby="training-h">
      <h2 id="training-h" className="placard">
        Training
      </h2>
      <div className="glass glass-paper training">
        <h3>Schools</h3>
        <ul className="training-list">
          {education.map((e) => (
            <li key={e.school}>
              <span className="training-name">{e.school}</span>
              <span className="training-meta">
                {e.credential}
                {e.years && <> · {e.years}</>}
              </span>
            </li>
          ))}
        </ul>
        <h3>Certifications</h3>
        <ul className="training-list">
          {certifications.map((c) => (
            <li key={c.name}>
              <span className="training-name">{c.name}</span>
              {(c.issuer || c.year) && (
                <span className="training-meta">{[c.issuer, c.year].filter(Boolean).join(' · ')}</span>
              )}
            </li>
          ))}
        </ul>
        <p className="training-crew">Crew affiliations: {profile.communities.join(', ')}</p>
      </div>
    </section>
  )
}
