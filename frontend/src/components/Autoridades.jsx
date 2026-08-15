import alcalde from '../assets/alcalde.jpg'
import sindico1 from '../assets/sindico1.jpg'
import sindico2 from '../assets/sindico2.jpg'
import concejal1 from '../assets/concejal1.jpg'
import concejal2 from '../assets/concejal2.jpg'
import secretario from '../assets/secretario.jpg'

const autoridades = [
  { cargo: "Alcalde Municipal", nombre: "Nombre del Alcalde", foto: alcalde },
  { cargo: "Síndico I", nombre: "Nombre del Síndico", foto: sindico1 },
  { cargo: "Síndico II", nombre: "Nombre del Síndico", foto: sindico2 },
  { cargo: "Concejal I", nombre: "Nombre del Concejal", foto: concejal1 },
  { cargo: "Concejal II", nombre: "Nombre del Concejal", foto: concejal2 },
  { cargo: "Secretario Municipal", nombre: "Nombre del Secretario", foto: secretario },
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
            <img
              src={a.foto}
              alt={a.nombre}
              className="h-16 w-16 rounded-full object-cover mb-4"
            />
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