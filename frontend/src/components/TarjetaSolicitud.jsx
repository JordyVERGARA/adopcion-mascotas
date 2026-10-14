// Ícono según la especie
const ICONOS = { Perro: '🐶', Gato: '🐱', Conejo: '🐰', Ave: '🐦', Otro: '🐾' };

// "2026-10-20" → "20 de octubre de 2026" (sin desfase de zona horaria)
function formatearFecha(fecha) {
  return new Date(`${fecha}T00:00:00`).toLocaleDateString('es-EC', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

// Tarjeta reutilizable que muestra una solicitud
function TarjetaSolicitud({ solicitud }) {
  const { nombre, email, mascota, especie, fecha, descripcion, creadoEn } = solicitud;

  return (
    <article className="tarjeta">
      <header className="tarjeta__encabezado">
        <span className="tarjeta__icono" aria-hidden="true">{ICONOS[especie] || '🐾'}</span>
        <div>
          <h3>{mascota}</h3>
          <span className="etiqueta">{especie}</span>
        </div>
      </header>

      <p className="tarjeta__descripcion">{descripcion}</p>

      <dl className="tarjeta__datos">
        <div><dt>Solicitante</dt><dd>{nombre}</dd></div>
        <div><dt>Email</dt><dd>{email}</dd></div>
        <div><dt>Fecha de visita</dt><dd>{formatearFecha(fecha)}</dd></div>
      </dl>

      <small className="tarjeta__pie">
        Registrada el {new Date(creadoEn).toLocaleString('es-EC')}
      </small>
    </article>
  );
}

export default TarjetaSolicitud;