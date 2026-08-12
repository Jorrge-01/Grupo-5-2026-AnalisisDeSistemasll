import { useNavigate } from 'react-router-dom'
import logoMuni from '../assets/logo-muni.png'

export default function Admin() {
  const navigate = useNavigate()
  const nombre = localStorage.getItem('nombre') || 'Administrador'

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
              <p className="font-display text-lg font-semibold">Panel de Administración</p>
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
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-[var(--color-piedra-clara)] rounded-lg border border-[var(--color-azul-piedra)]/15 p-6">
            <p className="font-display text-lg font-semibold text-[var(--color-verde-institucional)] mb-1">
              Usuarios
            </p>
            <p className="text-sm text-[var(--color-tinta)]/70">
              Crear y administrar vecinos, analistas, empleados y administradores.
            </p>
          </div>
          <div className="bg-[var(--color-piedra-clara)] rounded-lg border border-[var(--color-azul-piedra)]/15 p-6">
            <p className="font-display text-lg font-semibold text-[var(--color-verde-institucional)] mb-1">
              Áreas y categorías
            </p>
            <p className="text-sm text-[var(--color-tinta)]/70">
              Administrar el catálogo de áreas municipales y su aplicabilidad.
            </p>
          </div>
          <div className="bg-[var(--color-piedra-clara)] rounded-lg border border-[var(--color-azul-piedra)]/15 p-6">
            <p className="font-display text-lg font-semibold text-[var(--color-verde-institucional)] mb-1">
              Reportes
            </p>
            <p className="text-sm text-[var(--color-tinta)]/70">
              Reportes de gestión, cumplimiento de SLA y auditoría.
            </p>
          </div>
        </div>

        <p className="text-sm text-[var(--color-tinta)]/50 mt-8">
          Esta es una pantalla base — cada tarjeta se convertirá en su propia sección cuando
          construyamos esos módulos.
        </p>
      </main>
    </div>
  )
}