import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Hero          from '../components/Hero/Hero'
import CabinRules    from '../components/CabinRules/CabinRules'
import CabinVideo    from '../components/CabinVideo/CabinVideo'
import CabinDistances from '../components/CabinDistances/CabinDistances'
import CabinReserveCTA from '../components/CabinReserveCTA/CabinReserveCTA'
import Footer from '../components/Footer/Footer'
import styles from './Cabin.module.css'

const equipment = [
  { icon: '📶', label: 'Wifi'            },
  { icon: '🍳', label: 'Cocina'          },
  { icon: '🛁', label: '2 Baños'         },
  { icon: '🛏️', label: '2 Habitaciones'  },
]

const allAmenities = [
  { icon: '📶', label: 'Wifi de alta velocidad' },
  { icon: '🍳', label: 'Cocina equipada'         },
  { icon: '🛁', label: '2 Baños completos'       },
  { icon: '🛏️', label: '2 Habitaciones'          },
  { icon: '🔥', label: 'Chimenea'                },
  { icon: '🌿', label: 'Jardín privado'          },
  { icon: '🅿️', label: 'Parqueadero'             },
  { icon: '🧺', label: 'Lavadora'                },
  { icon: '📺', label: 'Smart TV'                },
  { icon: '☕', label: 'Cafetera'                },
  { icon: '🌡️', label: 'Agua caliente'           },
  { icon: '🔐', label: 'Acceso privado'          },
]

function Cabin() {
  const [showModal, setShowModal] = useState(false)

  return (
    <div className={styles.page}>

      {/* Hero */}
      <Hero
        subtitle="Cabana Boutique"
        title="LA CABANA"
        description="Conoce cada espacio, sus comodidades y todo lo que necesitas para disfrutar una estadia unica en medio de la naturaleza."
      />

      <section className={styles.content}>
        <CabinIntroCards />
        <div className={styles.equipmentPanel}>
          <CabinEquipment active />
          <CabinRules />
        </div>
        <CabinVideo videoUrl="/Videos/Video_Recorrido.mp4" />
        <CabinDistances />
        <CabinReserveCTA />
      </section>

      <Footer />
    </div>
  )
}

export default Cabin
