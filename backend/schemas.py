from pydantic import BaseModel

# Clase para representar una empresa
class Empresa(BaseModel):
    codigo: int  # identificador único de la empresa
    nit: str  # número de identificación tributaria
    nombre: str # nombre de la empresa

# Datos que llegan al crear o editar una empresa (sin código, lo genera la base de datos)
class EmpresaEntrada(BaseModel):
    nit: str  # número de identificación tributaria
    nombre: str # nombre de la empresa

# Clase para representar un empleado
class Empleado(BaseModel):
    id: int  # identificador único del empleado
    codigo_empresa: int  # código de la empresa a la que pertenece
    cedula: str  # número de identificación del empleado
    nombre: str  # nombre del empleado
    salario: float  # salario del empleado

# Datos que llegan al crear o editar un empleado (sin id, lo genera la base de datos)
class EmpleadoEntrada(BaseModel):
    codigo_empresa: int  # código de la empresa a la que pertenece
    cedula: str  # número de identificación del empleado
    nombre: str  # nombre del empleado
    salario: float  # salario del empleado
