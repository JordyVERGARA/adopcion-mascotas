// Especies permitidas (es la "categoría" que pide la consigna)
const ESPECIES = ['Perro', 'Gato', 'Conejo', 'Ave', 'Otro'];

// Formato básico de email: algo@algo.algo
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Convierte cualquier valor en texto limpio (sin espacios a los lados)
const texto = (valor) => (typeof valor === 'string' ? valor.trim() : '');

// Fecha de hoy en hora local, formato AAAA-MM-DD
function hoyLocal() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}

// Devuelve un objeto con los errores encontrados (vacío si todo está bien)
function validarSolicitud(datos = {}) {
  const errores = {};

  const nombre = texto(datos.nombre);
  const email = texto(datos.email);
  const mascota = texto(datos.mascota);
  const especie = texto(datos.especie);
  const fecha = texto(datos.fecha);
  const descripcion = texto(datos.descripcion);

  if (nombre.length < 3) {
    errores.nombre = 'El nombre es obligatorio (mínimo 3 caracteres).';
  }
  if (!EMAIL_REGEX.test(email)) {
    errores.email = 'Ingresa un email válido.';
  }
  if (!mascota) {
    errores.mascota = 'Indica el nombre de la mascota.';
  }
  if (!ESPECIES.includes(especie)) {
    errores.especie = 'Selecciona una especie válida.';
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
    errores.fecha = 'La fecha es obligatoria.';
  } else if (fecha < hoyLocal()) {
    errores.fecha = 'La fecha de visita no puede ser anterior a hoy.';
  }
  if (descripcion.length < 10 || descripcion.length > 500) {
    errores.descripcion = 'Describe el motivo (entre 10 y 500 caracteres).';
  }

  return errores;
}

module.exports = { validarSolicitud, ESPECIES };