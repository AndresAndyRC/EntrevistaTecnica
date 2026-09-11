import './InfoEmpresa.css'

function InfoEmpresa({ empresa }) {
  return (
    <div className="tarjeta info-empresa">
      <h1>{empresa.nombre}</h1>
      <div className="info-empresa-datos">
        <p><strong>Código:</strong> {empresa.codigo}</p>
        <p><strong>NIT:</strong> {empresa.nit}</p>
      </div>
    </div>
  )
}

export default InfoEmpresa
