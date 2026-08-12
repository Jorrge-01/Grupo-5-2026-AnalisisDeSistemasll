import { Link } from 'react-router-dom'
import logoMuni from '../assets/logo-muni.png'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-[var(--color-piedra-clara)]/95 backdrop-blur border-b border-[var(--color-verde-institucional)]/15">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link to="/">
          <img src={logoMuni} alt="Logo de la municipalidad" className="h-16 object-contain" />
        </Link>

    <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--color-tinta)]">
  <a href="/#autoridades" className="hover:text-[var(--color-ocre)] transition-colors">Autoridades</a>
  <a href="/#informacion" className="hover:text-[var(--color-ocre)] transition-colors">Información</a>
  <a href="/#mision-vision" className="hover:text-[var(--color-ocre)] transition-colors">Misión y visión</a>
</nav>
        <Link
          to="/login"
          className="px-5 py-2.5 rounded-md bg-[var(--color-ocre)] text-[var(--color-piedra-clara)] font-semibold text-sm hover:bg-[var(--color-ocre-claro)] transition-colors"
        >
          Iniciar sesión
        </Link>
      </div>
    </header>
  )
}