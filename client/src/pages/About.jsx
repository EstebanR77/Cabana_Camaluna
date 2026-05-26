import AboutHero        from '../components/AboutHero/AboutHero'
import Weather          from '../components/Weather/Weather'
import Adventures       from '../components/Adventures/Adventures'
import FeaturedFestival from '../components/FeaturedFestival/FeaturedFestival'
import FestivalsList    from '../components/FestivalsList/FestivalsList'
import CamalunaHistory  from '../components/CamalunaHistory/CamalunaHistory'
import TouristSites     from '../components/TouristSites/TouristSites'
import Restaurants      from '../components/Restaurants/Restaurants'
import CtaBanner        from '../components/CtaBanner/CtaBanner'
import Footer           from '../components/Footer/Footer'
import styles           from './About.module.css'

import {
  aboutHero,
  weather,
  adventures,
  featuredFestival,
  festivalsList,
  camalunaHistory,
  touristSites,
  restaurants,
  aboutCta,
} from '../data/aboutData'

function About() {
  return (
    <div className={styles.page}>
      <AboutHero        {...aboutHero} />
      <Weather          {...weather} />
      <Adventures       {...adventures} />
      <FeaturedFestival {...featuredFestival} />
      <FestivalsList    items={festivalsList} />
      <CamalunaHistory  {...camalunaHistory} />
      <TouristSites     {...touristSites} />
      <Restaurants      {...restaurants} />
      <CtaBanner        {...aboutCta} />
      <Footer variant="orange" />
    </div>
  )
}

export default About
