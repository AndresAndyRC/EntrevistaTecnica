from fastapi import APIRouter, HTTPException
from postgrest.exceptions import APIError
from database import supabase
from schemas import Empleado, EmpleadoEntrada

router = APIRouter(prefix="/empleados", tags=["Empleados"])

@router.get("", response_model=list[Empleado])
def get_empleados():
    respuesta = supabase.table("empleados").select("*").order("id").execute()
    return respuesta.data

@router.post("", response_model=Empleado, status_code=201)
def post_empleado(empleado: EmpleadoEntrada):
    datos = empleado.model_dump()
    try:
        respuesta = supabase.table("empleados").insert(datos).execute()
    except APIError as error:
        if error.code == "23505":  # violación de unicidad: cédula repetida
            raise HTTPException(status_code=409, detail="Ya existe un empleado con esa cédula")
        if error.code == "23503":  # violación de llave foránea: la empresa no existe
            raise HTTPException(status_code=404, detail="La empresa no existe")
        if error.code == "23514":  # violación de check: salario negativo
            raise HTTPException(status_code=422, detail="El salario no puede ser negativo")
        raise
    return respuesta.data[0]

@router.get("/{id_empleado}", response_model=Empleado)
def get_empleado(id_empleado: int):
    respuesta = supabase.table("empleados").select("*").eq("id", id_empleado).execute()
    if not respuesta.data:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")
    return respuesta.data[0]

@router.put("/{id_empleado}", response_model=Empleado)
def put_empleado(id_empleado: int, empleado: EmpleadoEntrada):
    datos = empleado.model_dump()
    try:
        respuesta = supabase.table("empleados").update(datos).eq("id", id_empleado).execute()
    except APIError as error:
        if error.code == "23505":  # violación de unicidad: cédula repetida
            raise HTTPException(status_code=409, detail="Ya existe un empleado con esa cédula")
        if error.code == "23503":  # violación de llave foránea: la empresa no existe
            raise HTTPException(status_code=404, detail="La empresa no existe")
        if error.code == "23514":  # violación de check: salario negativo
            raise HTTPException(status_code=422, detail="El salario no puede ser negativo")
        raise
    if not respuesta.data:  # ninguna fila afectada: el empleado no existe
        raise HTTPException(status_code=404, detail="Empleado no encontrado")
    return respuesta.data[0]

@router.delete("/{id_empleado}", status_code=204)
def delete_empleado(id_empleado: int):
    respuesta = supabase.table("empleados").delete().eq("id", id_empleado).execute()
    if not respuesta.data:  # ninguna fila afectada: el empleado no existe
        raise HTTPException(status_code=404, detail="Empleado no encontrado")
