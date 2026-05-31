import Restaurants from '../components/Restaurants/Restaurants'
import CtaBanner   from '../components/CtaBanner/CtaBanner'
import Footer      from '../components/Footer/Footer'
import styles      from './Restaurants.module.css'

import { allRestaurants, restaurantsCta } from '../data/restaurantsData'

function RestaurantsPage() {
  return (
    <div className={styles.page}>
      <Restaurants {...allRestaurants} />
      <CtaBanner   {...restaurantsCta} />
      <Footer />
    </div>
  )
}

export default RestaurantsPage
