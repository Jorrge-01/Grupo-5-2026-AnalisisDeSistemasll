import HeaderInterno from '../components/HeaderInterno'

export default function Vecino() {
  return (
    <div className="min-h-[calc(100vh-73px)] bg-[var(--color-piedra)]">
      <HeaderInterno titulo="Mi Portal" />

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