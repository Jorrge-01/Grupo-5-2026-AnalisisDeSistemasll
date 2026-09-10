import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ClipboardList,
  RefreshCw,
  Eye,
  AlertCircle,
  Clock,
  CheckCircle2,
} from 'lucide-react'

import HeaderInterno from '../components/HeaderInterno'
import { apiFetch } from '../lib/api'

function obtenerClaseEstado(estado) {
  switch (estado) {
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

    default:
      return 'bg-gray-100 text-gray-800'
  }
}

function obtenerIconoEstado(estado) {
  switch (estado) {
    case 'TrabajoRealizado':
    case 'Solucionada':
    case 'Finalizada':
      return <CheckCircle2 className="h-4 w-4" />

    default:
      return <Clock className="h-4 w-4" />
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

export default function Empleado() {
  const [casos, setCasos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  async function cargarCasos() {
    try {
      setCargando(true)
      setError('')

      const token = localStorage.getItem('token')

      const data = await apiFetch('/api/Casos/mis-casos-operario', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setCasos(data || [])
    } catch (err) {
      setError(
        err.message || 'No se pudieron cargar los casos asignados.'
      )
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargarCasos()
  }, [])

  return (
    <div className="min-h-[calc(100vh-73px)] bg-[var(--color-piedra)]">
      <HeaderInterno titulo="Panel del Operario" />

      <main className="max-w-6xl mx-auto px-6 py-10">

        {/* ENCABEZADO */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

          <div>
            <h1 className="font-display text-3xl font-semibold text-[var(--color-verde-institucional)]">
              Mis casos asignados
            </h1>

            <p className="text-sm text-[var(--color-tinta)]/60 mt-2">
              Consulta los casos que tienes asignados para su atención.
            </p>
          </div>

          <button
            type="button"
            onClick={cargarCasos}
            disabled={cargando}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md border border-[var(--color-verde-institucional)]/25 text-[var(--color-verde-institucional)] text-sm font-medium hover:bg-[var(--color-verde-institucional)]/5 transition-colors disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 ${cargando ? 'animate-spin' : ''}`}
            />

            Actualizar
          </button>

        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-5 text-red-800">

            <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />

            <div>
              <p className="font-medium">
                No se pudieron cargar los casos
              </p>

              <p className="text-sm mt-1">
                {error}
              </p>
            </div>

          </div>
        )}

        {/* CARGANDO */}
        {cargando && (
          <div className="bg-[var(--color-piedra-clara)] rounded-lg border border-[var(--color-azul-piedra)]/15 p-10 text-center">

            <RefreshCw className="h-7 w-7 animate-spin mx-auto text-[var(--color-verde-institucional)]" />

            <p className="text-sm text-[var(--color-tinta)]/60 mt-3">
              Cargando casos asignados...
            </p>

          </div>
        )}

        {/* SIN CASOS */}
        {!cargando && !error && casos.length === 0 && (
          <div className="bg-[var(--color-piedra-clara)] rounded-lg border border-[var(--color-azul-piedra)]/15 p-10 text-center">

            <ClipboardList className="h-10 w-10 mx-auto text-[var(--color-tinta)]/30" />

            <h2 className="font-display text-xl font-semibold text-[var(--color-verde-institucional)] mt-4">
              No tienes casos asignados
            </h2>

            <p className="text-sm text-[var(--color-tinta)]/60 mt-2">
              Cuando se te asigne un caso, aparecerá en esta sección.
            </p>

          </div>
        )}

        {/* LISTADO */}
        {!cargando && !error && casos.length > 0 && (
          <div className="space-y-4">

            {casos.map((caso) => (
              <div
                key={caso.id}
                className="bg-[var(--color-piedra-clara)] rounded-lg border border-[var(--color-azul-piedra)]/15 p-5"
              >

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                  {/* INFORMACIÓN */}
                  <div className="min-w-0">

                    <div className="flex flex-wrap items-center gap-3">

                      <h2 className="font-display text-xl font-semibold text-[var(--color-verde-institucional)]">
                        {caso.codigo}
                      </h2>

                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${obtenerClaseEstado(caso.estado)}`}
                      >
                        {obtenerIconoEstado(caso.estado)}

                        {caso.estado}
                      </span>

                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 mt-4">

                      <div>
                        <p className="text-xs uppercase tracking-wide text-[var(--color-tinta)]/45">
                          Área
                        </p>

                        <p className="text-sm text-[var(--color-tinta)] mt-1">
                          {caso.area || '-'}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-wide text-[var(--color-tinta)]/45">
                          Aldea
                        </p>

                        <p className="text-sm text-[var(--color-tinta)] mt-1">
                          {caso.aldea || '-'}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-wide text-[var(--color-tinta)]/45">
                          Dirección
                        </p>

                        <p className="text-sm text-[var(--color-tinta)] mt-1">
                          {caso.direccion || '-'}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-wide text-[var(--color-tinta)]/45">
                          Fecha de registro
                        </p>

                        <p className="text-sm text-[var(--color-tinta)] mt-1">
                          {formatearFecha(caso.fechaRegistro)}
                        </p>
                      </div>

                    </div>

                    <div className="mt-4">

                      <p className="text-xs uppercase tracking-wide text-[var(--color-tinta)]/45">
                        Descripción
                      </p>

                      <p className="text-sm text-[var(--color-tinta)] mt-1 line-clamp-2">
                        {caso.descripcion || '-'}
                      </p>

                    </div>

                  </div>

                  {/* ACCIÓN */}
                  <div className="flex-shrink-0">

                    <Link
                      to={`/empleado/casos/${caso.id}`}
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-md bg-[var(--color-verde-institucional)] text-white text-sm font-medium hover:opacity-90 transition-opacity"
                    >
                      <Eye className="h-4 w-4" />

                      Ver detalle
                    </Link>

                  </div>

                </div>

              </div>
            ))}

          </div>
        )}

      </main>
    </div>
  )
}