import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import HeaderInterno from '../components/HeaderInterno'
import { apiFetch } from '../lib/api'
import { traducirError } from '../lib/traducirError'
import ModalExito from '../components/ModalExito'
import ModalCargando from '../components/ModalCargando'

export default function MiPerfil() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    nombre: '', apellido: '', direccion: '', aldea: '', telefono: '',
  })
  const [datosSoloLectura, setDatosSoloLectura] = useState({ email: '', cui: '', fechaNacimiento: '' })
  const [aldeas, setAldeas] = useState([])
  const [cargandoDatos, setCargandoDatos] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')
  const [exito, setExito] = useState('')

  async function cargarPerfil() {
    setCargandoDatos(true)
    try {
      const token = localStorage.getItem('token')
      const data = await apiFetch('/api/auth/mi-perfil', {
        headers: { Authorization: `Bearer ${token}` },
      })
      setForm({
        nombre: data.nombre || '',
        apellido: data.apellido || '',
        direccion: data.direccion || '',
        aldea: data.aldea || '',
        telefono: (data.telefono || '').replace(/^\+\d+/, ''),
      })
      setDatosSoloLectura({
        email: data.email || '',
        cui: data.cui || '',
        fechaNacimiento: data.fechaNacimiento ? data.fechaNacimiento.split('T')[0] : '',
      })
    } catch (err) {
      setError('No se pudo cargar tu perfil.')
    } finally {
      setCargandoDatos(false)
    }
  }

  useEffect(() => {
    cargarPerfil()
    apiFetch('/api/aldeas').then(setAldeas).catch(() => setAldeas([]))
  }, [])

  function handleChange(e) {
    const { name, value } = e.target
    if (name === 'telefono') {
      setForm((p) => ({ ...p, telefono: value.replace(/\D/g, '').slice(0, 8) }))
      return
    }
    setForm((p) => ({ ...p, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setExito('')

    if (form.nombre.length > 40) return setError('El nombre no debe exceder 40 caracteres.')
    if (form.apellido.length > 40) return setError('El apellido no debe exceder 40 caracteres.')
    if (form.direccion.length > 60) return setError('La dirección no debe exceder 60 caracteres.')
    if (form.telefono.length < 8) return setError('El teléfono debe tener 8 dígitos.')

    setGuardando(true)
    try {
      const token = localStorage.getItem('token')
      await apiFetch('/api/auth/mi-perfil', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      })
      setExito('Tu perfil se actualizó correctamente.')
    } catch (err) {
      setError(traducirError(err.message) || 'No se pudo actualizar tu perfil.')
    } finally {
      setGuardando(false)
    }
  }

  const inputClass = 'w-full px-4 py-2.5 rounded-md border border-[var(--color-azul-piedra)]/30 bg-white text-[var(--color-tinta)] placeholder:text-[var(--color-azul-piedra)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-ocre)] transition-shadow'
  const inputSoloLecturaClass = 'w-full px-4 py-2.5 rounded-md border border-[var(--color-azul-piedra)]/20 bg-[var(--color-piedra)] text-[var(--color-tinta)]/60'
  const labelClass = 'block text-sm font-medium text-[var(--color-tinta)] mb-1.5'

  return (
    <div className="min-h-[calc(100vh-73px)] bg-[var(--color-piedra)]">
      <HeaderInterno titulo="Mi Perfil" />

      <main className="max-w-2xl mx-auto px-6 py-10">
        <button
          onClick={() => navigate('/vecino')}
          className="text-sm text-[var(--color-azul-piedra)] hover:text-[var(--color-ocre)] mb-6 transition-colors"
        >
          ← Volver a mi portal
        </button>

        {cargandoDatos ? (
          <p className="text-sm text-[var(--color-tinta)]/60">Cargando tu información...</p>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="bg-[var(--color-piedra-clara)] rounded-lg border border-[var(--color-azul-piedra)]/15 p-8 space-y-5">
            <h2 className="font-display text-xl font-semibold text-[var(--color-verde-institucional)] mb-1">
              Mis datos
            </h2>
            <p className="text-sm text-[var(--color-tinta)]/60 -mt-3">
              Puedes actualizar tu información de contacto. El DPI y el correo no se pueden modificar.
            </p>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Nombres</label>
                <input name="nombre" maxLength={40} value={form.nombre} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Apellidos</label>
                <input name="apellido" maxLength={40} value={form.apellido} onChange={handleChange} className={inputClass} />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Correo electrónico</label>
                <input value={datosSoloLectura.email} disabled className={inputSoloLecturaClass} />
              </div>
              <div>
                <label className={labelClass}>DPI</label>
                <input value={datosSoloLectura.cui} disabled className={inputSoloLecturaClass} />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Dirección</label>
                <input name="direccion" maxLength={60} value={form.direccion} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Aldea o comunidad</label>
                <select name="aldea" value={form.aldea} onChange={handleChange} className={inputClass}>
                  <option value="" disabled>Selecciona una opción</option>
                  {aldeas.map((a) => <option key={a.id} value={a.nombre}>{a.nombre}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className={labelClass}>Teléfono</label>
              <input name="telefono" inputMode="numeric" maxLength={8} value={form.telefono} onChange={handleChange} className={inputClass} />
            </div>

            {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">{error}</p>}

            <button
              type="submit"
              disabled={guardando}
              className="w-full py-2.5 rounded-md bg-[var(--color-ocre)] text-[var(--color-piedra-clara)] font-semibold hover:bg-[var(--color-ocre-claro)] transition-colors disabled:opacity-60"
            >
              {guardando ? 'Guardando...' : 'Guardar cambios'}
            </button>

            <button
              type="button"
              onClick={() => navigate('/cambiar-password')}
              className="w-full text-sm text-[var(--color-azul-piedra)] hover:text-[var(--color-ocre)] transition-colors"
            >
              ¿Quieres cambiar tu contraseña?
            </button>
          </form>
        )}
      </main>

      <ModalCargando visible={guardando} mensaje="Actualizando tu información..." />
      <ModalExito mensaje={exito} onCerrar={() => setExito('')} />
    </div>
  )
}