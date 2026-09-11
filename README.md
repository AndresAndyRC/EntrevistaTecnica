# EntrevistaTecnica

Este repositorio contiene una aplicación web sencilla para la gestión de empresas y sus empleados, construida con FastAPI (backend) y React (frontend).

## Estructura del proyecto

```
EntrevistaTecnica/
├── backend/               # API REST con FastAPI
│   ├── models.py          # Definición de tablas SQLAlchemy
│   ├── schemas.py         # Esquemas de validación con Pydantic
│   ├── main.py            # Configuración de la API
│   ├── database.py        # Conexión a la base de datos
│   └── requirements.txt   # Dependencias del backend
│
├── frontend/              # Interfaz de usuario con React
│   ├── src/
│   │   ├── api.js         # Cliente para llamar a la API
│   │   ├── components/    # Componentes reutilizables
│   │   ├── views/         # Vistas principales (Inicio, DetalleEmpresa)
│   │   ├── App.jsx        # Componente principal
│   │   └── main.jsx       # Punto de entrada de la aplicación
│   └── package.json       # Dependencias del frontend
│
├── uploads/               # (opcional) donde se guardan imágenes de logos
├── venv/                  # Entorno virtual de Python (opcional)
└── .env.example           # Variables de entorno (API URL, etc)
```

## Requisitos previos

- Node.js 18+
- Python 3.10+
- npm
- pip

## Instalación

### Backend

```bash
cd backend
source venv/bin/activate  # opcional: activar entorno virtual
pip install -r requirements.txt
```

### Frontend

```bash
cd frontend
npm install
```

## Ejecución

### Backend

```bash
cd backend
uvicorn main:app --reload
```

La API quedará disponible en `http://[IP_ADDRESS]`.

### Frontend

```bash
cd frontend
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

## Base de datos

La aplicación usa una base de datos SQLite en `/tmp/test_entrevista_tecnica.db`.

Las tablas se crean automáticamente al iniciar el backend:

- `empresas`: código, nit, razon_social, fecha_fundacion, tamaño
- `empleados`: id, codigo_empresa, cedula, nombre, apellido, cargo, salario

### Migraciones

Dado que es una base de datos SQLite simple, no se utilizan migraciones separadas.
Las tablas se recrean si el archivo de base de datos no existe.

## Variables de entorno

Crea un archivo `.env` en el directorio `backend` con el siguiente contenido:

```env
DATABASE_URL=sqlite:///tmp/test_entrevista_tecnica.db
```

Si no existe `.env`, el backend usará la base de datos en memoria (se borra al reiniciar el servidor).
