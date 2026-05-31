import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Navbar.module.css';

const NAV_LINKS = [
  {
    label: 'La cabaña',
    to: '/cabin',
    hover: {
      background: 'var(--color-green-light)',
      border: 'var(--color-green-light)',
      color: 'var(--color-text-light)',
    },
  },
  {
    label: 'Reservar',
    to: '/reserve',
    hover: {
      background: 'var(--color-green-dark)',
      border: 'var(--color-green-dark)',
      color: 'var(--color-text-light)',
    },
  },
  {
    label: 'Sobre Villa de Leyva',
    to: '/about',
    hover: {
      background: 'var(--color-page-bg)',
      border: 'var(--color-green-light)',
      color: 'var(--color-text-main)',
    },
  },
  {
    label: 'Galería',
    to: '/gallery',
    hover: {
      background: 'var(--color-orange-soft)',
      border: 'var(--color-orange-soft)',
      color: 'var(--color-text-light)',
    },
  },
  {
    label: 'Conócenos',
    to: '/conocenos',
    hover: {
      background: 'var(--color-green)',
      border: 'var(--color-green)',
      color: 'var(--color-text-light)',
    },
  },
  {
    label: 'Experiencias/Reseñas',
    to: '/experiences',
    hover: {
      background: 'var(--color-orange)',
      border: 'var(--color-orange)',
      color: 'var(--color-text-light)',
    },
  },
  {
    label: 'Ayuda y Contacto',
    to: '/contact',
    hover: {
      background: 'var(--color-brown-light)',
      border: 'var(--color-brown-light)',
      color: 'var(--color-text-light)',
    },
  },
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isReserveHovered, setIsReserveHovered] = useState(false);
  const [reserveHoverClass, setReserveHoverClass] = useState('');
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

  useEffect(() => {
    setReserveHoverClass(isReserveHovered ? styles.ctaBtnActive : '');
  }, [isReserveHovered]);

  const isActiveLink = (to) => {
    const [targetPath, targetHash = ''] = to.split('#');
    const normalizedPath = targetPath || '/';
    const normalizedHash = targetHash ? `#${targetHash}` : '';

    return pathname === normalizedPath && hash === normalizedHash;
  };

  const getHoverStyle = ({ background, border, color }) => ({
    '--nav-hover-bg': background,
    '--nav-hover-border': border,
    '--nav-hover-color': color,
  });

  const navClass = [styles.navbar, scrolled ? styles.scrolled : ''].join(' ');
  const linksClass = [styles.links, menuOpen ? styles.open : ''].join(' ');
  const burgerClass = [styles.hamburger, menuOpen ? styles.open : ''].join(' ');

  return (
    <nav className={navClass}>
      <Link to="/" className={styles.logo}>
        <img src="/images/logo.png" alt="Camaluna" className={styles.logoImg} />
        <span className={styles.logoText}>CAMALUNA</span>
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
        {NAV_LINKS.map(({ label, to, hover }) => (
          <li key={to}>
            <Link
              to={to}
              className={isActiveLink(to) ? styles.active : ''}
              style={getHoverStyle(hover)}
            >
              {label}
            </Link>
          </li>
        ))}
        <li>
          <Link
            to="/reserve"
            className={`${styles.ctaBtn} ${reserveHoverClass}`}
            onMouseEnter={() => setIsReserveHovered(true)}
            onMouseLeave={() => setIsReserveHovered(false)}
            onFocus={() => setIsReserveHovered(true)}
            onBlur={() => setIsReserveHovered(false)}
          >
            RESERVA YA!
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
