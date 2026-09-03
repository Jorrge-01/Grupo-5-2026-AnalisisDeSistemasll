import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import HeaderInterno from '../components/HeaderInterno'
import ModalCargando from '../components/ModalCargando'
import ModalExito from '../components/ModalExito'
import { apiFetch } from '../lib/api'

export default function RegistrarCaso() {
  const navigate = useNavigate()

  const [areas, setAreas] = useState([])
  const [aldeas, setAldeas] = useState([])
  const [cargandoDatos, setCargandoDatos] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')
  const [exito, setExito] = useState('')
  const [codigoCaso, setCodigoCaso] = useState('')

  const [form, setForm] = useState({
    areaId: '',
    aldeaId: '',
    direccion: '',
    telefonoContacto: '',
    descripcion: '',
  })

  useEffect(() => {
    async function cargarDatos() {
      setCargandoDatos(true)
      try {
        const token = localStorage.getItem('token')
        const [areasData, aldeasData] = await Promise.all([
          apiFetch('/api/Casos/areas-quejas', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          apiFetch('/api/Casos/aldeas', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ])
        setAreas(areasData)
        setAldeas(aldeasData)
      } catch (err) {
        setError(err.message || 'No se pudieron cargar los datos del formulario.')
      } finally {
        setCargandoDatos(false)
      }
    }

    cargarDatos()
  }, [])

  function handleChange(e) {
    const { name, value } = e.target

    if (name === 'telefonoContacto') {
      setForm((p) => ({
        ...p,
        telefonoContacto: value.replace(/\D/g, '').slice(0, 8),
      }))
      return
    }

    setForm((p) => ({ ...p, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setExito('')

    if (!form.areaId) return setError('Debes seleccionar el tipo de queja.')
    if (!form.aldeaId) return setError('Debes seleccionar la aldea o comunidad.')
    if (!form.direccion.trim()) return setError('La dirección de la queja es obligatoria.')
    if (form.direccion.trim().length > 120) return setError('La dirección no debe exceder 120 caracteres.')
    if (form.telefonoContacto.length !== 8) return setError('El teléfono debe tener 8 dígitos.')
    if (!form.descripcion.trim()) return setError('La descripción de la queja es obligatoria.')
    if (form.descripcion.trim().length > 2000) return setError('La descripción no debe exceder 2000 caracteres.')

    setGuardando(true)

    try {
      const token = localStorage.getItem('token')

      const data = await apiFetch('/api/Casos', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          areaId: Number(form.areaId),
          aldeaId: Number(form.aldeaId),
          direccion: form.direccion.trim(),
          telefonoContacto: form.telefonoContacto,
          descripcion: form.descripcion.trim(),
        }),
      })

      setCodigoCaso(data.codigo)
      setExito(`Tu queja fue registrada correctamente con el código ${data.codigo}.`)
    } catch (err) {
      setError(err.message || 'No se pudo registrar la queja.')
    } finally {
      setGuardando(false)
    }
  }

  function cerrarExito() {
    setExito('')
    navigate('/vecino')
  }

  const inputClass = 'w-full px-4 py-2.5 rounded-md border border-[var(--color-azul-piedra)]/30 bg-white text-[var(--color-tinta)] placeholder:text-[var(--color-azul-piedra)]/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-ocre)] transition-shadow'
  const labelClass = 'block text-sm font-medium text-[var(--color-tinta)] mb-1.5'

  return (
    <div className="min-h-[calc(100vh-73px)] bg-[var(--color-piedra)]">
      <HeaderInterno titulo="Registrar una queja" />

      <main className="max-w-3xl mx-auto px-6 py-10">
        <button
          type="button"
          onClick={() => navigate('/vecino')}
          className="text-sm text-[var(--color-azul-piedra)] hover:text-[var(--color-ocre)] mb-6 transition-colors"
        >
          ← Volver a mi portal
        </button>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="bg-[var(--color-piedra-clara)] rounded-lg border border-[var(--color-azul-piedra)]/15 p-8 space-y-5"
        >
          <div>
            <h2 className="font-display text-xl font-semibold text-[var(--color-verde-institucional)]">
              Registrar una queja
            </h2>
            <p className="text-sm text-[var(--color-tinta)]/60 mt-1">
              Completa la información para reportar un problema a la municipalidad.
            </p>
          </div>

          {cargandoDatos ? (
            <p className="text-sm text-[var(--color-tinta)]/60">
              Cargando información...
            </p>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>
                    Tipo de queja <span className="text-red-600">*</span>
                  </label>
                  <select
                    name="areaId"
                    value={form.areaId}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="">Selecciona un área</option>
                    {areas.map((area) => (
                      <option key={area.id} value={area.id}>
                        {area.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelClass}>
                    Aldea o comunidad <span className="text-red-600">*</span>
                  </label>
                  <select
                    name="aldeaId"
                    value={form.aldeaId}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="">Selecciona una opción</option>
                    {aldeas.map((aldea) => (
                      <option key={aldea.id} value={aldea.id}>
                        {aldea.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className={labelClass}>
                  Dirección donde ocurre la queja <span className="text-red-600">*</span>
                </label>
                <input
                  name="direccion"
                  maxLength={120}
                  value={form.direccion}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Ej. 3a calle zona 2, frente al parque"
                />
                <p className="text-xs text-[var(--color-tinta)]/50 mt-1">
                  {form.direccion.length}/120 caracteres
                </p>
              </div>

              <div>
                <label className={labelClass}>
                  Teléfono de contacto <span className="text-red-600">*</span>
                </label>
                <input
                  name="telefonoContacto"
                  inputMode="numeric"
                  maxLength={8}
                  value={form.telefonoContacto}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Ej. 55551234"
                />
                <p className="text-xs text-[var(--color-tinta)]/50 mt-1">
                  Ingresa un número de teléfono de 8 dígitos.
                </p>
              </div>

              <div>
                <label className={labelClass}>
                  Descripción de la queja <span className="text-red-600">*</span>
                </label>
                <textarea
                  name="descripcion"
                  maxLength={2000}
                  rows={6}
                  value={form.descripcion}
                  onChange={handleChange}
                  className={`${inputClass} resize-y`}
                  placeholder="Describe con claridad el problema que deseas reportar..."
                />
                <p className="text-xs text-[var(--color-tinta)]/50 mt-1">
                  {form.descripcion.length}/2000 caracteres
                </p>
              </div>
            </>
          )}

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {error}
            </p>
          )}

          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/vecino')}
              className="flex-1 py-2.5 rounded-md border border-[var(--color-azul-piedra)]/30 text-[var(--color-azul-piedra)] font-semibold hover:bg-[var(--color-piedra)] transition-colors"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={guardando || cargandoDatos}
              className="flex-1 py-2.5 rounded-md bg-[var(--color-ocre)] text-[var(--color-piedra-clara)] font-semibold hover:bg-[var(--color-ocre-claro)] transition-colors disabled:opacity-60"
            >
              {guardando ? 'Registrando...' : 'Registrar queja'}
            </button>
          </div>
        </form>
      </main>

      <ModalCargando
        visible={guardando}
        mensaje="Registrando tu queja..."
      />

      <ModalExito
        titulo="¡Queja registrada!"
        mensaje={exito}
        onCerrar={cerrarExito}
      />
    </div>
  )
}