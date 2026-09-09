import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ClipboardList,
  RefreshCw,
  Eye,
  AlertCircle,
  CheckCircle2,
  Clock,
} from 'lucide-react'

import HeaderInterno from '../components/HeaderInterno'
import { apiFetch } from '../lib/api'

function obtenerClaseEstado(estado) {
  switch (estado) {
    case 'Asignada':
      return 'bg-blue-100 text-blue-800'

    case 'EnValidacion':
      return 'bg-amber-100 text-amber-800'

    case 'PendienteInformacion':
      return 'bg-orange-100 text-orange-800'

    case 'EnAnalisis':
      return 'bg-purple-100 text-purple-800'

    case 'AsignadaAOperario':
      return 'bg-indigo-100 text-indigo-800'

    case 'EnEjecucion':
      return 'bg-cyan-100 text-cyan-800'

    case 'TrabajoRealizado':
      return 'bg-teal-100 text-teal-800'

    case 'EnVerificacion':
      return 'bg-yellow-100 text-yellow-800'

    case 'Solucionada':
      return 'bg-green-100 text-green-800'

    case 'Reabierta':
      return 'bg-red-100 text-red-800'

    case 'Finalizada':
      return 'bg-emerald-100 text-emerald-800'

    case 'NoProcedente':
      return 'bg-gray-100 text-gray-800'

    default:
      return 'bg-gray-100 text-gray-800'
  }
}

function formatearFecha(fecha) {
  if (!fecha) return '-'

  return new Date(fecha).toLocaleDateString('es-GT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export default function Analista() {
  const [casos, setCasos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  async function cargarCasos() {
    try {
      setCargando(true)
      setError('')

      const token = localStorage.getItem('token')

      const data = await apiFetch('/api/Casos/mis-casos', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setCasos(data || [])
    } catch (err) {
      setError(err.message || 'No se pudieron cargar los casos.')
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargarCasos()
  }, [])

  return (
    <div className="min-h-[calc(100vh-73px)] bg-[var(--color-piedra)]">
      <HeaderInterno titulo="Panel del Analista" />

      <main className="max-w-6xl mx-auto px-6 py-10">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-2xl font-semibold text-[var(--color-verde-institucional)]">
              Casos asignados
            </h1>

            <p className="text-sm text-[var(--color-tinta)]/70 mt-1">
              Consulta y gestiona los casos que tienes asignados.
            </p>
          </div>

          <button
            onClick={cargarCasos}
            disabled={cargando}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md border border-[var(--color-verde-institucional)]/20 text-sm font-medium text-[var(--color-verde-institucional)] hover:bg-[var(--color-verde-institucional)]/5 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${cargando ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
        </div>

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
            <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />

            <div>
              <p className="font-medium">No se pudieron cargar los casos</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {cargando ? (
          <div className="bg-[var(--color-piedra-clara)] rounded-lg border border-[var(--color-azul-piedra)]/15 p-10 text-center">
            <RefreshCw className="h-7 w-7 animate-spin mx-auto text-[var(--color-verde-institucional)]" />

            <p className="text-sm text-[var(--color-tinta)]/60 mt-3">
              Cargando casos...
            </p>
          </div>
        ) : casos.length === 0 ? (
          <div className="bg-[var(--color-piedra-clara)] rounded-lg border border-[var(--color-azul-piedra)]/15 p-10 text-center">
            <ClipboardList className="h-10 w-10 mx-auto text-[var(--color-verde-institucional)]/50" />

            <h2 className="font-display text-lg font-semibold text-[var(--color-verde-institucional)] mt-4">
              No tienes casos asignados
            </h2>

            <p className="text-sm text-[var(--color-tinta)]/60 mt-1">
              Los casos que sean asignados a tu área aparecerán aquí.
            </p>
          </div>
        ) : (
          <div className="grid gap-5">
            {casos.map((caso) => (
              <div
                key={caso.id}
                className="bg-[var(--color-piedra-clara)] rounded-lg border border-[var(--color-azul-piedra)]/15 p-6"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-3">

                      <span className="font-display text-lg font-semibold text-[var(--color-verde-institucional)]">
                        {caso.codigo}
                      </span>

                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${obtenerClaseEstado(caso.estado)}`}
                      >
                        {caso.estado === 'EnAnalisis' ? (
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        ) : (
                          <Clock className="h-3.5 w-3.5" />
                        )}

                        {caso.estado}
                      </span>
                    </div>

                    <p className="text-sm font-medium text-[var(--color-tinta)]">
                      {caso.area}
                    </p>

                    <p className="text-sm text-[var(--color-tinta)]/60 mt-1">
                      {caso.aldea}
                    </p>

                    <p className="text-sm text-[var(--color-tinta)]/70 mt-3 line-clamp-2">
                      {caso.descripcion}
                    </p>

                    <p className="text-xs text-[var(--color-tinta)]/50 mt-3">
                      Registrado el {formatearFecha(caso.fechaRegistro)}
                    </p>
                  </div>

                  <Link
                    to={`/analista/casos/${caso.id}`}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-[var(--color-verde-institucional)] text-white text-sm font-medium hover:opacity-90 transition-opacity flex-shrink-0"
                  >
                    <Eye className="h-4 w-4" />
                    Ver detalle
                  </Link>

                </div>
              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  )
}