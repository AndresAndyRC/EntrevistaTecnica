import './Bienvenida.css'

// El logo va en frontend/public/logo.png; Vite sirve esa carpeta en la raíz, por eso la ruta es /logo.png
function Bienvenida() {
  return (
    <section className="tarjeta bienvenida">
      <img className="bienvenida-logo" src="/logo.png" alt="Logo del proyecto" />
      <div>
        <h1>Gestión de Empresas y Empleados</h1>
        <p className="bienvenida-descripcion">
          Administra en un solo lugar las empresas registradas y el personal de cada una.
        </p>
        <ul className="bienvenida-lista">
          <li>Registra empresas con su NIT y nombre; el código se asigna automáticamente.</li>
          <li>Da clic en <strong>Ver más</strong> para consultar una empresa y gestionar sus empleados.</li>
          <li>Al eliminar una empresa también se eliminan todos sus empleados.</li>
        </ul>
      </div>
    </section>
  )
}

export default Bienvenida
