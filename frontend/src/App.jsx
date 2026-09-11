import { useState, useEffect } from 'react' // useState guarda datos que cambian; useEffect ejecuta algo al abrir la página
import Inicio from './views/Inicio.jsx' // Vista de inicio (bienvenida + listado de empresas)
import DetalleEmpresa from './views/DetalleEmpresa.jsx' // Vista de detalle (información de la empresa + empleados)

// Dirección de la API, leída del archivo .env (en local vale http://localhost:8000)
const API = import.meta.env.VITE_API_URL

// ============================================================================
// CÓMO HABLA ESTE ARCHIVO CON LA API
// Todas las funciones de abajo siguen el mismo patrón de 4 pasos:
//
//   1. fetch(...)        -> manda la petición a la API y espera (await) la respuesta
//   2. respuesta.ok      -> true si salió bien (200, 201, 204); false si hubo error (404, 409, 422...)
//   3. respuesta.json()  -> convierte el cuerpo de la respuesta (texto JSON) en un objeto de JavaScript
//   4. setAlgo(...)      -> SOLO si salió bien, actualizamos la lista en pantalla con lo que devolvió la API
//
// Si la API responde con error, su mensaje viene en "detail" (es el que escribimos en el backend con
// HTTPException) y se lo mostramos al usuario con window.alert.
//
// Las funciones que se usan desde un formulario devuelven true o false: así la vista sabe si debe
// cerrar el formulario (se guardó) o dejarlo abierto para que el usuario corrija (hubo error).
// ============================================================================

