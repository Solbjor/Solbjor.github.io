import { Comms } from './components/Comms'
import { RoomView } from './components/RoomView'
import { Header } from './components/Header'
import { MissionLog } from './components/MissionLog'
import { Payloads } from './components/Payloads'
import { Systems, Training } from './components/Systems'
import { profile } from './data/content'
import { useWatch } from './lib/useWatch'

const YEAR = new Date().getFullYear()

export default function App() {
  const { watch, setWatch } = useWatch()

  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <div className="room">
        <main id="main" tabIndex={-1}>
          <RoomView header={<Header watch={watch} onWatch={setWatch} />} />
          <MissionLog />
          <Payloads />
          <div className="bank">
            <Systems />
            <Training />
          </div>
          <Comms />
        </main>
        <footer className="room-foot">
          <p>
            © {YEAR} {profile.name} · {profile.location}
          </p>
          <p>
            <a href="https://github.com/Solbjor/Solbjor.github.io" target="_blank" rel="noopener noreferrer">
              Source<span className="sr-only"> (opens in a new tab)</span>
            </a>
          </p>
        </footer>
      </div>
    </>
  )
}
