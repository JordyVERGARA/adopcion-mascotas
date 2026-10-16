import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import TarjetaSolicitud from '../components/TarjetaSolicitud';
import Mensaje from '../components/Mensaje';
import { obtenerSolicitudes } from '../services/api';
import { ESPECIES } from '../utils/validaciones';

function Lista() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [version, setVersion] = useState(0);
  const [filtro, setFiltro] = useState('Todas');

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

  const filtradas = filtro === 'Todas'
    ? solicitudes
    : solicitudes.filter((s) => s.especie === filtro);

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
          <div className="filtro">
            <label htmlFor="filtro">Filtrar por especie</label>
            <select id="filtro" value={filtro} onChange={(e) => setFiltro(e.target.value)}>
              <option value="Todas">Todas</option>
              {ESPECIES.map((esp) => (
                <option key={esp} value={esp}>{esp}</option>
              ))}
            </select>
          </div>

          <p>Mostrando {filtradas.length} de {solicitudes.length} solicitud(es).</p>

          {filtradas.length === 0 ? (
            <Mensaje tipo="info">
              No hay solicitudes de la especie {filtro}.{' '}
              <button className="enlace" onClick={() => setFiltro('Todas')}>Ver todas</button>
            </Mensaje>
          ) : (
            <div className="lista">
              {[...filtradas].reverse().map((s) => (
                <TarjetaSolicitud key={s.id} solicitud={s} />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default Lista;