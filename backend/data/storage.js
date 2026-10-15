const fs = require('fs/promises');
const path = require('path');

const ARCHIVO = path.join(__dirname, 'registros.json');
const TEMPORAL = `${ARCHIVO}.tmp`;

async function guardarRegistros(registros) {
  await fs.writeFile(TEMPORAL, JSON.stringify(registros, null, 2), 'utf-8');
  await fs.rename(TEMPORAL, ARCHIVO);
}

async function leerRegistros() {
  try {
    const contenido = await fs.readFile(ARCHIVO, 'utf-8');
    if (!contenido.trim()) {
      await guardarRegistros([]);
      return [];
    }
    const registros = JSON.parse(contenido);
    if (!Array.isArray(registros)) {
      throw new Error('El archivo registros.json no contiene una lista.');
    }
    return registros;
  } catch (error) {
    if (error.code === 'ENOENT') {
      await guardarRegistros([]);
      return [];
    }
    throw error;
  }
}

let cola = Promise.resolve();

function agregarRegistro(nuevo) {
  const tarea = cola.then(async () => {
    const registros = await leerRegistros();
    registros.push(nuevo);
    await guardarRegistros(registros);
    return nuevo;
  });
  cola = tarea.catch(() => {});
  return tarea;
}

module.exports = { leerRegistros, guardarRegistros, agregarRegistro };
