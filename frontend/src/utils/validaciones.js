export const ESPECIES = ['Perro', 'Gato', 'Conejo', 'Hámster', 'Ave', 'Otro'];

export const LIMITES = {
  nombre: { min: 3, max: 80 },
  mascota: { min: 2, max: 40 },
  descripcion: { min: 10, max: 500 },
  email: { max: 254 },
};

const SOLO_LETRAS = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' -]+$/;

const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

const texto = (valor) =>
  typeof valor === 'string' ? valor.trim().replace(/\s+/g, ' ') : '';

function aTextoLocal(d) {
  const copia = new Date(d);
  copia.setMinutes(copia.getMinutes() - copia.getTimezoneOffset());
  return copia.toISOString().slice(0, 10);
}

export function hoyLocal() {
  return aTextoLocal(new Date());
}

export function fechaMaxima() {
  const d = new Date();
  d.setFullYear(d.getFullYear() + 1);
  return aTextoLocal(d);
}

function esFechaReal(fecha) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return false;
  const [anio, mes, dia] = fecha.split('-').map(Number);
  const d = new Date(Date.UTC(anio, mes - 1, dia));
  return (
    d.getUTCFullYear() === anio &&
    d.getUTCMonth() === mes - 1 &&
    d.getUTCDate() === dia
  );
}

function esEmailValido(email) {
  if (!email || email.length > LIMITES.email.max) return false;
  if (!EMAIL_REGEX.test(email)) return false;
  const [usuario, dominio] = email.split('@');
  if (usuario.startsWith('.') || usuario.endsWith('.')) return false;
  if (dominio.startsWith('.') || dominio.startsWith('-')) return false;
  if (email.includes('..')) return false;
  return true;
}

export function validarFormulario(datos) {
  const errores = {};

  const nombre = texto(datos.nombre);
  const email = texto(datos.email);
  const mascota = texto(datos.mascota);
  const especie = texto(datos.especie);
  const fecha = texto(datos.fecha);
  const descripcion = texto(datos.descripcion);

  if (!nombre) {
    errores.nombre = 'El nombre es obligatorio.';
  } else if (nombre.length < LIMITES.nombre.min || nombre.length > LIMITES.nombre.max) {
    errores.nombre = `El nombre debe tener entre ${LIMITES.nombre.min} y ${LIMITES.nombre.max} caracteres.`;
  } else if (!SOLO_LETRAS.test(nombre)) {
    errores.nombre = 'El nombre solo puede contener letras y espacios.';
  }

  if (!email) {
    errores.email = 'El email es obligatorio.';
  } else if (!esEmailValido(email)) {
    errores.email = 'Ingresa un email válido, por ejemplo: nombre@correo.com';
  }

  if (!mascota) {
    errores.mascota = 'Indica el nombre de la mascota.';
  } else if (mascota.length < LIMITES.mascota.min || mascota.length > LIMITES.mascota.max) {
    errores.mascota = `El nombre de la mascota debe tener entre ${LIMITES.mascota.min} y ${LIMITES.mascota.max} caracteres.`;
  } else if (!SOLO_LETRAS.test(mascota)) {
    errores.mascota = 'El nombre de la mascota solo puede contener letras y espacios.';
  }

  if (!especie) {
    errores.especie = 'Selecciona una especie.';
  } else if (!ESPECIES.includes(especie)) {
    errores.especie = 'Selecciona una especie válida.';
  }

  if (!fecha) {
    errores.fecha = 'Selecciona la fecha de visita.';
  } else if (!esFechaReal(fecha)) {
    errores.fecha = 'La fecha no es válida.';
  } else if (fecha < hoyLocal()) {
    errores.fecha = 'La fecha de visita no puede ser anterior a hoy.';
  } else if (fecha > fechaMaxima()) {
    errores.fecha = 'La fecha de visita no puede ser mayor a un año desde hoy.';
  }

  if (!descripcion) {
    errores.descripcion = 'Describe por qué quieres adoptar.';
  } else if (
    descripcion.length < LIMITES.descripcion.min ||
    descripcion.length > LIMITES.descripcion.max
  ) {
    errores.descripcion = `Describe el motivo (entre ${LIMITES.descripcion.min} y ${LIMITES.descripcion.max} caracteres).`;
  }

  return errores;
}
