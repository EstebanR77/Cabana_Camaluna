import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Navbar.module.css';

const NAV_LINKS = [
  { label: 'La cabaña',             to: '/cabin'   },
  { label: 'Reservar',              to: '/reserve' },
  { label: 'Sobre Villa de Leyva',  to: '/about'   },
  { label: 'Galería',               to: '/gallery' },
  { label: 'Conócenos',             to: '/#conocenos' },
  { label: 'Experiencias/Reseñas',  to: '/#resenas'   },
  { label: 'Ayuda y Contacto',      to: '/contact' },
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const navClass = [styles.navbar, scrolled ? styles.scrolled : ''].join(' ');
  const linksClass = [styles.links, menuOpen ? styles.open : ''].join(' ');
  const burgerClass = [styles.hamburger, menuOpen ? styles.open : ''].join(' ');

  return (
    <nav className={navClass}>
      {/* Logo */}
      <Link to="/" className={styles.logo}>
        <img src="/images/logo.png" alt="Camaluna" className={styles.logoImg} />
        <span className={styles.logoText}>CAMALUNA</span>
      </Link>

      {/* Hamburger (móvil) */}
      <button
        className={burgerClass}
        onClick={() => setMenuOpen(o => !o)}
        aria-label="Menú"
      >
        <span /><span /><span />
      </button>

      {/* Links */}
      <ul className={linksClass}>
        {NAV_LINKS.map(({ label, to }) => (
          <li key={to}>
            <Link
              to={to}
              className={pathname === to ? styles.active : ''}
            >
              {label}
            </Link>
          </li>
        ))}
        <li>
          <Link to="/reserve" className={styles.ctaBtn}>
            RESERVA YA!
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
