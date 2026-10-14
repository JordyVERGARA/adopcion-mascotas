import { useState } from 'react';
import { Link } from 'react-router-dom';
import Mensaje from './Mensaje';
import { crearSolicitud } from '../services/api';
import { ESPECIES, hoyLocal, validarFormulario } from '../utils/validaciones';

const VALORES_INICIALES = {
  nombre: '',
  email: '',
  mascota: '',
  especie: '',
  fecha: '',
  descripcion: '',
};

function FormularioSolicitud() {
  // Estado del formulario
  const [datos, setDatos] = useState(VALORES_INICIALES);
  const [errores, setErrores] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [resultado, setResultado] = useState(null); // { tipo, texto }

  // Actualiza el campo que cambió y borra su error
  function manejarCambio(e) {
    const { name, value } = e.target;
    setDatos({ ...datos, [name]: value });
    if (errores[name]) {
      setErrores({ ...errores, [name]: undefined });
    }
  }

  async function manejarEnvio(e) {
    e.preventDefault(); // evita que la página se recargue
    setResultado(null);

    // 1. Validar en el cliente
    const nuevosErrores = validarFormulario(datos);
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) {
      setResultado({ tipo: 'error', texto: 'Revisa los campos marcados en rojo.' });
      return; // no se envía nada al servidor
    }

    // 2. Enviar a la API
    setEnviando(true);
    try {
      const creada = await crearSolicitud(datos);
      setResultado({
        tipo: 'exito',
        texto: `Solicitud registrada: ${creada.nombre} quiere adoptar a ${creada.mascota}.`,
      });
      setDatos(VALORES_INICIALES); // limpia el formulario
    } catch (error) {
      setErrores(error.errores || {}); // errores que devolvió el servidor (400)
      setResultado({ tipo: 'error', texto: error.message });
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form className="formulario" onSubmit={manejarEnvio} noValidate>
      {resultado && (
        <Mensaje tipo={resultado.tipo}>
          {resultado.texto}{' '}
          {resultado.tipo === 'exito' && <Link to="/lista">Ver solicitudes →</Link>}
        </Mensaje>
      )}

      <div className="campo">
        <label htmlFor="nombre">Nombre del solicitante *</label>
        <input
          id="nombre" name="nombre" type="text"
          value={datos.nombre} onChange={manejarCambio}
          placeholder="Ej.: María López"
        />
        {errores.nombre && <small className="campo__error">{errores.nombre}</small>}
      </div>

      <div className="campo">
        <label htmlFor="email">Email *</label>
        <input
          id="email" name="email" type="email"
          value={datos.email} onChange={manejarCambio}
          placeholder="nombre@correo.com"
        />
        {errores.email && <small className="campo__error">{errores.email}</small>}
      </div>

      <div className="fila">
        <div className="campo">
          <label htmlFor="mascota">Nombre de la mascota *</label>
          <input
            id="mascota" name="mascota" type="text"
            value={datos.mascota} onChange={manejarCambio}
            placeholder="Ej.: Firulais"
          />
          {errores.mascota && <small className="campo__error">{errores.mascota}</small>}
        </div>

        <div className="campo">
          <label htmlFor="especie">Especie *</label>
          <select id="especie" name="especie" value={datos.especie} onChange={manejarCambio}>
            <option value="">Selecciona…</option>
            {ESPECIES.map((esp) => (
              <option key={esp} value={esp}>{esp}</option>
            ))}
          </select>
          {errores.especie && <small className="campo__error">{errores.especie}</small>}
        </div>
      </div>

      <div className="campo">
        <label htmlFor="fecha">Fecha de visita *</label>
        <input
          id="fecha" name="fecha" type="date"
          value={datos.fecha} onChange={manejarCambio}
          min={hoyLocal()}
        />
        {errores.fecha && <small className="campo__error">{errores.fecha}</small>}
      </div>

      <div className="campo">
        <label htmlFor="descripcion">¿Por qué quieres adoptar? *</label>
        <textarea
          id="descripcion" name="descripcion" rows="4" maxLength="500"
          value={datos.descripcion} onChange={manejarCambio}
          placeholder="Cuéntanos sobre tu hogar y por qué esta mascota…"
        />
        <small className="campo__ayuda">{datos.descripcion.length}/500</small>
        {errores.descripcion && <small className="campo__error">{errores.descripcion}</small>}
      </div>

      <button type="submit" className="boton" disabled={enviando}>
        {enviando ? 'Enviando…' : 'Registrar solicitud'}
      </button>
    </form>
  );
}

export default FormularioSolicitud;