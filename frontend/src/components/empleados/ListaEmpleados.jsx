import './ListaEmpleados.css'

function ListaEmpleados({ empleados, onEditar, onEliminar }) {
  if (empleados.length === 0) {
    return <p className="tarjeta mensaje-vacio">Esta empresa no tiene empleados.</p>
  }

  return (
    <div className="tarjeta lista-empleados">
      <h2>Empleados</h2>
      <div className="tabla-contenedor">
        <table>
          <thead>
            <tr>
              <th className="columna-id">Id</th>
              <th className="columna-id">Código empresa</th>
              <th>Cédula</th>
              <th>Nombre</th>
              <th className="columna-salario">Salario</th>
              <th className="celda-acciones">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {empleados.map((empleado) => (
              <tr key={empleado.id}>
                <td className="columna-id">{empleado.id}</td>
                <td className="columna-id">{empleado.codigo_empresa}</td>
                <td>{empleado.cedula}</td>
                <td>{empleado.nombre}</td>
                <td className="columna-salario">{empleado.salario}</td>
                <td className="celda-acciones">
                  <button onClick={() => onEditar(empleado)}>Editar</button>
                  <button className="boton-peligro" onClick={() => onEliminar(empleado.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ListaEmpleados
