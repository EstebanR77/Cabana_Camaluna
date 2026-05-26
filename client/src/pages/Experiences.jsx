import Adventures from '../components/Adventures/Adventures'
import CtaBanner  from '../components/CtaBanner/CtaBanner'
import Footer     from '../components/Footer/Footer'
import styles     from './Experiences.module.css'

import { allAdventures, experiencesCta } from '../data/experiencesData'

function Experiences() {
  return (
    <div className={styles.page}>
      <Adventures {...allAdventures} />
      <CtaBanner  {...experiencesCta} />
      <Footer variant="orange" />
    </div>
  )
}

export default Experiences
