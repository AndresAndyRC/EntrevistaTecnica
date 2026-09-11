// Importamos useState para controlar el formulario de empleados
import { useState } from 'react'
// Importamos el componente que muestra los datos de la empresa
import InfoEmpresa from '../components/empresas/InfoEmpresa.jsx'
// Importamos el componente que muestra la tabla de empleados
import ListaEmpleados from '../components/empleados/ListaEmpleados.jsx'
// Importamos el formulario para agregar o editar un empleado
import FormularioEmpleado from '../components/empleados/FormularioEmpleado.jsx'

// Vista de detalle: recibe (desde App) la empresa, sus empleados y las funciones para manejarlos
function DetalleEmpresa({ empresa, empleados, onVolver, onAgregarEmpleado, onEditarEmpleado, onEliminarEmpleado }) {
  // true = el formulario de empleado está visible; false = está oculto
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  // Empleado que se está editando; null significa que estamos AGREGANDO uno nuevo
  const [empleadoEditando, setEmpleadoEditando] = useState(null)

  // Abre el formulario vacío para agregar un empleado
  function abrirAgregar() {
    // No hay empleado en edición, así que el formulario sale vacío
    setEmpleadoEditando(null)
    // Mostramos el formulario
    setMostrarFormulario(true)
  }

  // Abre el formulario con los datos de un empleado para editarlo
  function abrirEditar(empleado) {
    // Guardamos cuál empleado se va a editar
    setEmpleadoEditando(empleado)
    // Mostramos el formulario
    setMostrarFormulario(true)
  }

  // Oculta el formulario y limpia el empleado en edición
  function cerrarFormulario() {
    // Ocultamos el formulario
    setMostrarFormulario(false)
    // Ya no hay empleado en edición
    setEmpleadoEditando(null)
  }

  // Se ejecuta cuando en el formulario se da clic en "Guardar"; recibe cédula, nombre y salario
  // Es async porque tiene que esperar la respuesta de la API (App hace el fetch)
  async function guardarEmpleado(datos) {
    // Aquí guardamos si la API aceptó los datos (true) o respondió con error (false)
    let guardado
    // Si hay un empleado en edición, estamos editando
    if (empleadoEditando) {
      // Juntamos lo que ya tenía (id y codigo_empresa) con los datos nuevos (cédula, nombre y salario)
      guardado = await onEditarEmpleado({ ...empleadoEditando, ...datos })
    } else {
      // Si no, estamos agregando: le ponemos el código de esta empresa para que quede ligado a ella
      guardado = await onAgregarEmpleado({ ...datos, codigo_empresa: empresa.codigo })
    }
    // Si hubo error (por ejemplo, cédula repetida), salimos sin cerrar el formulario para que el usuario corrija
    if (!guardado) return
    // Si se guardó, cerramos el formulario
    cerrarFormulario()
  }

  // Lo que se va a dibujar en pantalla
  return (
    // Un contenedor que agrupa toda la vista
    <div>
      {/* Botón que nos regresa al inicio */}
      <button onClick={onVolver}>Volver</button>

      {/* Mostramos los datos de la empresa */}
      <InfoEmpresa empresa={empresa} />

      {/* Botón que abre el formulario vacío para agregar un empleado */}
      <button onClick={abrirAgregar}>Agregar empleado</button>

      {/* El formulario solo aparece si mostrarFormulario es true */}
      {/* key: si cambias de empleado (o de editar a agregar), el formulario se reinicia con los datos correctos */}
      {mostrarFormulario && (
        <FormularioEmpleado
          key={empleadoEditando ? empleadoEditando.id : 'nuevo'}
          empleado={empleadoEditando}
          onGuardar={guardarEmpleado}
          onCancelar={cerrarFormulario}
        />
      )}

      {/* La tabla de empleados: "Editar" abre el formulario con ese empleado y "Eliminar" lo manda a borrar */}
      <ListaEmpleados
        empleados={empleados}
        onEditar={abrirEditar}
        onEliminar={onEliminarEmpleado}
      />
    </div>
  )
}

// Exportamos la vista para que App.jsx pueda usarla
export default DetalleEmpresa
