from fastapi import APIRouter, HTTPException # Para crear rutas y responder errores
from postgrest.exceptions import APIError # Error que lanza Supabase cuando la base de datos rechaza algo
from database import supabase # Conexion
from schemas import Empleado, EmpleadoEntrada # Esquemas de datos

# Rutas
router = APIRouter(prefix="/empleados", tags=["Empleados"]) # Crear rutas

# GET
@router.get("", response_model=list[Empleado]) # Obtener todos los empleados
def get_empleados():
    respuesta = supabase.table("empleados").select("*").order("id").execute() # trae todos, ordenados por id
    return respuesta.data # devuelve la lista

# POST
@router.post("", response_model=Empleado, status_code=201) # Crear empleado
def post_empleado(empleado: EmpleadoEntrada): # recibe y valida los datos del cuerpo (JSON)
    datos = empleado.model_dump() # convierte el molde a diccionario
    try:
        respuesta = supabase.table("empleados").insert(datos).execute() # guarda en Supabase
    except APIError as error:
        if error.code == "23505": # valor repetido: la cédula ya existe
            raise HTTPException(status_code=409, detail="Ya existe un empleado con esa cédula")
        if error.code == "23503": # llave foránea: el codigo_empresa no existe en la tabla empresas
            raise HTTPException(status_code=404, detail="La empresa no existe")
        if error.code == "23514": # regla check: el salario es negativo
            raise HTTPException(status_code=422, detail="El salario no puede ser negativo")
        raise # si es otro error, que siga su curso
    return respuesta.data[0] # devuelve el empleado creado (con el id que puso la base de datos)

# GET para un empleado por id
@router.get("/{id_empleado}", response_model=Empleado) # Obtener un empleado por id
def get_empleado(id_empleado: int): # recibe el id desde la URL
    respuesta = supabase.table("empleados").select("*").eq("id", id_empleado).execute() # busca el empleado por id
    if not respuesta.data: # si no existe el empleado
        raise HTTPException(status_code=404, detail="Empleado no encontrado") # devuelve error 404
    return respuesta.data[0] # devuelve el empleado

# PUT
@router.put("/{id_empleado}", response_model=Empleado) # Actualizar un empleado por id
def put_empleado(id_empleado: int, empleado: EmpleadoEntrada): # recibe el id desde la URL y los datos nuevos desde el cuerpo
    datos = empleado.model_dump() # convierte el molde a diccionario
    try:
        respuesta = supabase.table("empleados").update(datos).eq("id", id_empleado).execute() # cambia solo el empleado con ese id
    except APIError as error:
        if error.code == "23505": # valor repetido: la cédula ya la tiene otro empleado
            raise HTTPException(status_code=409, detail="Ya existe un empleado con esa cédula")
        if error.code == "23503": # llave foránea: el codigo_empresa no existe en la tabla empresas
            raise HTTPException(status_code=404, detail="La empresa no existe")
        if error.code == "23514": # regla check: el salario es negativo
            raise HTTPException(status_code=422, detail="El salario no puede ser negativo")
        raise # si es otro error, que siga su curso
    if not respuesta.data: # si no se actualizó nada, el empleado no existe
        raise HTTPException(status_code=404, detail="Empleado no encontrado") # devuelve error 404
    return respuesta.data[0] # devuelve el empleado actualizado

# DELETE
@router.delete("/{id_empleado}", status_code=204) # Borrar un empleado por id
def delete_empleado(id_empleado: int): # recibe el id desde la URL
    respuesta = supabase.table("empleados").delete().eq("id", id_empleado).execute() # borra solo el empleado con ese id
    if not respuesta.data: # si no se borró nada, el empleado no existe
        raise HTTPException(status_code=404, detail="Empleado no encontrado") # devuelve error 404
