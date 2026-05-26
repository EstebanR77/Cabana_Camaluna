import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ReservationProvider } from './context/ReservationContext'
import Navbar      from './components/Navbar/Navbar'
import FloatingChat from './components/chat/FloatingChat'
import ScrollToTop from './components/ScrollToTop/ScrollToTop'
import Home        from './pages/Home'
import Cabin       from './pages/Cabin'
import Reserve     from './pages/Reserve'
import About       from './pages/About'
import Contact     from './pages/Contact'
import Gallery     from './pages/Gallery'
import Experiences from './pages/Experiences'
import Conocenos   from './pages/Conocenos'

function App() {
  return (
    <ReservationProvider>
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
        </Routes>
        <FloatingChat />
      </BrowserRouter>
    </ReservationProvider>
  )
}

export default App
