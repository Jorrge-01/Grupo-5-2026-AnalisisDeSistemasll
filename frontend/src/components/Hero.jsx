import { Link } from 'react-router-dom'
export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[var(--color-verde-institucional)] text-[var(--color-piedra-clara)]">
      <div className="max-w-6xl mx-auto px-6 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="uppercase tracking-[0.2em] text-sm text-[var(--color-ocre-claro)] font-semibold mb-4">
            Gobierno municipal
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-semibold leading-tight mb-6">
            Al servicio de cada vecino, con transparencia y cercanía
          </h1>
          <p className="text-[var(--color-piedra-clara)]/85 text-lg mb-8 max-w-md">
            Consulta información municipal, conoce a tus autoridades y da seguimiento
            a tus trámites y solicitudes desde un solo lugar.
          </p>
            <div className="flex flex-wrap gap-4">
            <Link to="/login" className="px-6 py-3 rounded-md bg-[var(--color-ocre)] hover:bg-[var(--color-ocre-claro)] transition-colors font-semibold">
              Iniciar sesión
            </Link>
            <a
              href="#informacion"
              className="px-6 py-3 rounded-md border border-[var(--color-piedra-clara)]/40 hover:border-[var(--color-piedra-clara)] transition-colors font-semibold"
            >
              Conocer la municipalidad
            </a>
          </div>
        </div>

        {/* Silueta simple del edificio municipal, referencia arquitectónica local */}
        <div className="hidden md:flex justify-center">
          <svg viewBox="0 0 320 240" className="w-full max-w-sm text-[var(--color-piedra-clara)]/90">
            <polygon points="160,20 260,80 60,80" fill="currentColor" opacity="0.9" />
            <rect x="70" y="80" width="180" height="120" fill="currentColor" opacity="0.75" />
            <rect x="90" y="110" width="16" height="90" fill="var(--color-verde-institucional)" />
            <rect x="120" y="110" width="16" height="90" fill="var(--color-verde-institucional)" />
            <rect x="150" y="110" width="20" height="90" fill="var(--color-verde-institucional)" />
            <rect x="184" y="110" width="16" height="90" fill="var(--color-verde-institucional)" />
            <rect x="214" y="110" width="16" height="90" fill="var(--color-verde-institucional)" />
            <rect x="40" y="200" width="240" height="14" fill="var(--color-ocre)" />
          </svg>
        </div>
      </div>
      <div className="franja-textil" />
    </section>
  )
}
