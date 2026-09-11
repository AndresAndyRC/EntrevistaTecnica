from pydantic import BaseModel

class Empresa(BaseModel):
    codigo: int
    nit: str
    nombre: str

# Entrada de POST/PUT: sin código, lo genera la base de datos
class EmpresaEntrada(BaseModel):
    nit: str
    nombre: str

class Empleado(BaseModel):
    id: int
    codigo_empresa: int
    cedula: str
    nombre: str
    salario: float

# Entrada de POST/PUT: sin id, lo genera la base de datos
class EmpleadoEntrada(BaseModel):
    codigo_empresa: int
    cedula: str
    nombre: str
    salario: float
