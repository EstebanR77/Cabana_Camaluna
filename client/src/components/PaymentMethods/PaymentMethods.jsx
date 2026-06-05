import styles from './PaymentMethods.module.css'

const METHODS = [
  {
    id: 'nequi',
    label: 'Nequi',
    detail: '310 777 7579',
    logo: '/images/logo-nequi.png',
  },
  {
    id: 'daviplata',
    label: 'Daviplata',
    detail: '310 777 7579',
    logo: '/images/logo-daviplata.png',
  },
  {
    id: 'bancolombia',
    label: 'Bancolombia',
    detail: 'Ahorros 123-456789-00',
    logo: '/images/logo-bancolombia.png',
  },
]

function PaymentMethods() {
  return (
    <div className={styles.grid}>
      {METHODS.map(({ id, label, detail, logo }) => (
        <div key={id} className={styles.item}>
          <img
            className={styles.logo}
            src={logo}
            alt={`Logo ${label}`}
            loading="lazy"
            decoding="async"
          />
          <p className={styles.label}>{label}</p>
          <p className={styles.detail}>{detail}</p>
        </div>
      ))}
    </div>
  )
}

export default PaymentMethods
