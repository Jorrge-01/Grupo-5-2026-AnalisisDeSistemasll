import { Link } from 'react-router-dom'
import { Users, LayoutGrid, MapPin, BarChart3 } from 'lucide-react'
import HeaderInterno from '../components/HeaderInterno'

export default function Admin() {
  return (
    <div className="min-h-[calc(100vh-73px)] bg-[var(--color-piedra)]">
      <HeaderInterno titulo="Panel de Administración" />

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-[var(--color-piedra-clara)] rounded-lg border border-[var(--color-azul-piedra)]/15 p-6">
            <div className="h-11 w-11 rounded-lg bg-[var(--color-verde-institucional)]/10 flex items-center justify-center mb-4">
              <Users className="h-5 w-5 text-[var(--color-verde-institucional)]" />
            </div>
            <p className="font-display text-lg font-semibold text-[var(--color-verde-institucional)] mb-1">
              Usuarios
            </p>
            <p className="text-sm text-[var(--color-tinta)]/70">
              Crear y administrar vecinos, analistas, empleados y administradores.
            </p>
          </div>

        <Link
  to="/admin/areas"
  className="bg-[var(--color-piedra-clara)] rounded-lg border border-[var(--color-azul-piedra)]/15 p-6 hover:border-[var(--color-ocre)]/40 transition-colors"
>
  <div className="h-11 w-11 rounded-lg bg-[var(--color-verde-institucional)]/10 flex items-center justify-center mb-4">
    <LayoutGrid className="h-5 w-5 text-[var(--color-verde-institucional)]" />
  </div>
  <p className="font-display text-lg font-semibold text-[var(--color-verde-institucional)] mb-1">
    Áreas y categorías
  </p>
  <p className="text-sm text-[var(--color-tinta)]/70">
    Administrar el catálogo de áreas municipales y su aplicabilidad.
  </p>
</Link>

          <Link
            to="/admin/aldeas"
            className="bg-[var(--color-piedra-clara)] rounded-lg border border-[var(--color-azul-piedra)]/15 p-6 hover:border-[var(--color-ocre)]/40 transition-colors"
          >
            <div className="h-11 w-11 rounded-lg bg-[var(--color-verde-institucional)]/10 flex items-center justify-center mb-4">
              <MapPin className="h-5 w-5 text-[var(--color-verde-institucional)]" />
            </div>
            <p className="font-display text-lg font-semibold text-[var(--color-verde-institucional)] mb-1">
              Aldeas y comunidades
            </p>
            <p className="text-sm text-[var(--color-tinta)]/70">
              Administrar el catálogo de aldeas y comunidades del municipio.
            </p>
          </Link>

          <Link
  to="/admin/reportes"
  className="bg-[var(--color-piedra-clara)] rounded-lg border border-[var(--color-azul-piedra)]/15 p-6 hover:border-[var(--color-ocre)]/40 transition-colors"
>
  <div className="h-11 w-11 rounded-lg bg-[var(--color-verde-institucional)]/10 flex items-center justify-center mb-4">
    <BarChart3 className="h-5 w-5 text-[var(--color-verde-institucional)]" />
  </div>
  <p className="font-display text-lg font-semibold text-[var(--color-verde-institucional)] mb-1">
    Reportes
  </p>
  <p className="text-sm text-[var(--color-tinta)]/70">
    Reportes de gestión, cumplimiento de SLA y auditoría.
  </p>
</Link>
        </div>

       
      </main>
    </div>
  )
}