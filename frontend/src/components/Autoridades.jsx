const autoridades = [
  { cargo: "Alcalde Municipal", nombre: "Nombre del Alcalde" },
  { cargo: "Síndico I", nombre: "Nombre del Síndico" },
  { cargo: "Síndico II", nombre: "Nombre del Síndico" },
  { cargo: "Concejal I", nombre: "Nombre del Concejal" },
  { cargo: "Concejal II", nombre: "Nombre del Concejal" },
  { cargo: "Secretario Municipal", nombre: "Nombre del Secretario" },
]

export default function Autoridades() {
  return (
    <section id="autoridades" className="max-w-6xl mx-auto px-6 py-20">
      <div className="max-w-xl mb-12">
        <p className="uppercase tracking-[0.2em] text-sm text-[var(--color-ocre)] font-semibold mb-3">
          Corporación municipal
        </p>
        <h2 className="font-display text-3xl md:text-4xl font-semibold text-[var(--color-verde-institucional)]">
          Autoridades
        </h2>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {autoridades.map((a) => (
          <div
            key={a.cargo}
            className="rounded-lg border border-[var(--color-verde-institucional)]/12 bg-[var(--color-piedra)] p-6 hover:border-[var(--color-ocre)]/40 transition-colors"
          >
            <div className="h-16 w-16 rounded-full bg-[var(--color-azul-piedra)]/15 mb-4" />
            <p className="font-display font-semibold text-lg text-[var(--color-verde-institucional)]">
              {a.nombre}
            </p>
            <p className="text-sm text-[var(--color-azul-piedra)] font-medium mt-1">
              {a.cargo}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
