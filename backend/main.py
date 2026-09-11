from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware 
from routers import empresas, empleados # rutas de empresas y de empleados

app = FastAPI()
app.add_middleware(
      CORSMiddleware,
      allow_origins=["http://localhost:5173"],
      allow_methods=["*"],
      allow_headers=["*"],
)  
app.include_router(empresas.router) # Incluir las rutas de empresas
app.include_router(empleados.router) # Incluir las rutas de empleados

@app.get("/") #ruta del servidor de la api de backend
def inicio():
    return {"mensaje": "Bienvenido a la API de Empleados y Empresas"} #mensaje que se muestra en la raiz del servidor


