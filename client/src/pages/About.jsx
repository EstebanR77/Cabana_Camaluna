import Hero             from '../components/Hero/Hero'
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
      <Hero
        title={aboutHero.title}
        description={aboutHero.subtitle}
        bgImage={aboutHero.image}
      />
      <Weather          {...weather} />
      <Adventures       {...adventures} />
      <FeaturedFestival {...featuredFestival} />
      <FestivalsList    items={festivalsList} />
      <CamalunaHistory  {...camalunaHistory} />
      <TouristSites
        title={touristSites.title}
        items={touristSites.items}
      />
      <Restaurants
        {...restaurants}
        mapEmbed={touristSites.mapEmbed}
        mapUrl={touristSites.mapUrl}
      />
      <CtaBanner        {...aboutCta} />
      <Footer variant="orange" />
    </div>
  )
}

export default About
