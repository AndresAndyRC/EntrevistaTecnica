// Componente que muestra los datos de una empresa
// Recibe: empresa (el objeto con código, NIT y nombre)
function InfoEmpresa({ empresa }) {
  // Lo que se va a dibujar en pantalla
  return (
    // Un contenedor que agrupa los datos
    <div>
      {/* Nombre de la empresa como título */}
      <h1>{empresa.nombre}</h1>
      {/* Código de la empresa */}
      <p>Código: {empresa.codigo}</p>
      {/* NIT de la empresa */}
      <p>NIT: {empresa.nit}</p>
    </div>
  )
}

// Exportamos el componente para que otras partes lo puedan usar
export default InfoEmpresa
