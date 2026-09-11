// Importamos useState para guardar lo que el usuario va escribiendo
import { useState } from 'react'

// Formulario para agregar o editar un empleado
// Recibe: empleado (sus datos si se está editando, o null si se está agregando), onGuardar y onCancelar
function FormularioEmpleado({ empleado, onGuardar, onCancelar }) {
  // Si nos llega un empleado estamos editando; si llega null estamos agregando
  const esEdicion = empleado !== null
  // Valor del campo Cédula: si editamos empieza con su cédula, si agregamos empieza vacío
  const [cedula, setCedula] = useState(esEdicion ? empleado.cedula : '')
  // Valor del campo Nombre: igual que la cédula
  const [nombre, setNombre] = useState(esEdicion ? empleado.nombre : '')
  // Valor del campo Salario: igual que la cédula
  const [salario, setSalario] = useState(esEdicion ? empleado.salario : '')

  // Se ejecuta al enviar el formulario (clic en "Guardar")
  function manejarEnvio(evento) {
    // Evita que el navegador recargue la página, que es lo que hace un formulario por defecto
    evento.preventDefault()
    // Mandamos los datos escritos; Number() convierte el salario de texto a número
    onGuardar({ cedula: cedula, nombre: nombre, salario: Number(salario) })
  }

  // Lo que se va a dibujar en pantalla
  return (
    // Formulario: al enviarlo se ejecuta manejarEnvio
    <form onSubmit={manejarEnvio}>
      {/* El título cambia según si estamos editando o agregando */}
      <h2>{esEdicion ? 'Editar empleado' : 'Agregar empleado'}</h2>
      {/* Campo Cédula: value muestra lo guardado y onChange guarda cada letra que se escribe; required no deja enviarlo vacío */}
      <div>
        <label>Cédula: <input value={cedula} onChange={(evento) => setCedula(evento.target.value)} required /></label>
      </div>
      {/* Campo Nombre: funciona igual que el de Cédula */}
      <div>
        <label>Nombre: <input value={nombre} onChange={(evento) => setNombre(evento.target.value)} required /></label>
      </div>
      {/* Campo Salario: type="number" solo deja escribir números y min="0" no deja números negativos */}
      <div>
        <label>Salario: <input type="number" min="0" value={salario} onChange={(evento) => setSalario(evento.target.value)} required /></label>
      </div>
      {/* type="submit": este botón envía el formulario */}
      <button type="submit">Guardar</button>
      {/* type="button": este botón NO envía el formulario, solo lo cierra */}
      <button type="button" onClick={onCancelar}>Cancelar</button>
    </form>
  )
}

// Exportamos el componente para que otras partes lo puedan usar
export default FormularioEmpleado
