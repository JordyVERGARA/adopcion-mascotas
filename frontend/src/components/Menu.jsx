import { NavLink } from 'react-router-dom';

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