import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ReservationProvider } from './context/ReservationContext'
import { ReservationStatusProvider } from './context/ReservationStatusContext'
import Navbar      from './components/Navbar/Navbar'
import FloatingActions from './components/FloatingActions/FloatingActions'
import ScrollToTop from './components/ScrollToTop/ScrollToTop'
import Home from './pages/Home'
import Cabin from './pages/Cabin'
import Reserve from './pages/Reserve'
import About from './pages/About'
import Contact from './pages/Contact'
import Gallery from './pages/Gallery'
import Experiences from './pages/Experiences'
import Conocenos from './pages/Conocenos'
import RestaurantsPage from './pages/Restaurants'
import AdminLogin from './pages/AdminLogin'
import AdminReservations from './pages/AdminReservations'

function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/cabin" element={<PageTransition><Cabin /></PageTransition>} />
        <Route path="/reserve" element={<PageTransition><Reserve /></PageTransition>} />
        <Route path="/about" element={<PageTransition><About /></PageTransition>} />
        <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
        <Route path="/gallery" element={<PageTransition><Gallery /></PageTransition>} />
        <Route path="/experiences" element={<PageTransition><Experiences /></PageTransition>} />
        <Route path="/conocenos" element={<PageTransition><Conocenos /></PageTransition>} />
        <Route path="/restaurants" element={<PageTransition><RestaurantsPage /></PageTransition>} />
        <Route path="/admin" element={<PageTransition><AdminLogin /></PageTransition>} />
        <Route path="/admin/reservas" element={<PageTransition><AdminReservations /></PageTransition>} />
        <Route path="/Experiences" element={<Navigate to="/experiences" replace />} />
        <Route path="/Contact" element={<Navigate to="/contact" replace />} />
      </Routes>
    </>
  )
}

function App() {
  return (
    <ReservationProvider>
      <ReservationStatusProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Navbar />
        <Routes>
          <Route path="/"            element={<Home />}        />
          <Route path="/cabin"       element={<Cabin />}       />
          <Route path="/reserve"     element={<Reserve />}     />
          <Route path="/about"       element={<About />}       />
          <Route path="/contact"     element={<Contact />}     />
          <Route path="/gallery"     element={<Gallery />}     />
          <Route path="/experiences" element={<Experiences />} />
          <Route path="/conocenos"   element={<Conocenos />}   />
          <Route path="/restaurants" element={<RestaurantsPage />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/reservas" element={<AdminReservations />} />
        </Routes>
        <FloatingActions />
      </BrowserRouter>
      </ReservationStatusProvider>
    </ReservationProvider>
  )
}

export default App
