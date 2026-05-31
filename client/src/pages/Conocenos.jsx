import Hero          from '../components/Hero/Hero'
import WhoWeAre      from '../components/WhoWeAre/WhoWeAre'
import OurHistory    from '../components/OurHistory/OurHistory'
import Achievements  from '../components/Achievements/Achievements'
import OurValues     from '../components/OurValues/OurValues'
import CtaBanner     from '../components/CtaBanner/CtaBanner'
import Footer        from '../components/Footer/Footer'
import styles        from './Conocenos.module.css'

import {
  conocenosHero,
  whoWeAre,
  ourHistory,
  achievements,
  ourValues,
  ctaBanner,
} from '../data/conocenosData'

function Conocenos() {
  return (
    <div className={styles.page}>
      <Hero
        title={conocenosHero.title}
        description={conocenosHero.subtitle}
        bgImage={conocenosHero.image}
      />
      <WhoWeAre      {...whoWeAre} />
      <OurHistory    {...ourHistory} />
      <Achievements  {...achievements} />
      <OurValues     {...ourValues} />
      <CtaBanner     {...ctaBanner} />
      <Footer />
    </div>
  )
}

export default Conocenos
