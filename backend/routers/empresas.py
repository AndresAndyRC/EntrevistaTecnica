from fastapi import APIRouter, HTTPException # Para crear rutas
from postgrest.exceptions import APIError
from database import supabase # Conexion
from schemas import Empresa, EmpresaEntrada, Empleado #Esquema de datos

# Rutas

router = APIRouter(prefix="/empresas", tags=["Empresas"]) # Crear rutas

# GET
@router.get("", response_model=list[Empresa]) # Obtener todas las empresas
def get_empresas():
    respuesta = supabase.table("empresas").select("*").order("codigo").execute()
    return respuesta.data

# POST
@router.post("", response_model=Empresa, status_code=201) # Crear empresa
def post_empresa(empresa: EmpresaEntrada):                # recibe y valida los datos
    datos = empresa.model_dump()                             # molde → diccionario
    try:
        respuesta = supabase.table("empresas").insert(datos).execute()   # guarda en Supabase
    except APIError as error:
        if error.code == "23505":                            # si es error de NIT repetido
            raise HTTPException(status_code=409, detail="Ya existe una empresa con ese NIT")
        raise                              # si es otro error, que siga su curso
    return respuesta.data[0]                                  # devuelve la fila creada


# GET para una empresa por codigo
@router.get("/{codigo}", response_model=Empresa) # Obtener una empresa por codigo
def get_empresa(codigo: int): # recibe y valida los datos
    respuesta = supabase.table("empresas").select("*").eq("codigo", codigo).execute() # busca la empresa por codigo
    if not respuesta.data: # si no existe la empresa
        raise HTTPException(status_code=404, detail="Empresa no encontrada") # devuelve error 404
    return respuesta.data[0] # devuelve la empresa

# GET para los empleados de una empresa
@router.get("/{codigo}/empleados", response_model=list[Empleado]) # Obtener los empleados de una empresa
def get_empleados_de_empresa(codigo: int): # recibe el código de la empresa desde la URL
    empresa = supabase.table("empresas").select("codigo").eq("codigo", codigo).execute() # revisa que la empresa exista
    if not empresa.data: # si no existe la empresa
        raise HTTPException(status_code=404, detail="Empresa no encontrada") # devuelve error 404
    respuesta = supabase.table("empleados").select("*").eq("codigo_empresa", codigo).order("id").execute() # trae solo los empleados de esa empresa
    return respuesta.data # devuelve la lista (vacía si la empresa no tiene empleados)

# PUT
@router.put("/{codigo}", response_model=Empresa) # Actualizar una empresa por codigo
def put_empresa(codigo: int, empresa: EmpresaEntrada): # recibe y valida los datos
    datos = empresa.model_dump()
    try:
        respuesta = supabase.table("empresas").update(datos).eq("codigo", codigo).execute()
    except APIError as error:
        if error.code == "23505":
            raise HTTPException(status_code=409, detail="Ya existe una empresa con ese NIT")
        raise
    if not respuesta.data: # si no se actualizó nada, la empresa no existe
        raise HTTPException(status_code=404, detail="Empresa no encontrada") # devuelve error 404
    return respuesta.data[0]

#DELETE
@router.delete("/{codigo}", status_code=204) # Borrar una empresa por codigo
def delete_empresa(codigo: int): # recibe el código desde la URL
    respuesta = supabase.table("empresas").delete().eq("codigo", codigo).execute() # borra solo la empresa con ese código
    if not respuesta.data: # si no se borró nada, la empresa no existe
        raise HTTPException(status_code=404, detail="Empresa no encontrada") # devuelve error 404