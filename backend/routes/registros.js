const express = require('express');
const crypto = require('crypto');
const { leerRegistros, guardarRegistros } = require('../data/storage');
const { validarSolicitud } = require('../validators/validarSolicitud');

const router = express.Router();

// GET /registros → devuelve todas las solicitudes de adopción
router.get('/', async (req, res) => {
  try {
    const registros = await leerRegistros();
    res.status(200).json(registros);
  } catch (error) {
    console.error('Error al leer los registros:', error);
    res.status(500).json({ mensaje: 'No se pudieron leer los registros.' });
  }
});

// POST /registros → crea una nueva solicitud de adopción
router.post('/', async (req, res) => {
  // 1. Validar los datos recibidos
  const errores = validarSolicitud(req.body);
  if (Object.keys(errores).length > 0) {
    return res.status(400).json({ mensaje: 'Datos inválidos.', errores });
  }

  try {
    // 2. Leer los registros existentes
    const registros = await leerRegistros();

    // 3. Armar el nuevo registro con un ID único
    const nuevo = {
      id: crypto.randomUUID(),
      nombre: req.body.nombre.trim(),
      email: req.body.email.trim(),
      mascota: req.body.mascota.trim(),
      especie: req.body.especie,
      fecha: req.body.fecha,
      descripcion: req.body.descripcion.trim(),
      creadoEn: new Date().toISOString(),
    };

    // 4. Agregarlo sin perder los anteriores y guardar
    registros.push(nuevo);
    await guardarRegistros(registros);

    // 5. Responder con 201 (creado)
    res.status(201).json(nuevo);
  } catch (error) {
    console.error('Error al guardar el registro:', error);
    res.status(500).json({ mensaje: 'No se pudo guardar la solicitud.' });
  }
});

module.exports = router;