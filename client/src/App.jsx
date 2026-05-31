import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ReservationProvider } from './context/ReservationContext'
import Navbar from './components/Navbar/Navbar'
import PageTransition from './components/PageTransition/PageTransition'
import ScrollProgress from './components/ScrollProgress/ScrollProgress'
import ScrollToTop from './components/ScrollToTop/ScrollToTop'

const Home = lazy(() => import('./pages/Home'))
const Cabin = lazy(() => import('./pages/Cabin'))
const Reserve = lazy(() => import('./pages/Reserve'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const Gallery = lazy(() => import('./pages/Gallery'))
const Experiences = lazy(() => import('./pages/Experiences'))
const Conocenos = lazy(() => import('./pages/Conocenos'))
const AdminLogin = lazy(() => import('./pages/AdminLogin'))
const AdminReservations = lazy(() => import('./pages/AdminReservations'))

function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <Suspense fallback={<div className="routeLoader">Cargando...</div>}>
        <Routes>
          <Route path="/" element={<PageTransition><Home /></PageTransition>} />
          <Route path="/cabin" element={<PageTransition><Cabin /></PageTransition>} />
          <Route path="/reserve" element={<PageTransition><Reserve /></PageTransition>} />
          <Route path="/about" element={<PageTransition><About /></PageTransition>} />
          <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
          <Route path="/gallery" element={<PageTransition><Gallery /></PageTransition>} />
          <Route path="/experiences" element={<PageTransition><Experiences /></PageTransition>} />
          <Route path="/conocenos" element={<PageTransition><Conocenos /></PageTransition>} />
          <Route path="/admin" element={<PageTransition><AdminLogin /></PageTransition>} />
          <Route path="/admin/reservas" element={<PageTransition><AdminReservations /></PageTransition>} />
          <Route path="/Experiences" element={<Navigate to="/experiences" replace />} />
          <Route path="/Contact" element={<Navigate to="/contact" replace />} />
        </Routes>
      </Suspense>
    </>
  )
}

function App() {
  return (
    <ReservationProvider>
      <BrowserRouter>
        <ScrollProgress />
        <AppRoutes />
      </BrowserRouter>
    </ReservationProvider>
  )
}

export default App
