import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import TarjetaSolicitud from '../components/TarjetaSolicitud';
import Mensaje from '../components/Mensaje';
import { obtenerSolicitudes } from '../services/api';

function Lista() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [version, setVersion] = useState(0); // cambia para volver a consultar

  // Consulta GET /registros al entrar y cada vez que cambia "version"
  useEffect(() => {
    let activo = true;
    obtenerSolicitudes()
      .then((datos) => { if (activo) setSolicitudes(datos); })
      .catch((err) => { if (activo) setError(err.message); })
      .finally(() => { if (activo) setCargando(false); });
    return () => { activo = false; };
  }, [version]);

  function recargar() {
    setCargando(true);
    setError('');
    setVersion((v) => v + 1);
  }

  return (
    <section>
      <div className="lista__encabezado">
        <h2>Solicitudes de adopción</h2>
        <button className="boton boton--secundario" onClick={recargar} disabled={cargando}>
          Actualizar
        </button>
      </div>

      {cargando && <Mensaje tipo="cargando">Cargando solicitudes…</Mensaje>}

      {!cargando && error && (
        <Mensaje tipo="error">
          {error}{' '}
          <button className="enlace" onClick={recargar}>Reintentar</button>
        </Mensaje>
      )}

      {!cargando && !error && solicitudes.length === 0 && (
        <Mensaje tipo="info">
          Aún no hay solicitudes registradas. <Link to="/registro">Registrar la primera →</Link>
        </Mensaje>
      )}

      {!cargando && !error && solicitudes.length > 0 && (
        <>
          <p>{solicitudes.length} solicitud(es) registrada(s).</p>
          <div className="lista">
            {[...solicitudes].reverse().map((s) => (
              <TarjetaSolicitud key={s.id} solicitud={s} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

export default Lista;