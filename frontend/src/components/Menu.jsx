import { NavLink } from 'react-router-dom';

// Menú de navegación reutilizable (aparece en todas las páginas)
function Menu() {
  return (
    <header className="menu">
      <NavLink to="/" className="menu__logo">🐾 AdoptaYa</NavLink>
      <nav className="menu__enlaces">
        <NavLink to="/" end>Inicio</NavLink>
        <NavLink to="/registro">Registrar</NavLink>
        <NavLink to="/lista">Solicitudes</NavLink>
      </nav>
    </header>
  );
}

export default Menu;