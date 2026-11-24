import { education, experience, profile, projects } from './data/content'

// Scaffold only: plain rendering of content.ts to prove the pipeline works.
// Real components (Hero, ExperienceTimeline, ProjectCard, Contact, ...) go in src/components/.
export default function App() {
  return (
    <main>
      <header>
        <h1>{profile.name}</h1>
        <p>{profile.headline}</p>
      </header>

      <section id="experience">
        <h2>Experience</h2>
        <ul>
          {experience.map((r) => (
            <li key={`${r.org}-${r.title}`}>
              <strong>{r.title}</strong> — {r.org} ({r.start} – {r.end})
            </li>
          ))}
        </ul>
      </section>

      <section id="projects">
        <h2>Projects</h2>
        <ul>
          {projects.map((p) => (
            <li key={p.name}>
              {p.link ? <a href={p.link}>{p.name}</a> : p.name}: {p.description}
            </li>
          ))}
        </ul>
      </section>

      <section id="education">
        <h2>Education</h2>
        <ul>
          {education.map((e) => (
            <li key={e.school}>
              {e.school}, {e.credential} ({e.years})
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
