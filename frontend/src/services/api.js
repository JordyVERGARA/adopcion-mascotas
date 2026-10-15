const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

async function peticion(ruta, opciones) {
  try {
    return await fetch(`${API_URL}${ruta}`, opciones);
  } catch {
    throw new Error('No se pudo conectar con el servidor. Verifica que el backend esté encendido.');
  }
}

export async function obtenerSolicitudes() {
  const respuesta = await peticion('/registros');
  if (!respuesta.ok) {
    throw new Error('No se pudieron cargar las solicitudes.');
  }
  return respuesta.json();
}

export async function crearSolicitud(datos) {
  const respuesta = await peticion('/registros', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  });

  const cuerpo = await respuesta.json().catch(() => ({}));

  if (!respuesta.ok) {
    const error = new Error(cuerpo.mensaje || 'No se pudo registrar la solicitud.');
    error.errores = cuerpo.errores || {};
    throw error;
  }
  return cuerpo;
}