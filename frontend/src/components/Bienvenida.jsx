// Componente que solo muestra un mensaje de bienvenida (no recibe datos)
function Bienvenida() {
  // Lo que se va a dibujar en pantalla
  return (
    // Un contenedor que agrupa el título y el texto
    <div>
      {/* Título principal */}
      <h1>Bienvenido</h1>
      {/* Texto que explica qué hacer */}
      <p>Da clic en "Ver más" en una empresa para ver su información y sus empleados.</p>
    </div>
  )
}

// Exportamos el componente para que otras partes lo puedan usar
export default Bienvenida
