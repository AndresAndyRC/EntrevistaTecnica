from fastapi import APIRouter, HTTPException
from postgrest.exceptions import APIError
from database import supabase
from schemas import Empresa, EmpresaEntrada, Empleado

router = APIRouter(prefix="/empresas", tags=["Empresas"])

@router.get("", response_model=list[Empresa])
def get_empresas():
    respuesta = supabase.table("empresas").select("*").order("codigo").execute()
    return respuesta.data

@router.post("", response_model=Empresa, status_code=201)
def post_empresa(empresa: EmpresaEntrada):
    datos = empresa.model_dump()
    try:
        respuesta = supabase.table("empresas").insert(datos).execute()
    except APIError as error:
        if error.code == "23505":  # violación de unicidad: NIT repetido
            raise HTTPException(status_code=409, detail="Ya existe una empresa con ese NIT")
        raise
    return respuesta.data[0]

@router.get("/{codigo}", response_model=Empresa)
def get_empresa(codigo: int):
    respuesta = supabase.table("empresas").select("*").eq("codigo", codigo).execute()
    if not respuesta.data:
        raise HTTPException(status_code=404, detail="Empresa no encontrada")
    return respuesta.data[0]

@router.get("/{codigo}/empleados", response_model=list[Empleado])
def get_empleados_de_empresa(codigo: int):
    # Se valida la empresa aparte para distinguir "no existe" (404) de "sin empleados" ([])
    empresa = supabase.table("empresas").select("codigo").eq("codigo", codigo).execute()
    if not empresa.data:
        raise HTTPException(status_code=404, detail="Empresa no encontrada")
    respuesta = supabase.table("empleados").select("*").eq("codigo_empresa", codigo).order("id").execute()
    return respuesta.data

@router.put("/{codigo}", response_model=Empresa)
def put_empresa(codigo: int, empresa: EmpresaEntrada):
    datos = empresa.model_dump()
    try:
        respuesta = supabase.table("empresas").update(datos).eq("codigo", codigo).execute()
    except APIError as error:
        if error.code == "23505":  # violación de unicidad: NIT repetido
            raise HTTPException(status_code=409, detail="Ya existe una empresa con ese NIT")
        raise
    if not respuesta.data:  # ninguna fila afectada: la empresa no existe
        raise HTTPException(status_code=404, detail="Empresa no encontrada")
    return respuesta.data[0]

@router.delete("/{codigo}", status_code=204)
def delete_empresa(codigo: int):
    # Sus empleados se borran en la base de datos (on delete cascade)
    respuesta = supabase.table("empresas").delete().eq("codigo", codigo).execute()
    if not respuesta.data:  # ninguna fila afectada: la empresa no existe
        raise HTTPException(status_code=404, detail="Empresa no encontrada")
