import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import logoMuni from '../assets/logo-muni.png'
import { apiFetch } from '../lib/api'
import { traducirError } from '../lib/traducirError'
import PasswordChecklist, { passwordEsValida } from '../components/PasswordChecklist'

export default function CambiarPassword() {
  const location = useLocation()
  const navigate = useNavigate()
  const emailPrellenado = location.state?.email || ''

  const [email, setEmail] = useState(emailPrellenado)
  const [passwordActual, setPasswordActual] = useState('')
  const [passwordNueva, setPasswordNueva] = useState('')
  const [confirmarPasswordNueva, setConfirmarPasswordNueva] = useState('')
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!passwordActual) {
      setError('Ingresa tu contraseña temporal.')
      return
    }
    if (!passwordEsValida(passwordNueva)) {
      setError('La nueva contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.')
      return
    }
    if (passwordNueva !== confirmarPasswordNueva) {
      setError('Las contraseñas no coinciden.')
      return
    }

    setCargando(true)
    try {
      await apiFetch('/api/auth/cambiar-password', {
        method: 'POST',
        body: JSON.stringify({
          email,
          passwordActual,
          passwordNueva,
          confirmarPasswordNueva,
        }),
      })

      navigate('/login')
    } catch (err) {
      setError(traducirError(err.message) || 'No se pudo cambiar la contraseña. Intenta de nuevo.')
    } finally {
      setCargando(false)
    }
  }

  const inputClass =
    'w-full px-4 py-2.5 rounded-md border border-[var(--color-azul-piedra)]/30 bg-white text-[var(--color-tinta)] placeholder:text-[var(--color-azul-piedra)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-ocre)] transition-shadow'
  const labelClass = 'block text-sm font-medium text-[var(--color-tinta)] mb-1.5'

  return (
    <div className="min-h-[calc(100vh-73px)] flex items-center justify-center bg-[var(--color-piedra)] px-6 py-16">
      <div className="w-full max-w-md">
        <div className="bg-[var(--color-piedra-clara)] rounded-lg shadow-sm border border-[var(--color-azul-piedra)]/15 overflow-hidden">
          <div className="franja-textil" />

          <div className="p-8">
            <div className="flex flex-col items-center mb-8">
              <img src={logoMuni} alt="Logo de la municipalidad" className="h-16 w-16 mb-4" />
              <h1 className="font-display text-2xl font-semibold text-[var(--color-verde-institucional)]">
                Cambiar contraseña
              </h1>
              <p className="text-sm text-[var(--color-azul-piedra)] mt-1 text-center">
                Por seguridad, debes establecer una nueva contraseña
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {!emailPrellenado && (
                <div>
                  <label htmlFor="email" className={labelClass}>Correo electrónico</label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tucorreo@ejemplo.com"
                    className={inputClass}
                  />
                </div>
              )}

              <div>
                <label htmlFor="passwordActual" className={labelClass}>Contraseña temporal</label>
                <input
                  id="passwordActual"
                  type="password"
                  required
                  value={passwordActual}
                  onChange={(e) => setPasswordActual(e.target.value)}
                  placeholder="La que recibiste por correo"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="passwordNueva" className={labelClass}>Nueva contraseña</label>
                <input
                  id="passwordNueva"
                  type="password"
                  required
                  value={passwordNueva}
                  onChange={(e) => setPasswordNueva(e.target.value)}
                  placeholder="••••••••"
                  className={inputClass}
                />
                <PasswordChecklist password={passwordNueva} />
              </div>

              <div>
                <label htmlFor="confirmarPasswordNueva" className={labelClass}>Confirmar nueva contraseña</label>
                <input
                  id="confirmarPasswordNueva"
                  type="password"
                  required
                  value={confirmarPasswordNueva}
                  onChange={(e) => setConfirmarPasswordNueva(e.target.value)}
                  placeholder="••••••••"
                  className={inputClass}
                />
              </div>

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
                {cargando ? 'Guardando...' : 'Cambiar contraseña'}
              </button>
            </form>

            <Link
              to="/login"
              className="block text-center text-sm text-[var(--color-tinta)]/60 hover:text-[var(--color-tinta)] mt-6 transition-colors"
            >
              ← Volver a iniciar sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}