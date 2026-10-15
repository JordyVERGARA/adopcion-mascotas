const express = require('express');
const cors = require('cors');
const registrosRouter = require('./routes/registros');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: 'http://localhost:5173' }));

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ mensaje: 'API de adopción de mascotas funcionando' });
});

app.use('/registros', registrosRouter);

app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ mensaje: 'El cuerpo de la petición no es JSON válido.' });
  }
  console.error(err);
  res.status(500).json({ mensaje: 'Error interno del servidor.' });
});

app.listen(PORT, () => {
  console.log(`API escuchando en http://localhost:${PORT}`);
});