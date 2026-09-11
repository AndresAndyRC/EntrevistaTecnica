// Componente que muestra la tabla de empleados con sus dos botones
// Recibe: empleados (la lista de empleados de una empresa) y las funciones onEditar y onEliminar
function ListaEmpleados({ empleados, onEditar, onEliminar }) {
  // Si la empresa no tiene empleados, mostramos un mensaje en lugar de una tabla vacía
  if (empleados.length === 0) {
    // Mensaje cuando no hay empleados
    return <p>Esta empresa no tiene empleados.</p>
  }

  // Lo que se va a dibujar en pantalla
  return (
    // Un contenedor que agrupa el título y la tabla
    <div>
      {/* Título de la sección */}
      <h2>Empleados</h2>
      {/* Tabla con los datos */}
      <table>
        {/* thead: la fila de títulos de las columnas */}
        <thead>
          <tr>
            <th>Id</th>
            <th>Código empresa</th>
            <th>Cédula</th>
            <th>Nombre</th>
            <th>Salario</th>
            <th>Acciones</th>
          </tr>
        </thead>
        {/* tbody: el cuerpo de la tabla, una fila por empleado */}
        <tbody>
          {/* map recorre cada empleado y por cada uno crea una fila <tr> */}
          {empleados.map((empleado) => (
            // key es obligatorio en listas: le dice a React cuál fila es cuál (usamos el id porque no se repite)
            <tr key={empleado.id}>
              {/* Una celda por cada dato del empleado */}
              <td>{empleado.id}</td>
              <td>{empleado.codigo_empresa}</td>
              <td>{empleado.cedula}</td>
              <td>{empleado.nombre}</td>
              <td>{empleado.salario}</td>
              {/* Celda con los dos botones */}
              <td>
                {/* Editar: manda el empleado completo para llenar el formulario */}
                <button onClick={() => onEditar(empleado)}>Editar</button>
                {/* Eliminar: manda el id del empleado que se va a borrar */}
                <button onClick={() => onEliminar(empleado.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// Exportamos el componente para que otras partes lo puedan usar
export default ListaEmpleados
