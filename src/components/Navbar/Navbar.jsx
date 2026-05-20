import { useState, useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'
import styles from './Navbar.module.css'

const NAV_LINKS = [
  { to: '/',            label: 'Inicio'              },
  { to: '/cabin',       label: 'La Cabaña'           },
  { to: '/reserve',     label: 'Reservar'            },
  { to: '/about',       label: 'Sobre Villa de Leyva'},
  { to: '/gallery',     label: 'Galería'             },
  { to: '/experiences', label: 'Experiencias'        },
  { to: '/contact',     label: 'Ayuda y Contacto'    },
]

function Navbar() {
  const [scrolled,    setScrolled]    = useState(false)
  const [menuOpen,    setMenuOpen]    = useState(false)

  /* Detecta scroll para cambiar fondo del navbar — patrón TDM */
  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 60)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  /* Cierra el menú mobile si se redimensiona a desktop */
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 768) setMenuOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  /* Bloquea scroll del body cuando el menú mobile está abierto */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  function toggleMenu() {
    setMenuOpen(prev => !prev)
  }

  function closeMenu() {
    setMenuOpen(false)
  }

  return (
    <header className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      {/* Logo */}
      <Link to="/" className={styles.logo} onClick={closeMenu}>
        Camaluna <span className={styles.moon}>🌙</span>
      </Link>

      {/* Links de navegación — desktop */}
      <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`}>
        <ul className={styles.links}>
          {NAV_LINKS.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `${styles.link} ${isActive ? styles.active : ''}`
                }
                onClick={closeMenu}
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* CTA visible en mobile dentro del menú */}
        <Link to="/reserve" className={styles.ctaMobile} onClick={closeMenu}>
          Reservar ahora
        </Link>
      </nav>

      {/* CTA — desktop */}
      <Link to="/reserve" className={styles.ctaDesktop}>
        Reservar
      </Link>

      {/* Botón hamburguesa — mobile */}
      <button
        className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ''}`}
        onClick={toggleMenu}
        aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
        aria-expanded={menuOpen}
      >
        <span />
        <span />
        <span />
      </button>

      {/* Overlay para cerrar menú tocando fuera */}
      {menuOpen && (
        <div className={styles.overlay} onClick={closeMenu} aria-hidden="true" />
      )}
    </header>
  )
}

export default Navbar
