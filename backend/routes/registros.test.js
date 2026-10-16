const assert = require('node:assert/strict');
const { after, before, test } = require('node:test');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');

let directorioTemporal;
let servidor;
let urlBase;

before(async () => {
  directorioTemporal = await fs.mkdtemp(path.join(os.tmpdir(), 'adopcion-api-'));
  process.env.ADOPCION_REGISTROS_FILE = path.join(directorioTemporal, 'registros.json');

  const app = require('../server');
  servidor = app.listen(0);
  await new Promise((resolve, reject) => {
    servidor.once('listening', resolve);
    servidor.once('error', reject);
  });

  urlBase = `http://127.0.0.1:${servidor.address().port}`;
});

after(async () => {
  if (servidor) {
    await new Promise((resolve, reject) => {
      servidor.close((error) => (error ? reject(error) : resolve()));
    });
  }
  delete process.env.ADOPCION_REGISTROS_FILE;
  if (directorioTemporal) {
    await fs.rm(directorioTemporal, { recursive: true, force: true });
  }
});

async function solicitar(ruta, opciones = {}) {
  return fetch(`${urlBase}${ruta}`, {
    ...opciones,
    headers: { connection: 'close', ...opciones.headers },
  });
}

function solicitudValida() {
  const fecha = new Date();
  fecha.setMinutes(fecha.getMinutes() - fecha.getTimezoneOffset());

  return {
    nombre: '  María   López ',
    email: ' MARIA@Correo.com ',
    mascota: ' Firulais ',
    especie: 'Perro',
    fecha: fecha.toISOString().slice(0, 10),
    descripcion: 'Tengo patio amplio y tiempo para cuidarlo.',
  };
}

test('GET / devuelve el estado de la API', async () => {
  const respuesta = await solicitar('/');

  assert.equal(respuesta.status, 200);
  assert.deepEqual(await respuesta.json(), {
    mensaje: 'API de adopción de mascotas funcionando',
  });
});

test('GET /registros devuelve una lista inicialmente vacía', async () => {
  const respuesta = await solicitar('/registros');

  assert.equal(respuesta.status, 200);
  assert.deepEqual(await respuesta.json(), []);
});

test('POST /registros valida, normaliza y persiste una solicitud', async () => {
  const respuesta = await solicitar('/registros', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(solicitudValida()),
  });
  const creado = await respuesta.json();

  assert.equal(respuesta.status, 201);
  assert.match(
    creado.id,
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  );
  assert.equal(creado.nombre, 'María López');
  assert.equal(creado.email, 'maria@correo.com');
  assert.equal(creado.mascota, 'Firulais');
  assert.ok(Number.isFinite(Date.parse(creado.creadoEn)));

  const listado = await solicitar('/registros');
  assert.deepEqual(await listado.json(), [creado]);
});

test('POST /registros rechaza datos inválidos sin guardarlos', async () => {
  const respuesta = await solicitar('/registros', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ nombre: 'A', email: 'incorrecto' }),
  });
  const cuerpo = await respuesta.json();

  assert.equal(respuesta.status, 400);
  assert.equal(cuerpo.mensaje, 'Datos inválidos.');
  assert.ok(cuerpo.errores.nombre);
  assert.ok(cuerpo.errores.email);

  const listado = await solicitar('/registros');
  assert.equal((await listado.json()).length, 1);
});

test('responde 400 cuando el cuerpo JSON está mal formado', async () => {
  const respuesta = await solicitar('/registros', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: '{"nombre":',
  });

  assert.equal(respuesta.status, 400);
  assert.deepEqual(await respuesta.json(), {
    mensaje: 'El cuerpo de la petición no es JSON válido.',
  });
});

test('GET /registros responde 500 si el almacenamiento contiene JSON inválido', async () => {
  await fs.writeFile(process.env.ADOPCION_REGISTROS_FILE, '{', 'utf-8');

  const respuesta = await solicitar('/registros');

  assert.equal(respuesta.status, 500);
  assert.deepEqual(await respuesta.json(), {
    mensaje: 'No se pudieron leer los registros.',
  });
});
