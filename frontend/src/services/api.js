// Dirección del backend. Se puede cambiar con la variable VITE_API_URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Hace la petición y convierte un fallo de conexión en un mensaje claro
async function peticion(ruta, opciones) {
  try {
    return await fetch(`${API_URL}${ruta}`, opciones);
  } catch {
    throw new Error('No se pudo conectar con el servidor. Verifica que el backend esté encendido.');
  }
}

// GET /registros → lista de solicitudes
export async function obtenerSolicitudes() {
  const respuesta = await peticion('/registros');
  if (!respuesta.ok) {
    throw new Error('No se pudieron cargar las solicitudes.');
  }
  return respuesta.json();
}

// POST /registros → crea una solicitud
export async function crearSolicitud(datos) {
  const respuesta = await peticion('/registros', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  });

  const cuerpo = await respuesta.json().catch(() => ({}));

  if (!respuesta.ok) {
    const error = new Error(cuerpo.mensaje || 'No se pudo registrar la solicitud.');
    error.errores = cuerpo.errores || {}; // errores por campo que manda el servidor (400)
    throw error;
  }
  return cuerpo; // el registro creado (201)
}