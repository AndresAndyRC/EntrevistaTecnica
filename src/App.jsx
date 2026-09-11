// Importamos useState: sirve para guardar un dato que cambia y que, al cambiar, vuelve a dibujar la pantalla
import { useState } from 'react'
// Importamos la vista de inicio (bienvenida + listado de empresas)
import Inicio from './views/Inicio.jsx'
// Importamos la vista de detalle (información de la empresa + empleados)
import DetalleEmpresa from './views/DetalleEmpresa.jsx'

// Datos de prueba con los que arranca la app: cada empresa tiene código, NIT y nombre
const empresasIniciales = [
  { codigo: 'E001', nit: '900123456-1', nombre: 'Tecnología SA' }, // Primera empresa
  { codigo: 'E002', nit: '800987654-2', nombre: 'Comercial del Norte' }, // Segunda empresa
]

// Datos de prueba de los empleados: id, código de la empresa a la que pertenece, cédula, nombre y salario
// El campo codigoEmpresa es el que "une" a cada empleado con su empresa
const empleadosIniciales = [
  { id: 1, codigoEmpresa: 'E001', cedula: '1020304050', nombre: 'Ana López', salario: 3500000 }, // Empleado de E001
  { id: 2, codigoEmpresa: 'E001', cedula: '1030405060', nombre: 'Carlos Pérez', salario: 2800000 }, // Empleado de E001
  { id: 3, codigoEmpresa: 'E002', cedula: '1040506070', nombre: 'María Gómez', salario: 4200000 }, // Empleado de E002
]

// Componente principal: guarda todos los datos y decide qué vista se muestra
function App() {
  // Lista de empresas; va en useState porque puede cambiar (agregar, editar y eliminar)
  const [empresas, setEmpresas] = useState(empresasIniciales)
  // Lista de TODOS los empleados de todas las empresas
  const [empleados, setEmpleados] = useState(empleadosIniciales)
  // Código de la empresa a la que se le dio "Ver más"; null significa que estamos en el inicio
  const [codigoSeleccionado, setCodigoSeleccionado] = useState(null)

  // ---------- Funciones de EMPRESAS ----------

  // Agrega una empresa nueva a la lista
  function agregarEmpresa(nuevaEmpresa) {
    // Creamos una lista nueva: las empresas de antes (...empresas) más la nueva al final
    setEmpresas([...empresas, nuevaEmpresa])
  }

  // Reemplaza la empresa que tiene el mismo código por su versión editada
  function editarEmpresa(empresaEditada) {
    // map recorre todas las empresas: si el código coincide pone la editada, si no deja la que estaba
    setEmpresas(empresas.map((empresa) => (empresa.codigo === empresaEditada.codigo ? empresaEditada : empresa)))
  }

  // Elimina una empresa y también a sus empleados
  function eliminarEmpresa(codigo) {
    // Pedimos confirmación; si el usuario cancela, salimos de la función sin borrar nada
    if (!window.confirm('¿Seguro que quieres eliminar esta empresa y todos sus empleados?')) return
    // filter deja solo las empresas cuyo código NO es el que queremos borrar
    setEmpresas(empresas.filter((empresa) => empresa.codigo !== codigo))
    // Borramos también los empleados de esa empresa para que no queden empleados sin empresa
    setEmpleados(empleados.filter((empleado) => empleado.codigoEmpresa !== codigo))
  }

  // ---------- Funciones de EMPLEADOS ----------

  // Agrega un empleado nuevo a la lista
  function agregarEmpleado(nuevoEmpleado) {
    // Calculamos el id nuevo: el id más alto que exista + 1 (el 0 hace que empiece en 1 si no hay empleados)
    const nuevoId = Math.max(0, ...empleados.map((empleado) => empleado.id)) + 1
    // Creamos una lista nueva: los empleados de antes (...empleados) más el nuevo con su id
    setEmpleados([...empleados, { ...nuevoEmpleado, id: nuevoId }])
  }

  // Reemplaza el empleado que tiene el mismo id por su versión editada
  function editarEmpleado(empleadoEditado) {
    // Igual que en editarEmpresa, pero comparando por id
    setEmpleados(empleados.map((empleado) => (empleado.id === empleadoEditado.id ? empleadoEditado : empleado)))
  }

  // Elimina un empleado por su id
  function eliminarEmpleado(id) {
    // Pedimos confirmación; si el usuario cancela, no borramos nada
    if (!window.confirm('¿Seguro que quieres eliminar este empleado?')) return
    // Dejamos todos los empleados menos el que tiene ese id
    setEmpleados(empleados.filter((empleado) => empleado.id !== id))
  }

  // ---------- Qué vista mostrar ----------

  // Buscamos la empresa seleccionada en la lista (si no hay ninguna, queda undefined)
  const empresaSeleccionada = empresas.find((empresa) => empresa.codigo === codigoSeleccionado)

  // Si no hay empresa seleccionada, mostramos el inicio
  if (!empresaSeleccionada) {
    // Le pasamos las empresas y las funciones de los botones: Ver más, Agregar, Editar y Eliminar
    return (
      <Inicio
        empresas={empresas}
        onVerMas={setCodigoSeleccionado}
        onAgregar={agregarEmpresa}
        onEditar={editarEmpresa}
        onEliminar={eliminarEmpresa}
      />
    )
  }

  // Filtramos solo los empleados cuyo codigoEmpresa es el de la empresa seleccionada
  const empleadosDeLaEmpresa = empleados.filter((empleado) => empleado.codigoEmpresa === empresaSeleccionada.codigo)

  // Si hay empresa seleccionada, mostramos su detalle
  return (
    // Le pasamos la empresa, sus empleados, cómo volver y las funciones para agregar, editar y eliminar empleados
    <DetalleEmpresa
      empresa={empresaSeleccionada}
      empleados={empleadosDeLaEmpresa}
      onVolver={() => setCodigoSeleccionado(null)}
      onAgregarEmpleado={agregarEmpleado}
      onEditarEmpleado={editarEmpleado}
      onEliminarEmpleado={eliminarEmpleado}
    />
  )
}

// Exportamos App para que main.jsx pueda usarlo
export default App
