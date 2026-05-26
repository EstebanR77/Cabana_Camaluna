import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Navbar.module.css';

const NAV_LINKS = [
  {
    label: 'La cabaña',
    to: '/cabin',
    hover: {
      background: 'var(--olive-muted)',
      border: 'var(--olive-muted)',
      color: 'var(--white)',
    },
  },
  {
    label: 'Reservar',
    to: '/reserve',
    hover: {
      background: 'var(--olive-dark)',
      border: 'var(--olive-dark)',
      color: 'var(--white)',
    },
  },
  {
    label: 'Sobre Villa de Leyva',
    to: '/about',
    hover: {
      background: 'var(--cream-strong)',
      border: 'var(--olive-muted)',
      color: 'var(--black)',
    },
  },
  {
    label: 'Galería',
    to: '/gallery',
    hover: {
      background: 'var(--brown-warm)',
      border: 'var(--brown-warm)',
      color: 'var(--white)',
    },
  },
  {
    label: 'Conócenos',
    to: '/#conocenos',
    hover: {
      background: 'var(--olive-main)',
      border: 'var(--olive-main)',
      color: 'var(--white)',
    },
  },
  {
    label: 'Experiencias/Reseñas',
    to: '/#resenas',
    hover: {
      background: 'var(--brown-orange)',
      border: 'var(--brown-orange)',
      color: 'var(--white)',
    },
  },
  {
    label: 'Ayuda y Contacto',
    to: '/contact',
    hover: {
      background: 'var(--brown-dark)',
      border: 'var(--brown-dark)',
      color: 'var(--white)',
    },
  },
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
          <Link to="/reserve" className={styles.ctaBtn}>
            RESERVA YA!
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
