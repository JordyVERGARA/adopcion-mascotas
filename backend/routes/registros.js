const express = require('express');
const crypto = require('crypto');
const { leerRegistros, agregarRegistro } = require('../data/storage');
const { validarSolicitud, limpiarSolicitud } = require('../validators/validarSolicitud');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const registros = await leerRegistros();
    res.status(200).json(registros);
  } catch (error) {
    console.error('Error al leer los registros:', error);
    res.status(500).json({ mensaje: 'No se pudieron leer los registros.' });
  }
});

router.post('/', async (req, res) => {
  const errores = validarSolicitud(req.body);
  if (Object.keys(errores).length > 0) {
    return res.status(400).json({ mensaje: 'Datos inválidos.', errores });
  }

  try {
    const nuevo = {
      id: crypto.randomUUID(),
      ...limpiarSolicitud(req.body),
      creadoEn: new Date().toISOString(),
    };

    await agregarRegistro(nuevo);

    res.status(201).json(nuevo);
  } catch (error) {
    console.error('Error al guardar el registro:', error);
    res.status(500).json({ mensaje: 'No se pudo guardar la solicitud.' });
  }
});

module.exports = router;