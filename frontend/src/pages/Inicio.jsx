import { Link } from 'react-router-dom';

function Inicio() {
  return (
    <section className="inicio">
      <h1>Adopción de Mascotas 🐾</h1>
      <p>
        Registra y consulta solicitudes de adopción: quién solicita,
        qué mascota desea adoptar, su especie y la fecha de visita.
      </p>
      <div className="inicio__acciones">
        <Link to="/registro" className="boton">Registrar solicitud</Link>
        <Link to="/lista" className="boton boton--secundario">Ver solicitudes</Link>
      </div>
    </section>
  );
}

export default Inicio;