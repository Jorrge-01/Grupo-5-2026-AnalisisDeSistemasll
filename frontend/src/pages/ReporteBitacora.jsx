import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import HeaderInterno from '../components/HeaderInterno'
import { apiFetch } from '../lib/api'

const TAMANO_PAGINA = 25

export default function ReporteBitacora() {
  const navigate = useNavigate()

  const [registros, setRegistros] = useState([])
  const [total, setTotal] = useState(0)
  const [pagina, setPagina] = useState(1)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  const [entidades, setEntidades] = useState([])
  const [filtroEntidad, setFiltroEntidad] = useState('')
  const [filtroAccion, setFiltroAccion] = useState('')
  const [filtroDesde, setFiltroDesde] = useState('')
  const [filtroHasta, setFiltroHasta] = useState('')

  const acciones = ['Added', 'Modified', 'Deleted', 'Login']

  async function cargarEntidades() {
    try {
      const data = await apiFetch('/api/bitacora/entidades', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      setEntidades(data)
    } catch (err) {
      // silencioso, solo afecta el filtro
    }
  }

  async function cargar() {
    setCargando(true)
    setError('')
    try {
      const params = new URLSearchParams({
        pagina: pagina.toString(),
        tamano: TAMANO_PAGINA.toString(),
      })
      if (filtroEntidad) params.append('entidad', filtroEntidad)
      if (filtroAccion) params.append('accion', filtroAccion)
      if (filtroDesde) params.append('desde', filtroDesde)
      if (filtroHasta) params.append('hasta', filtroHasta)

      const data = await apiFetch(`/api/bitacora?${params.toString()}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      setRegistros(data.registros)
      setTotal(data.total)
    } catch (err) {
      setError('No se pudo cargar la bitácora.')
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargarEntidades()
  }, [])

  useEffect(() => {
    cargar()
  }, [pagina])

  function handleFiltrar(e) {
    e.preventDefault()
    setPagina(1)
    cargar()
  }

  function handleLimpiar() {
    setFiltroEntidad('')
    setFiltroAccion('')
    setFiltroDesde('')
    setFiltroHasta('')
    setPagina(1)
    setTimeout(cargar, 0)
  }

  function handleExportarCsv() {
    const encabezados = ['Fecha', 'Usuario', 'Acción', 'Entidad', 'ID Entidad', 'IP', 'Detalle']
    const filas = registros.map((r) => [
      new Date(r.fecha).toLocaleString('es-GT'),
      r.userId || '',
      r.accion,
      r.entidad,
      r.entidadId || '',
      r.ip || '',
      (r.detalle || '').replace(/"/g, "'"),
    ])

    const csv = [encabezados, ...filas]
      .map((fila) => fila.map((c) => `"${c}"`).join(','))
      .join('\n')

    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `bitacora_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  const totalPaginas = Math.ceil(total / TAMANO_PAGINA)
  const inputClass =
    'w-full px-3 py-2 rounded-md border border-[var(--color-azul-piedra)]/30 bg-white text-[var(--color-tinta)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-ocre)]'

  return (
    <div className="min-h-[calc(100vh-73px)] bg-[var(--color-piedra)]">
      <HeaderInterno titulo="Reporte de Auditoría — Bitácora" />

      <main className="max-w-6xl mx-auto px-6 py-10">
        <button
          onClick={() => navigate('/admin/reportes')}
          className="text-sm text-[var(--color-azul-piedra)] hover:text-[var(--color-ocre)] mb-6 transition-colors"
        >
          ← Volver a reportes
        </button>

        <form onSubmit={handleFiltrar} className="bg-[var(--color-piedra-clara)] rounded-lg border border-[var(--color-azul-piedra)]/15 p-6 mb-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
            <div>
              <label className="block text-xs font-medium text-[var(--color-tinta)]/70 mb-1">Entidad</label>
              <select value={filtroEntidad} onChange={(e) => setFiltroEntidad(e.target.value)} className={inputClass}>
                <option value="">Todas</option>
                {entidades.map((e) => (
                  <option key={e} value={e}>{e}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--color-tinta)]/70 mb-1">Acción</label>
              <select value={filtroAccion} onChange={(e) => setFiltroAccion(e.target.value)} className={inputClass}>
                <option value="">Todas</option>
                {acciones.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--color-tinta)]/70 mb-1">Desde</label>
              <input type="date" value={filtroDesde} onChange={(e) => setFiltroDesde(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--color-tinta)]/70 mb-1">Hasta</label>
              <input type="date" value={filtroHasta} onChange={(e) => setFiltroHasta(e.target.value)} className={inputClass} />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="flex-1 py-2 rounded-md bg-[var(--color-ocre)] text-white text-sm font-semibold hover:bg-[var(--color-ocre-claro)] transition-colors">
                Filtrar
              </button>
              <button type="button" onClick={handleLimpiar} className="flex-1 py-2 rounded-md border border-[var(--color-azul-piedra)]/30 text-sm text-[var(--color-tinta)]/70 hover:bg-[var(--color-piedra)] transition-colors">
                Limpiar
              </button>
            </div>
          </div>
        </form>

        <div className="flex items-center justify-between mb-3">
          <p className="text-sm text-[var(--color-tinta)]/60">
            {total} {total === 1 ? 'registro' : 'registros'} encontrados
          </p>
          <button
            onClick={handleExportarCsv}
            disabled={registros.length === 0}
            className="text-sm px-4 py-2 rounded-md border border-[var(--color-azul-piedra)]/30 text-[var(--color-azul-piedra)] hover:border-[var(--color-ocre)] hover:text-[var(--color-ocre)] transition-colors disabled:opacity-40"
          >
            Exportar página a CSV
          </button>
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2 mb-4">{error}</p>
        )}

        <div className="bg-[var(--color-piedra-clara)] rounded-lg border border-[var(--color-azul-piedra)]/15 overflow-hidden">
          {cargando ? (
            <p className="text-sm text-[var(--color-tinta)]/60 p-6">Cargando...</p>
          ) : registros.length === 0 ? (
            <p className="text-sm text-[var(--color-tinta)]/60 p-6">No hay registros para los filtros seleccionados.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--color-verde-institucional)] text-[var(--color-piedra-clara)]">
  <th className="text-left px-4 py-3 font-medium">Fecha</th>
  <th className="text-left px-4 py-3 font-medium">Usuario</th>
  <th className="text-left px-4 py-3 font-medium">Acción</th>
  <th className="text-left px-4 py-3 font-medium">Entidad</th>
  <th className="text-left px-4 py-3 font-medium">ID</th>
  <th className="text-left px-4 py-3 font-medium">IP</th>
</tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-azul-piedra)]/10">
                  {registros.map((r) => (
                    <tr key={r.id} className="hover:bg-[var(--color-piedra)]/50">
                      <td className="px-4 py-3 text-[var(--color-tinta)]/80 whitespace-nowrap">
                        {new Date(r.fecha).toLocaleString('es-GT')}
                      </td>
                      <td className="px-4 py-3 text-[var(--color-tinta)]/80">
  {r.usuario}
</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full text-xs bg-[var(--color-azul-piedra)]/10 text-[var(--color-azul-piedra)]">
                          {r.accion}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[var(--color-tinta)]">{r.entidad}</td>
                      <td className="px-4 py-3 text-[var(--color-tinta)]/60">{r.entidadId || '—'}</td>
                      <td className="px-4 py-3 text-[var(--color-tinta)]/60">{r.ip || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {totalPaginas > 1 && (
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={() => setPagina((p) => Math.max(1, p - 1))}
              disabled={pagina === 1}
              className="text-sm text-[var(--color-azul-piedra)] hover:text-[var(--color-ocre)] disabled:opacity-30 transition-colors"
            >
              ← Anterior
            </button>
            <span className="text-sm text-[var(--color-tinta)]/60">
              Página {pagina} de {totalPaginas}
            </span>
            <button
              onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
              disabled={pagina === totalPaginas}
              className="text-sm text-[var(--color-azul-piedra)] hover:text-[var(--color-ocre)] disabled:opacity-30 transition-colors"
            >
              Siguiente →
            </button>
          </div>
        )}
      </main>
    </div>
  )
}