from pydantic import BaseModel, ConfigDict, Field

class Empresa(BaseModel):
    codigo: int
    nit: str
    nombre: str

# Entrada de POST/PUT: sin código, lo genera la base de datos
class EmpresaEntrada(BaseModel):
    # Quita espacios al inicio y al final antes de validar: "   " queda vacío y se rechaza
    model_config = ConfigDict(str_strip_whitespace=True)

    # Solo números y guiones, entre 1 y 20 caracteres
    nit: str = Field(min_length=1, max_length=20, pattern=r"^[0-9-]+$")
    # Entre 1 y 100 caracteres
    nombre: str = Field(min_length=1, max_length=100)

class Empleado(BaseModel):
    id: int
    codigo_empresa: int
    cedula: str
    nombre: str
    salario: float

# Entrada de POST/PUT: sin id, lo genera la base de datos
class EmpleadoEntrada(BaseModel):
    # Quita espacios al inicio y al final antes de validar: "   " queda vacío y se rechaza
    model_config = ConfigDict(str_strip_whitespace=True)

    # Los códigos los genera la base de datos y siempre son mayores que 0
    codigo_empresa: int = Field(gt=0)
    # Solo números, entre 1 y 20 caracteres
    cedula: str = Field(min_length=1, max_length=20, pattern=r"^[0-9]+$")
    # Entre 1 y 100 caracteres
    nombre: str = Field(min_length=1, max_length=100)
    # Entre 0 y el máximo que cabe en la columna numeric(12, 2)
    salario: float = Field(ge=0, le=9999999999.99)
