import { useState } from 'react'
import ReactCalendar from 'react-calendar'
import { motion } from 'framer-motion'
import { useCalendar } from '../../hooks/useCalendar'
import styles from './ReservationCalendar.module.css'

function ReservationCalendar({ onRangeSelect }) {
  const { reservedDates } = useCalendar()
  const [range, setRange] = useState([null, null])

  function tileDisabled({ date }) {
    return reservedDates.some(r => {
      const checkIn  = new Date(r.checkIn)
      const checkOut = new Date(r.checkOut)
      return date >= checkIn && date <= checkOut
    })
  }

  function tileClassName({ date }) {
    const isReserved = reservedDates.some(r => {
      const checkIn  = new Date(r.checkIn)
      const checkOut = new Date(r.checkOut)
      return date >= checkIn && date <= checkOut
    })
    return isReserved ? styles.reserved : null
  }

  function handleChange(value) {
    setRange(value)
    if (onRangeSelect) onRangeSelect({ checkIn: value[0], checkOut: value[1] })
  }

  return (
    <motion.div
      className={styles.wrapper}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className={styles.title}>Selecciona tus fechas</h3>
      <ReactCalendar
        selectRange
        onChange={handleChange}
        value={range}
        tileDisabled={tileDisabled}
        tileClassName={tileClassName}
        minDate={new Date()}
      />
      <div className={styles.legend}>
        <span className={styles.legendItem}>
          <span className={styles.dotAvailable} /> Disponible
        </span>
        <span className={styles.legendItem}>
          <span className={styles.dotReserved} /> Reservado
        </span>
      </div>
    </motion.div>
  )
}

export default ReservationCalendar
