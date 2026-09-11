// Importamos useState para controlar el formulario de empresas
import { useState } from 'react'
// Importamos el componente que muestra el mensaje de bienvenida
import Bienvenida from '../components/Bienvenida.jsx'
// Importamos el componente que muestra la tabla de empresas
import ListaEmpresas from '../components/empresas/ListaEmpresas.jsx'
// Importamos el formulario para agregar o editar una empresa
import FormularioEmpresa from '../components/empresas/FormularioEmpresa.jsx'

// Vista de inicio: recibe (desde App) las empresas y las funciones de Ver más, Agregar, Editar y Eliminar
function Inicio({ empresas, onVerMas, onAgregar, onEditar, onEliminar }) {
  // true = el formulario de empresa está visible; false = está oculto
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  // Empresa que se está editando; null significa que estamos AGREGANDO una nueva
  const [empresaEditando, setEmpresaEditando] = useState(null)

  // Abre el formulario vacío para agregar una empresa
  function abrirAgregar() {
    // No hay empresa en edición, así que el formulario sale vacío
    setEmpresaEditando(null)
    // Mostramos el formulario
    setMostrarFormulario(true)
  }

  // Abre el formulario con los datos de una empresa para editarla
  function abrirEditar(empresa) {
    // Guardamos cuál empresa se va a editar
    setEmpresaEditando(empresa)
    // Mostramos el formulario
    setMostrarFormulario(true)
  }

  // Oculta el formulario y limpia la empresa en edición
  function cerrarFormulario() {
    // Ocultamos el formulario
    setMostrarFormulario(false)
    // Ya no hay empresa en edición
    setEmpresaEditando(null)
  }

  // Se ejecuta cuando en el formulario se da clic en "Guardar"; recibe código, NIT y nombre
  function guardarEmpresa(datos) {
    // Si hay una empresa en edición, estamos editando
    if (empresaEditando) {
      // Mandamos los cambios a App, que es quien guarda la lista
      onEditar(datos)
    } else {
      // Si no, estamos agregando: revisamos que no exista otra empresa con el mismo código (some devuelve true si alguna coincide)
      const codigoRepetido = empresas.some((empresa) => empresa.codigo === datos.codigo)
      // Si el código ya existe, avisamos y salimos sin guardar (el formulario sigue abierto para corregirlo)
      if (codigoRepetido) {
        // Mensaje de aviso para el usuario
        window.alert('Ya existe una empresa con ese código.')
        // Salimos de la función aquí
        return
      }
      // Si el código es nuevo, mandamos la empresa a App para que la agregue
      onAgregar(datos)
    }
    // En los dos casos, cerramos el formulario al terminar
    cerrarFormulario()
  }

  // Lo que se va a dibujar en pantalla
  return (
    // Un contenedor que agrupa toda la vista
    <div>
      {/* Mostramos la bienvenida */}
      <Bienvenida />

      {/* Botón que abre el formulario vacío para agregar una empresa */}
      <button onClick={abrirAgregar}>Agregar empresa</button>

      {/* El formulario solo aparece si mostrarFormulario es true (&& = "si lo de la izquierda es verdad, dibuja lo de la derecha") */}
      {/* key: si cambias de empresa (o de editar a agregar), el formulario se reinicia con los datos correctos */}
      {mostrarFormulario && (
        <FormularioEmpresa
          key={empresaEditando ? empresaEditando.codigo : 'nueva'}
          empresa={empresaEditando}
          onGuardar={guardarEmpresa}
          onCancelar={cerrarFormulario}
        />
      )}

      {/* La tabla de empresas: "Editar" abre el formulario con los datos de esa empresa */}
      <ListaEmpresas
        empresas={empresas}
        onVerMas={onVerMas}
        onEditar={abrirEditar}
        onEliminar={onEliminar}
      />
    </div>
  )
}

// Exportamos la vista para que App.jsx pueda usarla
export default Inicio
