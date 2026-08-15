import { useNavigate } from 'react-router-dom'
import logoMuni from '../assets/logo-muni.png'

export default function Vecino() {
  const navigate = useNavigate()
  const nombre = localStorage.getItem('nombre') || 'Vecino'

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('nombre')
    localStorage.removeItem('roles')
    navigate('/login')
  }

  return (
    <div className="min-h-[calc(100vh-73px)] bg-[var(--color-piedra)]">
      <header className="bg-[var(--color-verde-institucional)] text-[var(--color-piedra-clara)]">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logoMuni} alt="Logo de la municipalidad" className="h-10 w-10" />
            <div>
              <p className="font-display text-lg font-semibold">Mi Portal</p>
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

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="bg-[var(--color-piedra-clara)] rounded-lg border border-[var(--color-azul-piedra)]/15 p-6">
            <p className="font-display text-lg font-semibold text-[var(--color-verde-institucional)] mb-1">
              Registrar un caso
            </p>
            <p className="text-sm text-[var(--color-tinta)]/70">
              Reporta una queja, reclamo, denuncia o sugerencia.
            </p>
          </div>
          <div className="bg-[var(--color-piedra-clara)] rounded-lg border border-[var(--color-azul-piedra)]/15 p-6">
            <p className="font-display text-lg font-semibold text-[var(--color-verde-institucional)] mb-1">
              Mis casos
            </p>
            <p className="text-sm text-[var(--color-tinta)]/70">
              Da seguimiento al estado de tus casos registrados.
            </p>
          </div>
        </div>

        <p className="text-sm text-[var(--color-tinta)]/50 mt-8">
          Esta es una pantalla base — cada tarjeta se convertirá en su propia sección cuando
          construyamos el módulo de casos.
        </p>
      </main>
    </div>
  )
}