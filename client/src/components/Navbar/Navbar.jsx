import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import CabinReserveCTA from '../CabinReserveCTA/CabinReserveCTA';
import styles from './Navbar.module.css';

const NAV_LINKS = [
  { label: 'La cabaña', to: '/cabin' },
  { label: 'Reservar', to: '/reserve' },
  { label: 'Sobre Villa de Leyva', to: '/about' },
  { label: 'Galería', to: '/gallery' },
  { label: 'Reseñas', to: '/experiences' },
  { label: 'Ayuda', to: '/contact' },
  { label: 'Conócenos', to: '/conocenos' },
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname, hash]);

  const isActiveLink = (to) => {
    const [targetPath, targetHash = ''] = to.split('#');
    const normalizedPath = targetPath || '/';
    const normalizedHash = targetHash ? `#${targetHash}` : '';

    return pathname === normalizedPath && hash === normalizedHash;
  };

  const navClass = [styles.navbar, scrolled ? styles.scrolled : ''].join(' ');
  const linksClass = [styles.links, menuOpen ? styles.open : ''].join(' ');
  const burgerClass = [styles.hamburger, menuOpen ? styles.open : ''].join(' ');

  return (
    <nav className={navClass}>
      <Link to="/" className={styles.logo} aria-label="Camaluna inicio">
        <img src="/images/logo.png" alt="Camaluna" className={styles.logoImg} />
        <span className={styles.logoText}>Cabaña Camaluna</span>
      </Link>

      <button
        className={burgerClass}
        type="button"
        onClick={() => setMenuOpen(open => !open)}
        aria-label="Menú"
        aria-expanded={menuOpen}
        aria-controls="main-navigation"
      >
        <span />
        <span />
        <span />
      </button>

      <ul className={linksClass} id="main-navigation">
        {NAV_LINKS.map(({ label, to }) => (
          <li key={to}>
            <Link to={to} className={isActiveLink(to) ? styles.active : ''}>
              {label}
            </Link>
          </li>
        ))}
        <li className={styles.ctaItem}>
          <CabinReserveCTA />
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
