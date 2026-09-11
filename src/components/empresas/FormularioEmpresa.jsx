// Importamos useState para guardar lo que el usuario va escribiendo
import { useState } from 'react'

// Formulario para agregar o editar una empresa
// Recibe: empresa (sus datos si se está editando, o null si se está agregando), onGuardar y onCancelar
function FormularioEmpresa({ empresa, onGuardar, onCancelar }) {
  // Si nos llega una empresa estamos editando; si llega null estamos agregando
  const esEdicion = empresa !== null
  // Valor del campo Código: si editamos empieza con su código, si agregamos empieza vacío
  const [codigo, setCodigo] = useState(esEdicion ? empresa.codigo : '')
  // Valor del campo NIT: igual que el código
  const [nit, setNit] = useState(esEdicion ? empresa.nit : '')
  // Valor del campo Nombre: igual que el código
  const [nombre, setNombre] = useState(esEdicion ? empresa.nombre : '')

  // Se ejecuta al enviar el formulario (clic en "Guardar")
  function manejarEnvio(evento) {
    // Evita que el navegador recargue la página, que es lo que hace un formulario por defecto
    evento.preventDefault()
    // Mandamos los datos escritos en el formulario
    onGuardar({ codigo: codigo, nit: nit, nombre: nombre })
  }

  // Lo que se va a dibujar en pantalla
  return (
    // Formulario: al enviarlo se ejecuta manejarEnvio
    <form onSubmit={manejarEnvio}>
      {/* El título cambia según si estamos editando o agregando */}
      <h2>{esEdicion ? 'Editar empresa' : 'Agregar empresa'}</h2>
      {/* Campo Código: al agregar se puede escribir; al editar queda bloqueado (disabled) porque los empleados lo usan para saber a qué empresa pertenecen */}
      <div>
        <label>Código: <input value={codigo} onChange={(evento) => setCodigo(evento.target.value)} disabled={esEdicion} required /></label>
      </div>
      {/* Campo NIT: value muestra lo guardado y onChange guarda cada letra que se escribe; required no deja enviarlo vacío */}
      <div>
        <label>NIT: <input value={nit} onChange={(evento) => setNit(evento.target.value)} required /></label>
      </div>
      {/* Campo Nombre: funciona igual que el de NIT */}
      <div>
        <label>Nombre: <input value={nombre} onChange={(evento) => setNombre(evento.target.value)} required /></label>
      </div>
      {/* type="submit": este botón envía el formulario */}
      <button type="submit">Guardar</button>
      {/* type="button": este botón NO envía el formulario, solo lo cierra */}
      <button type="button" onClick={onCancelar}>Cancelar</button>
    </form>
  )
}

// Exportamos el componente para que otras partes lo puedan usar
export default FormularioEmpresa
