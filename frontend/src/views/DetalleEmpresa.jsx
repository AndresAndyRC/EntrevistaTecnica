import { useState } from 'react'
import InfoEmpresa from '../components/empresas/InfoEmpresa.jsx'
import ListaEmpleados from '../components/empleados/ListaEmpleados.jsx'
import FormularioEmpleado from '../components/empleados/FormularioEmpleado.jsx'
import './DetalleEmpresa.css'

// Vista de una empresa: sus datos y la gestión de sus empleados
function DetalleEmpresa({ empresa, empleados, onVolver, onAgregarEmpleado, onEditarEmpleado, onEliminarEmpleado }) {
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  // null = se está agregando un empleado nuevo
  const [empleadoEditando, setEmpleadoEditando] = useState(null)

  function abrirAgregar() {
    setEmpleadoEditando(null)
    setMostrarFormulario(true)
  }

  function abrirEditar(empleado) {
    setEmpleadoEditando(empleado)
    setMostrarFormulario(true)
  }

  function cerrarFormulario() {
    setMostrarFormulario(false)
    setEmpleadoEditando(null)
  }

  async function guardarEmpleado(datos) {
    let guardado
    if (empleadoEditando) {
      // Conserva id y codigo_empresa; reemplaza cédula, nombre y salario
      guardado = await onEditarEmpleado({ ...empleadoEditando, ...datos })
    } else {
      // El empleado nuevo queda ligado a la empresa que se está viendo
      guardado = await onAgregarEmpleado({ ...datos, codigo_empresa: empresa.codigo })
    }
    // Si la API rechazó los datos, el formulario queda abierto para corregir
    if (!guardado) return
    cerrarFormulario()
  }

  return (
    <div className="detalle-empresa">
      <button className="detalle-empresa-volver" onClick={onVolver}>← Volver</button>

      <InfoEmpresa empresa={empresa} />

      <div className="detalle-empresa-barra">
        <button className="boton-primario" onClick={abrirAgregar}>Agregar empleado</button>
      </div>

      {/* key reinicia el formulario al cambiar de empleado o pasar de editar a agregar */}
      {mostrarFormulario && (
        <FormularioEmpleado
          key={empleadoEditando ? empleadoEditando.id : 'nuevo'}
          empleado={empleadoEditando}
          onGuardar={guardarEmpleado}
          onCancelar={cerrarFormulario}
        />
      )}

      <ListaEmpleados
        empleados={empleados}
        onEditar={abrirEditar}
        onEliminar={onEliminarEmpleado}
      />
    </div>
  )
}

export default DetalleEmpresa
