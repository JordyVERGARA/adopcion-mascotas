const test = require('node:test');
const assert = require('node:assert');
const { validarSolicitud, limpiarSolicitud } = require('./validarSolicitud');

function fechaEnDias(dias) {
  const d = new Date();
  d.setDate(d.getDate() + dias);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}

const valida = () => ({
  nombre: 'María López',
  email: 'maria@correo.com',
  mascota: 'Firulais',
  especie: 'Perro',
  fecha: fechaEnDias(3),
  descripcion: 'Tengo patio amplio y tiempo para cuidarlo.',
});

test('acepta una solicitud correcta', () => {
  assert.deepStrictEqual(validarSolicitud(valida()), {});
});

test('acepta la fecha de hoy', () => {
  assert.deepStrictEqual(validarSolicitud({ ...valida(), fecha: fechaEnDias(0) }), {});
});

test('rechaza una petición vacía, null o una lista', () => {
  for (const datos of [{}, null, undefined, [], 'texto']) {
    const errores = validarSolicitud(datos);
    assert.deepStrictEqual(
      Object.keys(errores).sort(),
      ['descripcion', 'email', 'especie', 'fecha', 'mascota', 'nombre']
    );
  }
});

test('rechaza fechas que no existen', () => {
  for (const fecha of ['2026-13-45', '2027-02-30', '2027-04-31', '2027-00-10', 'mañana', '20-10-2027']) {
    assert.ok(validarSolicitud({ ...valida(), fecha }).fecha, `debió rechazar ${fecha}`);
  }
});

test('rechaza fechas pasadas y a más de un año', () => {
  assert.ok(validarSolicitud({ ...valida(), fecha: fechaEnDias(-1) }).fecha);
  assert.ok(validarSolicitud({ ...valida(), fecha: fechaEnDias(400) }).fecha);
});

test('rechaza emails mal escritos', () => {
  const malos = ['malo', 'a@b', '.jordy@gmail.com', 'jordy.@gmail.com',
    'jo..rdy@gmail.com', 'jordy@.gmail.com', 'jordy@gmail.c', 'jor dy@gmail.com'];
  for (const email of malos) {
    assert.ok(validarSolicitud({ ...valida(), email }).email, `debió rechazar ${email}`);
  }
});

test('rechaza nombres con números o muy cortos', () => {
  assert.ok(validarSolicitud({ ...valida(), nombre: 'Jo' }).nombre);
  assert.ok(validarSolicitud({ ...valida(), nombre: 'Juan123' }).nombre);
  assert.ok(validarSolicitud({ ...valida(), nombre: '      ' }).nombre);
  assert.ok(validarSolicitud({ ...valida(), nombre: 123 }).nombre);
});

test('rechaza especie fuera de la lista', () => {
  assert.ok(validarSolicitud({ ...valida(), especie: 'Dragón' }).especie);
});

test('rechaza descripción muy corta o muy larga', () => {
  assert.ok(validarSolicitud({ ...valida(), descripcion: 'corto' }).descripcion);
  assert.ok(validarSolicitud({ ...valida(), descripcion: 'a'.repeat(501) }).descripcion);
});

test('limpia espacios y pasa el email a minúsculas antes de guardar', () => {
  const limpio = limpiarSolicitud({ ...valida(), nombre: '  María   López ', email: ' MARIA@Correo.com ' });
  assert.strictEqual(limpio.nombre, 'María López');
  assert.strictEqual(limpio.email, 'maria@correo.com');
});
