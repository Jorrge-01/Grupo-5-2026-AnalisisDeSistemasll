const datos = [
  { etiqueta: "Dirección", valor: "Barrio o zona central, frente al parque municipal" },
  { etiqueta: "Horario de atención", valor: "Lunes a viernes, 8:00 a.m. – 4:00 p.m." },
  { etiqueta: "Teléfono", valor: "(502) 0000-0000" },
  { etiqueta: "Correo institucional", valor: "info@municipalidad.gob.gt" },
]

export default function InfoGeneral() {
  return (
    <section id="informacion" className="bg-[var(--color-piedra)]">
      <div className="franja-textil" />
      <div className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12">
        <div>
          <p className="uppercase tracking-[0.2em] text-sm text-[var(--color-ocre)] font-semibold mb-3">
            Información institucional
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-[var(--color-verde-institucional)] mb-6">
            La municipalidad, cerca de ti
          </h2>
          <p className="text-[var(--color-tinta)]/80 max-w-md">
            Encuentra los datos generales para visitarnos, escribirnos o comunicarte
            con la corporación municipal.
          </p>
        </div>

        <dl className="space-y-6">
          {datos.map((d) => (
            <div key={d.etiqueta} className="border-b border-[var(--color-verde-institucional)]/15 pb-4">
              <dt className="text-xs uppercase tracking-wide text-[var(--color-azul-piedra)] font-semibold mb-1">
                {d.etiqueta}
              </dt>
              <dd className="font-display text-lg text-[var(--color-verde-institucional)]">
                {d.valor}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
