import { useState } from 'react'
import { Link } from 'react-router-dom'
import logoMuni from '../assets/logo-muni.png'

export default function Registro() {
  const [form, setForm] = useState({
    nombres: '',
    apellidos: '',
    fechaNacimiento: '',
    dpi: '',
    direccion: '',
    aldea: '',
    telefono: '',
    email: '',
    password: '',
    confirmarPassword: '',
    aceptaTerminos: false,
  })
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirmarPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }
    if (form.dpi.length !== 13) {
      setError('El DPI debe tener 13 dígitos.')
      return
    }
    if (!form.aceptaTerminos) {
      setError('Debes aceptar el tratamiento de datos personales para continuar.')
      return
    }

    setCargando(true)
    try {
      // Cuando el backend esté listo:
      // POST http://localhost:5241/api/auth/registro-vecino
      // const res = await fetch('http://localhost:5241/api/auth/registro-vecino', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     email: form.email,
      //     password: form.password,
      //     nombre: form.nombres,
      //     apellido: form.apellidos,
      //     cui: form.dpi,
      //   }),
      // })
      // if (!res.ok) throw new Error('No se pudo completar el registro')

      await new Promise((r) => setTimeout(r, 600)) // simulación temporal
      console.log('Registro simulado con', form)
    } catch (err) {
      setError('No se pudo completar el registro. Intenta de nuevo.')
    } finally {
      setCargando(false)
    }
  }

  const inputClass =
    'w-full px-4 py-2.5 rounded-md border border-[var(--color-azul-piedra)]/30 bg-white text-[var(--color-tinta)] placeholder:text-[var(--color-azul-piedra)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-ocre)] transition-shadow'
  const labelClass = 'block text-sm font-medium text-[var(--color-tinta)] mb-1.5'

// Placeholder: reemplaza por el listado real de aldeas/comunidades del municipio.
// Este catálogo, en el backend, debería administrarlo el rol Administrador (igual que Áreas),
// así se agrega/edita sin tocar código.
const aldeas = [
  'Casco urbano',
  'Aldea El Progreso',
  'Aldea San José',
  'Aldea Buena Vista',
  'Aldea La Esperanza',
  'Caserío Los Pinos',
  'Otra',
]


  return (
    <div className="min-h-[calc(100vh-73px)] flex items-center justify-center bg-[var(--color-piedra)] px-6 py-16">
      <div className="w-full max-w-2xl">
        <div className="bg-[var(--color-piedra-clara)] rounded-lg shadow-sm border border-[var(--color-azul-piedra)]/15 overflow-hidden">
          <div className="franja-textil" />

          <div className="p-8">
            <div className="flex flex-col items-center mb-8">
              <img src={logoMuni} alt="Logo de la municipalidad" className="h-16 w-16 mb-4" />
              <h1 className="font-display text-2xl font-semibold text-[var(--color-verde-institucional)]">
                Crear cuenta de vecino
              </h1>
              <p className="text-sm text-[var(--color-azul-piedra)] mt-1 text-center">
                Regístrate para reportar quejas, reclamos, denuncias y sugerencias
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="nombres" className={labelClass}>Nombres</label>
                  <input id="nombres" name="nombres" type="text" required
                    value={form.nombres} onChange={handleChange}
                    placeholder="Ej. María José" className={inputClass} />
                </div>
                <div>
                  <label htmlFor="apellidos" className={labelClass}>Apellidos</label>
                  <input id="apellidos" name="apellidos" type="text" required
                    value={form.apellidos} onChange={handleChange}
                    placeholder="Ej. García López" className={inputClass} />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="fechaNacimiento" className={labelClass}>Fecha de nacimiento</label>
                  <input id="fechaNacimiento" name="fechaNacimiento" type="date" required
                    value={form.fechaNacimiento} onChange={handleChange}
                    className={inputClass} />
                </div>
                <div>
                  <label htmlFor="dpi" className={labelClass}>DPI (13 dígitos)</label>
                  <input id="dpi" name="dpi" type="text" required
                    maxLength={13} pattern="[0-9]{13}"
                    value={form.dpi} onChange={handleChange}
                    placeholder="0000000000000" className={inputClass} />
                </div>
              </div>

       <div className="grid sm:grid-cols-2 gap-5">
  <div>
    <label htmlFor="direccion" className={labelClass}>Dirección</label>
    <input id="direccion" name="direccion" type="text" required
      value={form.direccion} onChange={handleChange}
      placeholder="Zona, colonia, calle..." className={inputClass} />
  </div>
  <div>
    <label htmlFor="aldea" className={labelClass}>Aldea o comunidad</label>
    <select id="aldea" name="aldea" required
      value={form.aldea} onChange={handleChange} className={inputClass}>
      <option value="" disabled>Selecciona una opción</option>
      {aldeas.map((a) => (
        <option key={a} value={a}>{a}</option>
      ))}
    </select>
  </div>
</div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="telefono" className={labelClass}>Teléfono</label>
                  <input id="telefono" name="telefono" type="tel" required
                    value={form.telefono} onChange={handleChange}
                    placeholder="0000-0000" className={inputClass} />
                </div>
                <div>
                  <label htmlFor="email" className={labelClass}>Correo electrónico</label>
                  <input id="email" name="email" type="email" required
                    value={form.email} onChange={handleChange}
                    placeholder="tucorreo@ejemplo.com" className={inputClass} />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="password" className={labelClass}>Contraseña</label>
                  <input id="password" name="password" type="password" required
                    value={form.password} onChange={handleChange}
                    placeholder="••••••••" className={inputClass} />
                </div>
                <div>
                  <label htmlFor="confirmarPassword" className={labelClass}>Confirmar contraseña</label>
                  <input id="confirmarPassword" name="confirmarPassword" type="password" required
                    value={form.confirmarPassword} onChange={handleChange}
                    placeholder="••••••••" className={inputClass} />
                </div>
              </div>

              <label className="flex items-start gap-2.5 text-sm text-[var(--color-tinta)]/80 cursor-pointer">
                <input
                  type="checkbox"
                  name="aceptaTerminos"
                  checked={form.aceptaTerminos}
                  onChange={handleChange}
                  className="mt-0.5 h-4 w-4 accent-[var(--color-ocre)]"
                />
                Acepto el tratamiento de mis datos personales conforme a la política de privacidad
                de la municipalidad, utilizados exclusivamente para la gestión de mis casos.
              </label>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={cargando}
                className="w-full py-2.5 rounded-md bg-[var(--color-ocre)] text-[var(--color-piedra-clara)] font-semibold hover:bg-[var(--color-ocre-claro)] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {cargando ? 'Creando cuenta...' : 'Crear cuenta'}
              </button>
            </form>

            <p className="text-center text-sm text-[var(--color-azul-piedra)] mt-6">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="text-[var(--color-ocre)] font-semibold hover:underline">
                Inicia sesión
              </Link>
            </p>

            <Link
              to="/"
              className="block text-center text-sm text-[var(--color-tinta)]/60 hover:text-[var(--color-tinta)] mt-4 transition-colors"
            >
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}