import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { ReservationProvider } from './context/ReservationContext'
import Navbar from './components/Navbar/Navbar'
import PageTransition from './components/PageTransition/PageTransition'
import ScrollProgress from './components/ScrollProgress/ScrollProgress'

const Home = lazy(() => import('./pages/Home'))
const Cabin = lazy(() => import('./pages/Cabin'))
const Reserve = lazy(() => import('./pages/Reserve'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const Gallery = lazy(() => import('./pages/Gallery'))
const Experiences = lazy(() => import('./pages/Experiences'))
const Conocenos = lazy(() => import('./pages/Conocenos'))

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <>
      <Navbar />
      <Suspense fallback={<div className="routeLoader">Cargando...</div>}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
            <Route path="/cabin" element={<PageTransition><Cabin /></PageTransition>} />
            <Route path="/reserve" element={<PageTransition><Reserve /></PageTransition>} />
            <Route path="/about" element={<PageTransition><About /></PageTransition>} />
            <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
            <Route path="/gallery" element={<PageTransition><Gallery /></PageTransition>} />
            <Route path="/experiences" element={<PageTransition><Experiences /></PageTransition>} />
            <Route path="/conocenos" element={<PageTransition><Conocenos /></PageTransition>} />
          </Routes>
        </AnimatePresence>
      </Suspense>
    </>
  )
}

function App() {
  return (
    <ReservationProvider>
      <BrowserRouter>
        <ScrollProgress />
        <AnimatedRoutes />
      </BrowserRouter>
    </ReservationProvider>
  )
}

export default App
