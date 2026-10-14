// Especies disponibles (se usan en el <select> del formulario)
export const ESPECIES = ['Perro', 'Gato', 'Conejo', 'Ave', 'Otro'];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Fecha de hoy en hora local (AAAA-MM-DD)
export function hoyLocal() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}

// Mismas reglas que el backend; devuelve { campo: 'mensaje' }
export function validarFormulario(datos) {
  const errores = {};

  if (datos.nombre.trim().length < 3) {
    errores.nombre = 'El nombre es obligatorio (mínimo 3 caracteres).';
  }
  if (!EMAIL_REGEX.test(datos.email.trim())) {
    errores.email = 'Ingresa un email válido, por ejemplo: nombre@correo.com';
  }
  if (!datos.mascota.trim()) {
    errores.mascota = 'Indica el nombre de la mascota.';
  }
  if (!ESPECIES.includes(datos.especie)) {
    errores.especie = 'Selecciona una especie.';
  }
  if (!datos.fecha) {
    errores.fecha = 'Selecciona la fecha de visita.';
  } else if (datos.fecha < hoyLocal()) {
    errores.fecha = 'La fecha de visita no puede ser anterior a hoy.';
  }
  const largo = datos.descripcion.trim().length;
  if (largo < 10 || largo > 500) {
    errores.descripcion = 'Describe el motivo (entre 10 y 500 caracteres).';
  }

  return errores;
}