import { useState, useEffect } from 'react'
import Inicio from './views/Inicio.jsx'
import DetalleEmpresa from './views/DetalleEmpresa.jsx'
import './App.css'

// En local: http://localhost:8000 (ver .env.example)
const API = import.meta.env.VITE_API_URL

// Guarda el estado de la aplicación y decide qué vista mostrar
function App() {
  const [empresas, setEmpresas] = useState([])
  const [empleados, setEmpleados] = useState([])
  // null = vista de inicio; un código = detalle de esa empresa
  const [codigoSeleccionado, setCodigoSeleccionado] = useState(null)

  // Carga inicial: se ejecuta una sola vez al montar el componente
  useEffect(() => {
    async function cargarDatos() {
      try {
        const respuestaEmpresas = await fetch(`${API}/empresas`)
        const respuestaEmpleados = await fetch(`${API}/empleados`)
        if (!respuestaEmpresas.ok || !respuestaEmpleados.ok) {
          window.alert('La API respondió con un error al cargar los datos.')
          return
        }
        setEmpresas(await respuestaEmpresas.json())
        setEmpleados(await respuestaEmpleados.json())
      } catch (error) {
        // fetch solo lanza error si no hay conexión; los 4xx/5xx se revisan con .ok
        console.error(error)
        window.alert('No se pudo conectar con la API. Revisa que el backend esté encendido.')
      }
    }
    cargarDatos()
  }, [])

  // Las funciones de guardar devuelven true/false para que el formulario sepa si puede cerrarse

  // ---------- Empresas ----------

  async function agregarEmpresa(nuevaEmpresa) {
    const respuesta = await fetch(`${API}/empresas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nit: nuevaEmpresa.nit, nombre: nuevaEmpresa.nombre }),
    })
    const datos = await respuesta.json()
    if (!respuesta.ok) {
      window.alert(datos.detail)
      return false
    }
    // Se usa la respuesta de la API porque trae el código generado
    setEmpresas([...empresas, datos])
    return true
  }

  async function editarEmpresa(empresaEditada) {
    const respuesta = await fetch(`${API}/empresas/${empresaEditada.codigo}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nit: empresaEditada.nit, nombre: empresaEditada.nombre }),
    })
    const datos = await respuesta.json()
    if (!respuesta.ok) {
      window.alert(datos.detail)
      return false
    }
    setEmpresas(empresas.map((empresa) => (empresa.codigo === datos.codigo ? datos : empresa)))
    return true
  }

  async function eliminarEmpresa(codigo) {
    if (!window.confirm('¿Seguro que quieres eliminar esta empresa y todos sus empleados?')) return
    const respuesta = await fetch(`${API}/empresas/${codigo}`, { method: 'DELETE' })
    // 204 no trae cuerpo: solo se lee el JSON si hay error
    if (!respuesta.ok) {
      const error = await respuesta.json()
      window.alert(error.detail)
      return
    }
    setEmpresas(empresas.filter((empresa) => empresa.codigo !== codigo))
    // La base de datos ya borró sus empleados (on delete cascade); aquí se reflejan en pantalla
    setEmpleados(empleados.filter((empleado) => empleado.codigo_empresa !== codigo))
  }

  // ---------- Empleados ----------

  async function agregarEmpleado(nuevoEmpleado) {
    const respuesta = await fetch(`${API}/empleados`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        codigo_empresa: nuevoEmpleado.codigo_empresa,
        cedula: nuevoEmpleado.cedula,
        nombre: nuevoEmpleado.nombre,
        salario: nuevoEmpleado.salario,
      }),
    })
    const datos = await respuesta.json()
    if (!respuesta.ok) {
      window.alert(datos.detail)
      return false
    }
    // Se usa la respuesta de la API porque trae el id generado
    setEmpleados([...empleados, datos])
    return true
  }

  async function editarEmpleado(empleadoEditado) {
    const respuesta = await fetch(`${API}/empleados/${empleadoEditado.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        codigo_empresa: empleadoEditado.codigo_empresa,
        cedula: empleadoEditado.cedula,
        nombre: empleadoEditado.nombre,
        salario: empleadoEditado.salario,
      }),
    })
    const datos = await respuesta.json()
    if (!respuesta.ok) {
      window.alert(datos.detail)
      return false
    }
    setEmpleados(empleados.map((empleado) => (empleado.id === datos.id ? datos : empleado)))
    return true
  }

  async function eliminarEmpleado(id) {
    if (!window.confirm('¿Seguro que quieres eliminar este empleado?')) return
    const respuesta = await fetch(`${API}/empleados/${id}`, { method: 'DELETE' })
    // 204 no trae cuerpo: solo se lee el JSON si hay error
    if (!respuesta.ok) {
      const error = await respuesta.json()
      window.alert(error.detail)
      return
    }
    setEmpleados(empleados.filter((empleado) => empleado.id !== id))
  }

  // ---------- Vista ----------

  const empresaSeleccionada = empresas.find((empresa) => empresa.codigo === codigoSeleccionado)

  if (!empresaSeleccionada) {
    return (
      <main className="app">
        <Inicio
          empresas={empresas}
          onVerMas={setCodigoSeleccionado}
          onAgregar={agregarEmpresa}
          onEditar={editarEmpresa}
          onEliminar={eliminarEmpresa}
        />
      </main>
    )
  }

  const empleadosDeLaEmpresa = empleados.filter((empleado) => empleado.codigo_empresa === empresaSeleccionada.codigo)

  return (
    <main className="app">
      <DetalleEmpresa
        empresa={empresaSeleccionada}
        empleados={empleadosDeLaEmpresa}
        onVolver={() => setCodigoSeleccionado(null)}
        onAgregarEmpleado={agregarEmpleado}
        onEditarEmpleado={editarEmpleado}
        onEliminarEmpleado={eliminarEmpleado}
      />
    </main>
  )
}

export default App
