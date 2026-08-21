import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import HeaderInterno from '../components/HeaderInterno'
import { apiFetch } from '../lib/api'

export default function GestionAldeas() {
  const navigate = useNavigate()

  const [aldeas, setAldeas] = useState([])
  const [nombreNuevo, setNombreNuevo] = useState('')
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')
  const [cargandoLista, setCargandoLista] = useState(true)

  // Edición en línea
  const [editandoId, setEditandoId] = useState(null)
  const [nombreEditado, setNombreEditado] = useState('')
  const [guardandoEdicion, setGuardandoEdicion] = useState(false)

  async function cargarAldeas() {
    setCargandoLista(true)
    try {
      const data = await apiFetch('/api/aldeas?soloActivas=false')
      setAldeas(data)
    } catch (err) {
      setError('No se pudo cargar el listado de aldeas.')
    } finally {
      setCargandoLista(false)
    }
  }

  useEffect(() => {
    cargarAldeas()
  }, [])

  async function handleCrear(e) {
    e.preventDefault()
    setError('')

    if (!nombreNuevo.trim()) {
      setError('El nombre no puede estar vacío.')
      return
    }

    setCargando(true)
    try {
      const token = localStorage.getItem('token')
      await apiFetch('/api/aldeas', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ nombre: nombreNuevo.trim() }),
      })
      setNombreNuevo('')
      await cargarAldeas()
    } catch (err) {
      setError(err.message || 'No se pudo crear la aldea.')
    } finally {
      setCargando(false)
    }
  }

  async function handleToggleActivo(aldea) {
    try {
      const token = localStorage.getItem('token')
      await apiFetch(`/api/aldeas/${aldea.id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ nombre: aldea.nombre, activo: !aldea.activo }),
      })
      await cargarAldeas()
    } catch (err) {
      setError('No se pudo actualizar el estado de la aldea.')
    }
  }

  async function handleEliminar(aldea) {
    if (!confirm(`¿Eliminar "${aldea.nombre}"? Esta acción no se puede deshacer.`)) return

    try {
      const token = localStorage.getItem('token')
      await apiFetch(`/api/aldeas/${aldea.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      await cargarAldeas()
    } catch (err) {
      setError('No se pudo eliminar la aldea.')
    }
  }

  function handleIniciarEdicion(aldea) {
    setEditandoId(aldea.id)
    setNombreEditado(aldea.nombre)
    setError('')
  }

  function handleCancelarEdicion() {
    setEditandoId(null)
    setNombreEditado('')
  }

  async function handleGuardarEdicion(aldea) {
    if (!nombreEditado.trim()) {
      setError('El nombre no puede estar vacío.')
      return
    }

    setGuardandoEdicion(true)
    try {
      const token = localStorage.getItem('token')
      await apiFetch(`/api/aldeas/${aldea.id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ nombre: nombreEditado.trim(), activo: aldea.activo }),
      })
      setEditandoId(null)
      setNombreEditado('')
      await cargarAldeas()
    } catch (err) {
      setError(err.message || 'No se pudo actualizar la aldea.')
    } finally {
      setGuardandoEdicion(false)
    }
  }

  const inputClass =
    'w-full px-4 py-2.5 rounded-md border border-[var(--color-azul-piedra)]/30 bg-white text-[var(--color-tinta)] placeholder:text-[var(--color-azul-piedra)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-ocre)] transition-shadow'

  return (
    <div className="min-h-[calc(100vh-73px)] bg-[var(--color-piedra)]">
      <HeaderInterno titulo="Aldeas y comunidades" />

      <main className="max-w-3xl mx-auto px-6 py-10">
        <button
          onClick={() => navigate('/admin')}
          className="text-sm text-[var(--color-azul-piedra)] hover:text-[var(--color-ocre)] mb-6 transition-colors"
        >
          ← Volver al panel
        </button>

        <div className="bg-[var(--color-piedra-clara)] rounded-lg border border-[var(--color-azul-piedra)]/15 p-6 mb-8">
          <h2 className="font-display text-lg font-semibold text-[var(--color-verde-institucional)] mb-4">
            Agregar nueva aldea o comunidad
          </h2>
          <form onSubmit={handleCrear} className="flex gap-3">
            <input
              type="text"
              value={nombreNuevo}
              onChange={(e) => setNombreNuevo(e.target.value)}
              placeholder="Ej. Aldea Santa Rosa"
              className={inputClass}
            />
            <button
              type="submit"
              disabled={cargando}
              className="px-6 py-2.5 rounded-md bg-[var(--color-ocre)] text-[var(--color-piedra-clara)] font-semibold hover:bg-[var(--color-ocre-claro)] transition-colors disabled:opacity-60 whitespace-nowrap"
            >
              {cargando ? 'Agregando...' : 'Agregar'}
            </button>
          </form>
          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2 mt-3">
              {error}
            </p>
          )}
        </div>

        <div className="bg-[var(--color-piedra-clara)] rounded-lg border border-[var(--color-azul-piedra)]/15 overflow-hidden">
          <h2 className="font-display text-lg font-semibold text-[var(--color-verde-institucional)] p-6 pb-0">
            Listado actual
          </h2>

          {cargandoLista ? (
            <p className="text-sm text-[var(--color-tinta)]/60 p-6">Cargando...</p>
          ) : aldeas.length === 0 ? (
            <p className="text-sm text-[var(--color-tinta)]/60 p-6">No hay aldeas registradas todavía.</p>
          ) : (
            <ul className="divide-y divide-[var(--color-azul-piedra)]/10">
              {aldeas.map((a) => (
                <li key={a.id} className="flex items-center justify-between px-6 py-4 gap-4">
                  {editandoId === a.id ? (
                    <>
                      <input
                        type="text"
                        value={nombreEditado}
                        onChange={(e) => setNombreEditado(e.target.value)}
                        className={`${inputClass} flex-1`}
                        autoFocus
                      />
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <button
                          onClick={() => handleGuardarEdicion(a)}
                          disabled={guardandoEdicion}
                          className="text-sm text-green-600 hover:text-green-800 font-medium transition-colors disabled:opacity-60"
                        >
                          {guardandoEdicion ? 'Guardando...' : 'Guardar'}
                        </button>
                        <button
                          onClick={handleCancelarEdicion}
                          className="text-sm text-[var(--color-tinta)]/60 hover:text-[var(--color-tinta)] transition-colors"
                        >
                          Cancelar
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-3">
                        <span
                          className={`h-2 w-2 rounded-full flex-shrink-0 ${a.activo ? 'bg-green-500' : 'bg-gray-300'}`}
                        />
                        <span className="text-[var(--color-tinta)]">{a.nombre}</span>
                      </div>
                      <div className="flex items-center gap-4 flex-shrink-0">
                        <button
                          onClick={() => handleIniciarEdicion(a)}
                          className="text-sm text-[var(--color-azul-piedra)] hover:text-[var(--color-ocre)] transition-colors"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleToggleActivo(a)}
                          className="text-sm text-[var(--color-azul-piedra)] hover:text-[var(--color-ocre)] transition-colors"
                        >
                          {a.activo ? 'Desactivar' : 'Activar'}
                        </button>
                        <button
                          onClick={() => handleEliminar(a)}
                          className="text-sm text-red-500 hover:text-red-700 transition-colors"
                        >
                          Eliminar
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  )
}