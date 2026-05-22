import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Navbar.module.css';

function Navbar() {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const { pathname }              = useLocation();

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
      <Link to="/" className={styles.logo}>
        Camaluna <span>🌙</span>
      </Link>

      <button className={burgerClass} onClick={() => setMenuOpen(o => !o)} aria-label="Menú">
        <span /><span /><span />
      </button>

      <ul className={linksClass}>
        <li><Link to="/"            className={pathname === '/'            ? styles.active : ''}>Inicio</Link></li>
        <li><Link to="/cabin"       className={pathname === '/cabin'       ? styles.active : ''}>La Cabaña</Link></li>
        <li><Link to="/about"       className={pathname === '/about'       ? styles.active : ''}>Villa de Leyva</Link></li>
        <li><Link to="/gallery"     className={pathname === '/gallery'     ? styles.active : ''}>Galería</Link></li>
        <li><Link to="/contact"     className={pathname === '/contact'     ? styles.active : ''}>Contacto</Link></li>
        <li><Link to="/reserve"     className={[pathname === '/reserve' ? styles.active : '', styles.reserveBtn].join(' ')}>Reservar</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
