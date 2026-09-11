import { useState } from 'react'
import Bienvenida from '../components/Bienvenida.jsx'
import ListaEmpresas from '../components/empresas/ListaEmpresas.jsx'
import FormularioEmpresa from '../components/empresas/FormularioEmpresa.jsx'
import './Inicio.css'

// Vista principal: listado de empresas y su formulario
function Inicio({ empresas, onVerMas, onAgregar, onEditar, onEliminar }) {
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  // null = se está agregando una empresa nueva
  const [empresaEditando, setEmpresaEditando] = useState(null)

  function abrirAgregar() {
    setEmpresaEditando(null)
    setMostrarFormulario(true)
  }

  function abrirEditar(empresa) {
    setEmpresaEditando(empresa)
    setMostrarFormulario(true)
  }

  function cerrarFormulario() {
    setMostrarFormulario(false)
    setEmpresaEditando(null)
  }

  async function guardarEmpresa(datos) {
    let guardado
    if (empresaEditando) {
      // Conserva el código y reemplaza NIT y nombre
      guardado = await onEditar({ ...empresaEditando, ...datos })
    } else {
      guardado = await onAgregar(datos)
    }
    // Si la API rechazó los datos, el formulario queda abierto para corregir
    if (!guardado) return
    cerrarFormulario()
  }

  return (
    <div className="inicio">
      <Bienvenida />

      <div className="inicio-barra">
        <button className="boton-primario" onClick={abrirAgregar}>Agregar empresa</button>
      </div>

      {/* key reinicia el formulario al cambiar de empresa o pasar de editar a agregar */}
      {mostrarFormulario && (
        <FormularioEmpresa
          key={empresaEditando ? empresaEditando.codigo : 'nueva'}
          empresa={empresaEditando}
          onGuardar={guardarEmpresa}
          onCancelar={cerrarFormulario}
        />
      )}

      <ListaEmpresas
        empresas={empresas}
        onVerMas={onVerMas}
        onEditar={abrirEditar}
        onEliminar={onEliminar}
      />
    </div>
  )
}

export default Inicio
