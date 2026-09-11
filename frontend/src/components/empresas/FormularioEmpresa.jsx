// Importamos useState para guardar lo que el usuario va escribiendo
import { useState } from 'react'

// Formulario para agregar o editar una empresa
// Recibe: empresa (sus datos si se está editando, o null si se está agregando), onGuardar y onCancelar
function FormularioEmpresa({ empresa, onGuardar, onCancelar }) {
  // Si nos llega una empresa estamos editando; si llega null estamos agregando
  const esEdicion = empresa !== null
  // Valor del campo NIT: si editamos empieza con su NIT, si agregamos empieza vacío
  const [nit, setNit] = useState(esEdicion ? empresa.nit : '')
  // Valor del campo Nombre: igual que el NIT
  const [nombre, setNombre] = useState(esEdicion ? empresa.nombre : '')

  // Se ejecuta al enviar el formulario (clic en "Guardar")
  function manejarEnvio(evento) {
    // Evita que el navegador recargue la página, que es lo que hace un formulario por defecto
    evento.preventDefault()
    // Mandamos solo NIT y nombre: el código lo genera la base de datos
    onGuardar({ nit: nit, nombre: nombre })
  }

  // Lo que se va a dibujar en pantalla
  return (
    // Formulario: al enviarlo se ejecuta manejarEnvio
    <form onSubmit={manejarEnvio}>
      {/* El título cambia según si estamos editando o agregando */}
      <h2>{esEdicion ? 'Editar empresa' : 'Agregar empresa'}</h2>
      {/* Al editar mostramos el código solo como texto: lo genera la base de datos y no se puede cambiar */}
      {esEdicion && <p>Código: {empresa.codigo}</p>}
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
