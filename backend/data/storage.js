const fs = require('fs/promises');
const path = require('path');

// Ruta del archivo donde se guardan las solicitudes
const ARCHIVO = path.join(__dirname, 'registros.json');

// Escribe la lista completa en el archivo JSON
async function guardarRegistros(registros) {
  await fs.writeFile(ARCHIVO, JSON.stringify(registros, null, 2), 'utf-8');
}

// Lee la lista; si el archivo no existe, lo crea vacío
async function leerRegistros() {
  try {
    const contenido = await fs.readFile(ARCHIVO, 'utf-8');
    return JSON.parse(contenido);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await guardarRegistros([]);
      return [];
    }
    throw error; // otro error: lo maneja la ruta sin tumbar el servidor
  }
}

module.exports = { leerRegistros, guardarRegistros };