// Componente principal: guarda los datos y decide qué vista se muestra
function App() {
  // Lista de empresas; empieza vacía porque los datos llegan de la API un instante después
  const [empresas, setEmpresas] = useState([])
  // Lista de TODOS los empleados de todas las empresas; también llega de la API
  const [empleados, setEmpleados] = useState([])
  // Código de la empresa a la que se le dio "Ver más"; null significa que estamos en el inicio
  const [codigoSeleccionado, setCodigoSeleccionado] = useState(null)

  // ---------- Carga inicial ----------

  // Al abrir la página traemos empresas y empleados de la API (el [] del final hace que sea solo una vez)
  useEffect(() => {
    // La función va dentro del useEffect (si va afuera, ESLint marca error)
    async function cargarDatos() {
      // try/catch: fetch solo "falla" (lanza un error) cuando no hay conexión, por ejemplo con la API apagada
      try {
        const respuestaEmpresas = await fetch(`${API}/empresas`) // GET /empresas
        const respuestaEmpleados = await fetch(`${API}/empleados`) // GET /empleados
        // Si la API respondió con error, avisamos y no tocamos las listas (así la tabla no se rompe)
        if (!respuestaEmpresas.ok || !respuestaEmpleados.ok) {
          window.alert('La API respondió con un error al cargar los datos.')
          return
        }
        setEmpresas(await respuestaEmpresas.json()) // guardamos las empresas: la tabla se redibuja
        setEmpleados(await respuestaEmpleados.json()) // guardamos los empleados
      } catch (error) {
        console.error(error) // el detalle técnico queda en la consola del navegador (Cmd+Option+J)
        window.alert('No se pudo conectar con la API. Revisa que el backend esté encendido.')
      }
    }
    cargarDatos() // la ejecutamos (definirla no basta)
  }, [])

  // ---------- Funciones de EMPRESAS ----------

  // Crea una empresa en la API. Recibe { nit, nombre }; el código lo genera la base de datos
  async function agregarEmpresa(nuevaEmpresa) {
    const respuesta = await fetch(`${API}/empresas`, {
      method: 'POST', // POST = crear
      headers: { 'Content-Type': 'application/json' }, // avisamos que mandamos JSON (como -H en curl)
      body: JSON.stringify({ nit: nuevaEmpresa.nit, nombre: nuevaEmpresa.nombre }), // objeto -> texto JSON (como -d en curl)
    })
    const datos = await respuesta.json() // la empresa creada (con su código) o el error
    if (!respuesta.ok) {
      window.alert(datos.detail) // ej: "Ya existe una empresa con ese NIT" (409)
      return false // no se guardó: el formulario queda abierto
    }
    setEmpresas([...empresas, datos]) // agregamos la que devolvió la API, porque trae el código generado
    return true // se guardó: el formulario se puede cerrar
  }

  // Edita una empresa en la API. Recibe la empresa completa: su código y los datos nuevos
  async function editarEmpresa(empresaEditada) {
    const respuesta = await fetch(`${API}/empresas/${empresaEditada.codigo}`, { // el código va en la dirección
      method: 'PUT', // PUT = editar
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nit: empresaEditada.nit, nombre: empresaEditada.nombre }), // solo lo que se puede cambiar
    })
    const datos = await respuesta.json() // la empresa actualizada o el error
    if (!respuesta.ok) {
      window.alert(datos.detail) // ej: NIT de otra empresa (409) o empresa no encontrada (404)
      return false
    }
    // map recorre las empresas: la que tiene ese código se cambia por la versión que devolvió la API
    setEmpresas(empresas.map((empresa) => (empresa.codigo === datos.codigo ? datos : empresa)))
    return true
  }

  // Elimina una empresa en la API. La base de datos borra sola a sus empleados (on delete cascade)
  async function eliminarEmpresa(codigo) {
    // Pedimos confirmación; si el usuario cancela, salimos sin borrar nada
    if (!window.confirm('¿Seguro que quieres eliminar esta empresa y todos sus empleados?')) return
    const respuesta = await fetch(`${API}/empresas/${codigo}`, { method: 'DELETE' }) // DELETE = eliminar
    // OJO: si sale bien, la API responde 204 SIN cuerpo, por eso solo leemos el JSON cuando hay error
    if (!respuesta.ok) {
      const error = await respuesta.json()
      window.alert(error.detail) // ej: "Empresa no encontrada" (404)
      return
    }
    setEmpresas(empresas.filter((empresa) => empresa.codigo !== codigo)) // quitamos la empresa de la pantalla
    setEmpleados(empleados.filter((empleado) => empleado.codigo_empresa !== codigo)) // y sus empleados (en la base de datos ya se borraron)
  }

  // ---------- Funciones de EMPLEADOS ----------
  // Los empleados usan "codigo_empresa" (con guion bajo) porque así se llama en la base de datos y en la API

  // Crea un empleado en la API. Recibe { codigo_empresa, cedula, nombre, salario }; el id lo genera la base de datos
  async function agregarEmpleado(nuevoEmpleado) {
    const respuesta = await fetch(`${API}/empleados`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        codigo_empresa: nuevoEmpleado.codigo_empresa, // a qué empresa pertenece
        cedula: nuevoEmpleado.cedula,
        nombre: nuevoEmpleado.nombre,
        salario: nuevoEmpleado.salario,
      }),
    })
    const datos = await respuesta.json() // el empleado creado (con su id) o el error
    if (!respuesta.ok) {
      window.alert(datos.detail) // ej: "Ya existe un empleado con esa cédula" (409)
      return false
    }
    setEmpleados([...empleados, datos]) // agregamos el que devolvió la API, porque trae el id generado
    return true
  }

  // Edita un empleado en la API. Recibe el empleado completo: su id y los datos nuevos
  async function editarEmpleado(empleadoEditado) {
    const respuesta = await fetch(`${API}/empleados/${empleadoEditado.id}`, { // el id va en la dirección
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        codigo_empresa: empleadoEditado.codigo_empresa,
        cedula: empleadoEditado.cedula,
        nombre: empleadoEditado.nombre,
        salario: empleadoEditado.salario,
      }),
    })
    const datos = await respuesta.json() // el empleado actualizado o el error
    if (!respuesta.ok) {
      window.alert(datos.detail) // ej: cédula de otro empleado (409) o empleado no encontrado (404)
      return false
    }
    // Igual que en editarEmpresa, pero comparando por id
    setEmpleados(empleados.map((empleado) => (empleado.id === datos.id ? datos : empleado)))
    return true
  }

  // Elimina un empleado en la API
  async function eliminarEmpleado(id) {
    // Pedimos confirmación; si el usuario cancela, no borramos nada
    if (!window.confirm('¿Seguro que quieres eliminar este empleado?')) return
    const respuesta = await fetch(`${API}/empleados/${id}`, { method: 'DELETE' })
    // Igual que en eliminarEmpresa: si sale bien no hay cuerpo (204), así que solo leemos el JSON si hay error
    if (!respuesta.ok) {
      const error = await respuesta.json()
      window.alert(error.detail) // ej: "Empleado no encontrado" (404)
      return
    }
    setEmpleados(empleados.filter((empleado) => empleado.id !== id)) // quitamos el empleado de la pantalla
  }

  // ---------- Qué vista mostrar ----------

  // Buscamos la empresa seleccionada en la lista (si no hay ninguna, queda undefined)
  const empresaSeleccionada = empresas.find((empresa) => empresa.codigo === codigoSeleccionado)

  // Si no hay empresa seleccionada, mostramos el inicio
  if (!empresaSeleccionada) {
    // Le pasamos las empresas y las funciones de los botones: Ver más, Agregar, Editar y Eliminar
    return (
      <Inicio
        empresas={empresas}
        onVerMas={setCodigoSeleccionado}
        onAgregar={agregarEmpresa}
        onEditar={editarEmpresa}
        onEliminar={eliminarEmpresa}
      />
    )
  }

  // Filtramos solo los empleados cuyo codigo_empresa es el de la empresa seleccionada
  const empleadosDeLaEmpresa = empleados.filter((empleado) => empleado.codigo_empresa === empresaSeleccionada.codigo)

  // Si hay empresa seleccionada, mostramos su detalle
  return (
    // Le pasamos la empresa, sus empleados, cómo volver y las funciones para agregar, editar y eliminar empleados
    <DetalleEmpresa
      empresa={empresaSeleccionada}
      empleados={empleadosDeLaEmpresa}
      onVolver={() => setCodigoSeleccionado(null)}
      onAgregarEmpleado={agregarEmpleado}
      onEditarEmpleado={editarEmpleado}
      onEliminarEmpleado={eliminarEmpleado}
    />
  )
}

// Exportamos App para que main.jsx pueda usarlo
export default App
