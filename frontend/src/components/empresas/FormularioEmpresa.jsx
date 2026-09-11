import { useState } from 'react'
import './FormularioEmpresa.css'

// Sirve para agregar y editar: si empresa es null, se está agregando una nueva
function FormularioEmpresa({ empresa, onGuardar, onCancelar }) {
  const esEdicion = empresa !== null
  const [nit, setNit] = useState(esEdicion ? empresa.nit : '')
  const [nombre, setNombre] = useState(esEdicion ? empresa.nombre : '')

  function manejarEnvio(evento) {
    evento.preventDefault()
    onGuardar({ nit: nit, nombre: nombre })
  }

  return (
    <form className="tarjeta formulario formulario-empresa" onSubmit={manejarEnvio}>
      <h2>{esEdicion ? 'Editar empresa' : 'Agregar empresa'}</h2>
      {/* El código es de solo lectura: lo genera la base de datos */}
      {esEdicion && <p className="formulario-empresa-codigo">Código: {empresa.codigo}</p>}
      <div>
        <label>NIT: <input value={nit} onChange={(evento) => setNit(evento.target.value)} required /></label>
      </div>
      <div>
        <label>Nombre: <input value={nombre} onChange={(evento) => setNombre(evento.target.value)} required /></label>
      </div>
      <div className="formulario-acciones">
        <button type="button" onClick={onCancelar}>Cancelar</button>
        <button type="submit" className="boton-primario">Guardar</button>
      </div>
    </form>
  )
}

export default FormularioEmpresa
