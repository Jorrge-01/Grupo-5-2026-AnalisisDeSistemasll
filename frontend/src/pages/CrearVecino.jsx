import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import HeaderInterno from '../components/HeaderInterno'
import { apiFetch } from '../lib/api'
import { traducirError } from '../lib/traducirError'
import PasswordChecklist, { passwordEsValida } from '../components/PasswordChecklist'
import EmailChecklist, { emailEsValido } from '../components/EmailChecklist'

export default function CrearVecino() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    nombres: '', apellidos: '', fechaNacimiento: '', dpi: '',
    direccion: '', aldea: '', telefono: '', codigoPais: '+502',
    email: '', password: '', confirmarPassword: '',
  })
  const [aldeas, setAldeas] = useState([])
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')
  const [exito, setExito] = useState('')

  const hoy = new Date().toISOString().split('T')[0]
  const fechaMaximaMayorEdad = (() => {
    const f = new Date()
    f.setFullYear(f.getFullYear() - 18)
    return f.toISOString().split('T')[0]
  })()

  useEffect(() => {
    apiFetch('/api/aldeas').then(setAldeas).catch(() => setAldeas([]))
  }, [])

  function handleChange(e) {
    const { name, value } = e.target

    if (name === 'codigoPais') {
      setForm((p) => ({ ...p, codigoPais: value.replace(/[^\d+]/g, '').slice(0, 4) }))
      return
    }
    if (name === 'telefono') {
      setForm((p) => ({ ...p, telefono: value.replace(/\D/g, '').slice(0, 8) }))
      return
    }
    if (name === 'dpi') {
      setForm((p) => ({ ...p, dpi: value.replace(/\D/g, '').slice(0, 13) }))
      return
    }
    setForm((p) => ({ ...p, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setExito('')

    if (!form.fechaNacimiento) return setError('Debes indicar la fecha de nacimiento.')
    if (form.fechaNacimiento > fechaMaximaMayorEdad) return setError('El vecino debe ser mayor de edad.')
    if (form.dpi.length !== 13) return setError('El DPI debe tener 13 dígitos.')
    if (form.dpi.slice(-4) !== '0110') return setError('El DPI no corresponde a este municipio.')
    if (form.telefono.length < 8) return setError('El teléfono debe tener 8 dígitos.')
    if (!emailEsValido(form.email)) return setError('Ingresa un correo electrónico válido.')
    if (!passwordEsValida(form.password)) return setError('La contraseña no cumple con los requisitos de seguridad.')
    if (form.password !== form.confirmarPassword) return setError('Las contraseñas no coinciden.')
    if (form.nombres.length > 40) return setError('El nombre no debe exceder 40 caracteres.')
    if (form.apellidos.length > 40) return setError('El apellido no debe exceder 40 caracteres.')
    if (form.direccion.length > 60) return setError('La dirección no debe exceder 60 caracteres.')

    setCargando(true)
    try {
      const token = localStorage.getItem('token')
      await apiFetch('/api/auth/registro-usuario', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          nombre: form.nombres,
          apellido: form.apellidos,
          rol: 'Vecino',
          cui: form.dpi,
          direccion: form.direccion,
          aldea: form.aldea,
          telefono: `${form.codigoPais}${form.telefono}`,
          fechaNacimiento: form.fechaNacimiento,
          areaIds: null,
          cargo: null,
        }),
      })
      setExito('Vecino registrado correctamente.')
      setForm({
        nombres: '', apellidos: '', fechaNacimiento: '', dpi: '',
        direccion: '', aldea: '', telefono: '', codigoPais: '+502',
        email: '', password: '', confirmarPassword: '',
      })
    } catch (err) {
      setError(traducirError(err.message) || 'No se pudo registrar al vecino.')
    } finally {
      setCargando(false)
    }
  }

  const inputClass = 'w-full px-4 py-2.5 rounded-md border border-[var(--color-azul-piedra)]/30 bg-white text-[var(--color-tinta)] placeholder:text-[var(--color-azul-piedra)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-ocre)] transition-shadow'
  const labelClass = 'block text-sm font-medium text-[var(--color-tinta)] mb-1.5'

  return (
    <div className="min-h-[calc(100vh-73px)] bg-[var(--color-piedra)]">
      <HeaderInterno titulo="Registrar Vecino" />

      <main className="max-w-2xl mx-auto px-6 py-10">
        <button onClick={() => navigate('/admin/usuarios')} className="text-sm text-[var(--color-azul-piedra)] hover:text-[var(--color-ocre)] mb-6 transition-colors">
          ← Volver a usuarios
        </button>

        <form onSubmit={handleSubmit} noValidate className="bg-[var(--color-piedra-clara)] rounded-lg border border-[var(--color-azul-piedra)]/15 p-8 space-y-5">
          <h2 className="font-display text-xl font-semibold text-[var(--color-verde-institucional)] mb-2">
            Datos del vecino
          </h2>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Nombres</label>
              <input name="nombres" maxLength={40} value={form.nombres} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Apellidos</label>
              <input name="apellidos" maxLength={40} value={form.apellidos} onChange={handleChange} className={inputClass} />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Fecha de nacimiento</label>
              <input name="fechaNacimiento" type="date" max={fechaMaximaMayorEdad} value={form.fechaNacimiento} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>DPI (13 dígitos)</label>
              <input name="dpi" inputMode="numeric" maxLength={13} value={form.dpi} onChange={handleChange} className={inputClass} />
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

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Teléfono</label>
              <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr', gap: '12px' }}>
                <input name="codigoPais" value={form.codigoPais} onChange={handleChange}
                  style={{ width: '100%', boxSizing: 'border-box', padding: '10px 8px', textAlign: 'center', borderRadius: '6px', border: '1px solid #94A3B8', outline: 'none' }} />
                <input name="telefono" inputMode="numeric" maxLength={8} value={form.telefono} onChange={handleChange}
                  style={{ width: '100%', boxSizing: 'border-box', padding: '10px 16px', borderRadius: '6px', border: '1px solid #94A3B8', outline: 'none' }} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Correo electrónico</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} className={inputClass} />
              <EmailChecklist email={form.email} />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Contraseña</label>
              <input name="password" type="password" maxLength={25} value={form.password} onChange={handleChange} className={inputClass} />
              <PasswordChecklist password={form.password} />
            </div>
            <div>
              <label className={labelClass}>Confirmar contraseña</label>
              <input name="confirmarPassword" type="password" maxLength={25} value={form.confirmarPassword} onChange={handleChange} className={inputClass} />
            </div>
          </div>

          {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">{error}</p>}
          {exito && <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-md px-3 py-2">{exito}</p>}

          <button type="submit" disabled={cargando}
            className="w-full py-2.5 rounded-md bg-[var(--color-ocre)] text-[var(--color-piedra-clara)] font-semibold hover:bg-[var(--color-ocre-claro)] transition-colors disabled:opacity-60">
            {cargando ? 'Registrando...' : 'Registrar vecino'}
          </button>
        </form>
      </main>
    </div>
  )
}