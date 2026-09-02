import { useNavigate } from 'react-router-dom'
import logoMuni from '../assets/logo-muni.png'
import { apiFetch } from '../lib/api'
export default function HeaderInterno({ titulo }) {
  const navigate = useNavigate()
  const nombre = localStorage.getItem('nombre') || 'Usuario'

 async function handleLogout() {
  try {
    const token = localStorage.getItem('token')
    await apiFetch('/api/auth/logout', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    })
  } catch (err) {
    console.error('Error al registrar logout:', err) // ← temporal, para depurar
  }
  localStorage.removeItem('token')
  localStorage.removeItem('nombre')
  localStorage.removeItem('roles')
  navigate('/login')
}
  return (
    <>
      <header className="bg-[var(--color-verde-institucional)] text-[var(--color-piedra-clara)]">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-white p-1.5 flex items-center justify-center flex-shrink-0">
              <img src={logoMuni} alt="Logo de la municipalidad" className="h-full w-full object-contain" />
            </div>
            <div>
              <p className="font-display text-lg font-semibold">{titulo}</p>
              <p className="text-sm text-[var(--color-piedra-clara)]/70">Bienvenido, {nombre}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-md border border-[var(--color-piedra-clara)]/30 text-sm font-medium hover:bg-[var(--color-piedra-clara)]/10 transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </header>
      <div className="franja-textil" />
    </>
  )
}