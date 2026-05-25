import { motion } from 'framer-motion'
import styles from './PageTransition.module.css'

function PageTransition({ children }) {
  return (
    <motion.main
      className={styles.page}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      {children}
    </motion.main>
  )
}

export default PageTransition
