from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import empresas, empleados

app = FastAPI()

# Orígenes del frontend autorizados a llamar a la API desde el navegador
app.add_middleware(
      CORSMiddleware,
      allow_origins=["http://localhost:5173"],
      allow_methods=["*"],
      allow_headers=["*"],
)
app.include_router(empresas.router)
app.include_router(empleados.router)

@app.get("/")
def inicio():
    return {"mensaje": "Bienvenido a la API de Empleados y Empresas"}
