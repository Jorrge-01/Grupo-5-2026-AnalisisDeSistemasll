import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  AlertCircle,
  RefreshCw,
  MessageSquare,
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

export default function DetalleCasoAnalista() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [caso, setCaso] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [procesando, setProcesando] = useState(false)
  const [mensaje, setMensaje] = useState('')

  async function cargarDetalle() {
    try {
      setCargando(true)
      setError('')

      const token = localStorage.getItem('token')

      const data = await apiFetch(`/api/Casos/${id}/detalle`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setCaso(data)
    } catch (err) {
      setError(
        err.message || 'No se pudo cargar el detalle del caso.'
      )
    } finally {
      setCargando(false)
    }
  }

  async function validarCaso() {
    try {
      setProcesando(true)
      setError('')
      setMensaje('')

      const token = localStorage.getItem('token')

      const data = await apiFetch(`/api/Casos/${id}/validar`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setMensaje(data.mensaje)

      await cargarDetalle()
    } catch (err) {
      setError(err.message || 'No se pudo validar el caso.')
    } finally {
      setProcesando(false)
    }
  }

  useEffect(() => {
    cargarDetalle()
  }, [id])

  if (cargando) {
    return (
      <div className="min-h-[calc(100vh-73px)] bg-[var(--color-piedra)]">
        <HeaderInterno titulo="Detalle del caso" />

        <main className="max-w-5xl mx-auto px-6 py-10">
          <div className="bg-[var(--color-piedra-clara)] rounded-lg border border-[var(--color-azul-piedra)]/15 p-10 text-center">
            <RefreshCw className="h-7 w-7 animate-spin mx-auto text-[var(--color-verde-institucional)]" />

            <p className="text-sm text-[var(--color-tinta)]/60 mt-3">
              Cargando información del caso...
            </p>
          </div>
        </main>
      </div>
    )
  }

  if (error || !caso) {
    return (
      <div className="min-h-[calc(100vh-73px)] bg-[var(--color-piedra)]">
        <HeaderInterno titulo="Detalle del caso" />

        <main className="max-w-5xl mx-auto px-6 py-10">
          <button
            onClick={() => navigate('/analista')}
            className="inline-flex items-center gap-2 text-sm text-[var(--color-verde-institucional)] hover:underline mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a mis casos
          </button>

          <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-5 text-red-800">
            <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />

            <div>
              <p className="font-medium">
                No se pudo cargar el caso
              </p>

              <p className="text-sm mt-1">
                {error ||
                  'El caso no existe o no está asignado a este analista.'}
              </p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-73px)] bg-[var(--color-piedra)]">
      <HeaderInterno titulo="Detalle del caso" />

      <main className="max-w-5xl mx-auto px-6 py-10">
        <Link
          to="/analista"
          className="inline-flex items-center gap-2 text-sm text-[var(--color-verde-institucional)] hover:underline mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a mis casos
        </Link>

        <div className="bg-[var(--color-piedra-clara)] rounded-lg border border-[var(--color-azul-piedra)]/15 overflow-hidden">

          {/* ENCABEZADO */}
          <div className="p-6 border-b border-[var(--color-azul-piedra)]/10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

              <div>
                <p className="text-sm text-[var(--color-tinta)]/60">
                  Caso
                </p>

                <h1 className="font-display text-3xl font-semibold text-[var(--color-verde-institucional)] mt-1">
                  {caso.codigo}
                </h1>
              </div>

              <span
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium self-start sm:self-auto ${obtenerClaseEstado(caso.estado)}`}
              >
                {caso.estado === 'EnAnalisis' ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <Clock className="h-4 w-4" />
                )}

                {caso.estado}
              </span>

            </div>
          </div>

          {/* INFORMACIÓN DEL CASO */}
          <div className="p-6">

            <h2 className="font-display text-xl font-semibold text-[var(--color-verde-institucional)] mb-5">
              Información del caso
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-tinta)]/50">
                  Área
                </p>

                <p className="text-sm text-[var(--color-tinta)] mt-1">
                  {caso.area || '-'}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-tinta)]/50">
                  Aldea
                </p>

                <p className="text-sm text-[var(--color-tinta)] mt-1">
                  {caso.aldea || '-'}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-tinta)]/50">
                  Dirección
                </p>

                <p className="text-sm text-[var(--color-tinta)] mt-1">
                  {caso.direccion || '-'}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-tinta)]/50">
                  Teléfono de contacto
                </p>

                <p className="text-sm text-[var(--color-tinta)] mt-1">
                  {caso.telefonoContacto || '-'}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-tinta)]/50">
                  Fecha de registro
                </p>

                <p className="text-sm text-[var(--color-tinta)] mt-1">
                  {formatearFecha(caso.fechaRegistro)}
                </p>
              </div>

            </div>

            {/* DESCRIPCIÓN */}
            <div className="mt-8">

              <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-tinta)]/50">
                Descripción del caso
              </p>

              <div className="mt-2 rounded-lg border border-[var(--color-azul-piedra)]/10 bg-white/50 p-4">
                <p className="text-sm leading-6 text-[var(--color-tinta)] whitespace-pre-wrap">
                  {caso.descripcion || '-'}
                </p>
              </div>

            </div>

          </div>

          {/* ACCIONES */}
          <div className="border-t border-[var(--color-azul-piedra)]/10 p-6">

            <h2 className="font-display text-xl font-semibold text-[var(--color-verde-institucional)] mb-2">
              Acciones
            </h2>

            <p className="text-sm text-[var(--color-tinta)]/60 mb-5">
              Las acciones disponibles dependerán del estado actual del caso.
            </p>

            {/* MENSAJE DE ÉXITO */}
            {mensaje && (
              <div className="mb-5 rounded-lg border border-green-200 bg-green-50 p-4 text-green-800">
                <div className="flex items-start gap-3">

                  <CheckCircle2 className="h-5 w-5 mt-0.5 flex-shrink-0" />

                  <div>
                    <p className="font-medium">
                      Operación realizada
                    </p>

                    <p className="text-sm mt-1">
                      {mensaje}
                    </p>
                  </div>

                </div>
              </div>
            )}

            {/* MENSAJE DE ERROR */}
            {error && (
              <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
                <div className="flex items-start gap-3">

                  <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />

                  <div>
                    <p className="font-medium">
                      No se pudo realizar la operación
                    </p>

                    <p className="text-sm mt-1">
                      {error}
                    </p>
                  </div>

                </div>
              </div>
            )}

            {/* CASO ASIGNADO */}
            {caso.estado === 'Asignada' && (
              <div className="flex flex-col sm:flex-row gap-3">

                <button
                  type="button"
                  onClick={validarCaso}
                  disabled={procesando}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-md bg-[var(--color-verde-institucional)] text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  <CheckCircle2 className="h-4 w-4" />

                  {procesando
                    ? 'Validando...'
                    : 'Validar caso'}
                </button>

                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-md border border-[var(--color-verde-institucional)]/25 text-[var(--color-verde-institucional)] text-sm font-medium hover:bg-[var(--color-verde-institucional)]/5 transition-colors"
                >
                  <MessageSquare className="h-4 w-4" />

                  Solicitar información
                </button>

              </div>
            )}

            {/* CASO EN VALIDACIÓN */}
            {caso.estado === 'EnValidacion' && (
              <button
                type="button"
                onClick={validarCaso}
                disabled={procesando}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-md bg-[var(--color-verde-institucional)] text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                <CheckCircle2 className="h-4 w-4" />

                {procesando
                  ? 'Validando...'
                  : 'Validar nuevamente'}
              </button>
            )}

            {/* PENDIENTE DE INFORMACIÓN */}
            {caso.estado === 'PendienteInformacion' && (
              <div className="rounded-lg border border-orange-200 bg-orange-50 p-4 text-orange-800">

                <div className="flex items-start gap-3">

                  <Clock className="h-5 w-5 mt-0.5 flex-shrink-0" />

                  <div>
                    <p className="font-medium">
                      Esperando información del vecino
                    </p>

                    <p className="text-sm mt-1">
                      El caso permanecerá en este estado hasta que el vecino responda la solicitud de información.
                    </p>
                  </div>

                </div>

              </div>
            )}

            {/* EN ANÁLISIS */}
            {caso.estado === 'EnAnalisis' && (
              <div className="rounded-lg border border-purple-200 bg-purple-50 p-4 text-purple-800">

                <div className="flex items-start gap-3">

                  <CheckCircle2 className="h-5 w-5 mt-0.5 flex-shrink-0" />

                  <div>
                    <p className="font-medium">
                      Caso en análisis
                    </p>

                    <p className="text-sm mt-1">
                      El caso fue validado y se encuentra en la etapa de análisis.
                    </p>
                  </div>

                </div>

              </div>
            )}

          </div>

        </div>

      </main>
    </div>
  )
}