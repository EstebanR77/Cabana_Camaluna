import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav>
      <Link to="/">Inicio</Link>
      <Link to="/cabin">La Cabaña</Link>
      <Link to="/reserve">Reservar</Link>
      <Link to="/about">Sobre Villa de Leyva</Link>
      <Link to="/contact">Ayuda y Contacto</Link>
      <Link to="/gallery">Galería</Link>
      <Link to="/experiences">Experiencias</Link>
    </nav>
  );
}

export default Navbar;
