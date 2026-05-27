import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ReservationProvider } from './context/ReservationContext'
import Navbar      from './components/Navbar/Navbar'
import Home        from './pages/Home'
import Cabin       from './pages/Cabin'
import Reserve     from './pages/Reserve'
import About       from './pages/About'
import Contact     from './pages/Contact'
import Gallery     from './pages/Gallery'
import Experiences from './pages/Experiences'
import AdminLogin from './pages/AdminLogin'
import AdminReservations from './pages/AdminReservations'
import Conocenos   from './pages/Conocenos'
import RestaurantsPage from './pages/Restaurants'

function App() {
  return (
    <ReservationProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/"            element={<Home />}        />
          <Route path="/cabin"       element={<Cabin />}       />
          <Route path="/reserve"     element={<Reserve />}     />
          <Route path="/about"       element={<About />}       />
          <Route path="/contact"     element={<Contact />}     />
          <Route path="/gallery"     element={<Gallery />}     />
          <Route path="/experiences" element={<Experiences />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/reservas" element={<AdminReservations />} />
          <Route path="/conocenos"   element={<Conocenos />}   />
          <Route path="/restaurants" element={<RestaurantsPage />} />
        </Routes>
      </BrowserRouter>
    </ReservationProvider>
  )
}

export default App
