export default function MisionVision() {
  return (
    <section id="mision-vision" className="max-w-6xl mx-auto px-6 py-20">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="rounded-lg bg-[var(--color-verde-institucional)] text-[var(--color-piedra-clara)] p-10">
          <h3 className="font-display text-2xl font-semibold mb-4 text-[var(--color-ocre-claro)]">
            Misión
          </h3>
          <p className="leading-relaxed text-[var(--color-piedra-clara)]/90">
            Servir a la población del municipio con eficiencia, transparencia y cercanía,
            promoviendo el desarrollo integral y la mejora continua de los servicios
            públicos para todos los vecinos.
          </p>
        </div>

        <div className="rounded-lg bg-[var(--color-azul-piedra)] text-[var(--color-piedra-clara)] p-10">
          <h3 className="font-display text-2xl font-semibold mb-4 text-[var(--color-ocre-claro)]">
            Visión
          </h3>
          <p className="leading-relaxed text-[var(--color-piedra-clara)]/90">
            Ser una municipalidad moderna y confiable, reconocida por la calidad de su
            gestión, la participación ciudadana y el uso responsable de los recursos
            públicos.
          </p>
        </div>
      </div>
    </section>
  )
}
