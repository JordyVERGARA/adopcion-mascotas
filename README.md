# 🐾 AdoptaYa — Solicitudes de adopción de mascotas

Aplicación web para **registrar y consultar solicitudes de adopción**, con solicitante, mascota, especie y fecha de visita.

Flujo completo: **formulario en React → petición HTTP → API en Express → archivo JSON → consulta y visualización en React**.

## Integrantes — Grupo 3

| Integrante | Responsabilidad |
|---|---|
| Jordy Rodrigo Vergara Morales | Backend (API Express y archivo JSON) y estructura del frontend |
| German Steven Riera Rebolledo | Validación en cliente y servidor, guardado seguro y pruebas automáticas |
| Anthony Steven Pataron Naula | Pruebas de la API, verificación de persistencia y documentación |
| Héctor Guillermo Tenelema Iza | Filtro por especie en la lista y vista en celular |

## Tecnologías

- **Frontend:** React + Vite, React Router DOM, Fetch API, CSS
- **Backend:** Node.js, Express, CORS
- **Almacenamiento:** archivo JSON (`backend/data/registros.json`)

## Estructura

```
adopcion-mascotas/
├── backend/
│   ├── server.js                  # Configuración de Express, CORS y manejo de errores
│   ├── routes/registros.js        # GET y POST /registros
│   ├── data/storage.js            # Lectura y escritura del archivo JSON
│   ├── data/registros.json        # Almacenamiento persistente
│   └── validators/validarSolicitud.js
└── frontend/
    └── src/
        ├── App.jsx                # Rutas: /, /registro, /lista
        ├── components/            # Menu, FormularioSolicitud, TarjetaSolicitud, Mensaje
        ├── pages/                 # Inicio, Registro, Lista
        ├── services/api.js        # Conexión con la API
        └── utils/validaciones.js  # Validaciones del formulario
```

## Requisitos

- Node.js 18 o superior

## Cómo ejecutar

Se necesitan **dos terminales**.

**1. Backend** (puerto 3001):

```bash
cd backend
npm install
npm run dev
```

**2. Frontend** (puerto 5173):

```bash
cd frontend
npm install
npm run dev
```

Abrir **http://localhost:5173** en el navegador.

## API

| Método | Ruta | Descripción | Respuestas |
|---|---|---|---|
| GET | `/registros` | Lista todas las solicitudes | 200, 500 |
| POST | `/registros` | Crea una solicitud | 201, 400, 500 |

Ejemplo de cuerpo para `POST /registros`:

```json
{
  "nombre": "German Riera",
  "email": "german@ejemplo.com",
  "mascota": "Firulais",
  "especie": "Perro",
  "fecha": "2026-10-20",
  "descripcion": "Tengo patio amplio y tiempo para cuidarlo."
}
```

El servidor agrega `id` (UUID) y `creadoEn`. Si los datos son inválidos responde **400** con los errores por campo.

## Validaciones (cliente y servidor)

Las mismas reglas están en `frontend/src/utils/validaciones.js` y `backend/validators/validarSolicitud.js`.

| Campo | Regla |
|---|---|
| nombre | Obligatorio, 3 a 80 caracteres, solo letras y espacios |
| email | Obligatorio, formato `usuario@dominio.ext`, sin puntos al inicio, al final ni seguidos |
| mascota | Obligatorio, 2 a 40 caracteres, solo letras y espacios |
| especie | Perro, Gato, Conejo, Ave u Otro |
| fecha | Obligatoria, debe existir en el calendario, desde hoy y como máximo dentro de un año |
| descripcion | Entre 10 y 500 caracteres |

Antes de guardar, el servidor quita espacios sobrantes y pasa el email a minúsculas.

### Pruebas automáticas de la validación

```bash
cd backend
npm test
```

## Conexión React → API

Toda la comunicación está en `frontend/src/services/api.js`. La dirección de la API se define en `API_URL` (por defecto `http://localhost:3001`) y puede cambiarse con la variable de entorno `VITE_API_URL`. El backend permite el origen `http://localhost:5173` mediante CORS.

## Pruebas realizadas

- Creación de solicitudes (201) y consulta (200)
- Rechazo de datos inválidos (400): fechas inexistentes, pasadas o lejanas, emails mal escritos, nombres con números
- Rechazo de JSON mal formado (400) sin detener el servidor
- 20 registros enviados al mismo tiempo se guardan todos sin perder ninguno
- 10 pruebas automáticas de la validación con `npm test`
- Persistencia: tras reiniciar el backend, los registros siguen disponibles
- Estados en la interfaz: cargando, lista vacía, confirmación y error de conexión
- Filtro por especie en la lista de solicitudes
- Diseño adaptable a pantallas pequeñas

## Cómo probar la API con curl

Con el backend encendido (`npm run dev` en la carpeta `backend`), desde Git Bash:

**Consultar las solicitudes (200)**

```bash
curl http://localhost:3001/registros
```

**Crear una solicitud válida (201)**

```bash
curl -X POST http://localhost:3001/registros -H "Content-Type: application/json" -d '{"nombre":"Maria Lopez","email":"maria@correo.com","mascota":"Luna","especie":"Gato","fecha":"2026-11-20","descripcion":"Tengo patio y tiempo para cuidarla"}'
```

**Enviar datos inválidos (400)**

```bash
curl -X POST http://localhost:3001/registros -H "Content-Type: application/json" -d '{"nombre":"Jo3","email":"malo"}'
```

**Comprobar la persistencia**

1. Crear una solicitud con el comando anterior.
2. Detener el backend con `Ctrl + C` y volver a iniciarlo con `npm run dev`.
3. Consultar otra vez con `curl http://localhost:3001/registros`: la solicitud sigue guardada.

> Nota: la fecha de la solicitud debe ser desde hoy y como máximo dentro de un año; si la del ejemplo ya pasó, cámbiala por una fecha futura.
