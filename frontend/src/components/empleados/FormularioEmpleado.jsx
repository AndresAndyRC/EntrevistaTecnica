import { useState } from 'react'
import './FormularioEmpleado.css'

// Sirve para agregar y editar: si empleado es null, se está agregando uno nuevo.
// No pide codigo_empresa: lo asigna DetalleEmpresa.
function FormularioEmpleado({ empleado, onGuardar, onCancelar }) {
  const esEdicion = empleado !== null
  const [cedula, setCedula] = useState(esEdicion ? empleado.cedula : '')
  const [nombre, setNombre] = useState(esEdicion ? empleado.nombre : '')
  const [salario, setSalario] = useState(esEdicion ? empleado.salario : '')

  function manejarEnvio(evento) {
    evento.preventDefault()
    // El input entrega texto; la API espera un número
    onGuardar({ cedula: cedula, nombre: nombre, salario: Number(salario) })
  }

  return (
    <form className="tarjeta formulario formulario-empleado" onSubmit={manejarEnvio}>
      <h2>{esEdicion ? 'Editar empleado' : 'Agregar empleado'}</h2>
      <div>
        <label>Cédula: <input value={cedula} onChange={(evento) => setCedula(evento.target.value)} required /></label>
      </div>
      <div>
        <label>Nombre: <input value={nombre} onChange={(evento) => setNombre(evento.target.value)} required /></label>
      </div>
      <div>
        <label>Salario: <input type="number" min="0" value={salario} onChange={(evento) => setSalario(evento.target.value)} required /></label>
      </div>
      <div className="formulario-acciones">
        <button type="button" onClick={onCancelar}>Cancelar</button>
        <button type="submit" className="boton-primario">Guardar</button>
      </div>
    </form>
  )
}

export default FormularioEmpleado
