// Componente que muestra la tabla de empresas con sus tres botones
// Recibe: empresas (la lista) y las funciones onVerMas, onEditar y onEliminar
function ListaEmpresas({ empresas, onVerMas, onEditar, onEliminar }) {
  // Si la lista está vacía, mostramos un mensaje en lugar de una tabla vacía
  if (empresas.length === 0) {
    // Mensaje cuando no hay empresas
    return <p>No hay empresas registradas.</p>
  }

  // Lo que se va a dibujar en pantalla
  return (
    // Un contenedor que agrupa el título y la tabla
    <div>
      {/* Título de la sección */}
      <h2>Empresas</h2>
      {/* Tabla con los datos */}
      <table>
        {/* thead: la fila de títulos de las columnas */}
        <thead>
          <tr>
            <th>Código</th>
            <th>NIT</th>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        {/* tbody: el cuerpo de la tabla, una fila por empresa */}
        <tbody>
          {/* map recorre cada empresa y por cada una crea una fila <tr> */}
          {empresas.map((empresa) => (
            // key es obligatorio en listas: le dice a React cuál fila es cuál (usamos el código porque no se repite)
            <tr key={empresa.codigo}>
              {/* Una celda por cada dato de la empresa */}
              <td>{empresa.codigo}</td>
              <td>{empresa.nit}</td>
              <td>{empresa.nombre}</td>
              {/* Celda con los tres botones */}
              <td>
                {/* Ver más: manda el código a App para abrir la vista de detalle */}
                <button onClick={() => onVerMas(empresa.codigo)}>Ver más</button>
                {/* Editar: manda la empresa completa para llenar el formulario */}
                <button onClick={() => onEditar(empresa)}>Editar</button>
                {/* Eliminar: manda el código de la empresa que se va a borrar */}
                <button onClick={() => onEliminar(empresa.codigo)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// Exportamos el componente para que otras partes lo puedan usar
export default ListaEmpresas
