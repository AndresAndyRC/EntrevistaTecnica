import './ListaEmpresas.css'

function ListaEmpresas({ empresas, onVerMas, onEditar, onEliminar }) {
  if (empresas.length === 0) {
    return <p className="tarjeta mensaje-vacio">No hay empresas registradas.</p>
  }

  return (
    <div className="tarjeta lista-empresas">
      <h2>Empresas</h2>
      <div className="tabla-contenedor">
        <table>
          <thead>
            <tr>
              <th className="columna-codigo">Código</th>
              <th>NIT</th>
              <th>Nombre</th>
              <th className="celda-acciones">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {empresas.map((empresa) => (
              <tr key={empresa.codigo}>
                <td className="columna-codigo">{empresa.codigo}</td>
                <td>{empresa.nit}</td>
                <td className="columna-nombre">{empresa.nombre}</td>
                <td className="celda-acciones">
                  <button className="boton-ver-mas" onClick={() => onVerMas(empresa.codigo)}>Ver más</button>
                  <button onClick={() => onEditar(empresa)}>Editar</button>
                  <button className="boton-peligro" onClick={() => onEliminar(empresa.codigo)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ListaEmpresas
