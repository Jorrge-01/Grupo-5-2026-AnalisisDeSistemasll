export function validarEmailReglas(email) {
  const arroba = email.includes('@')
  const partes = email.split('@')
  const tieneUsuario = partes[0]?.length > 0
  const dominio = partes[1] || ''
  const tienePunto = dominio.includes('.')
  const extension = dominio.split('.').pop() || ''
  const extensionValida = extension.length >= 2 && !dominio.endsWith('.')

  return {
    tieneUsuario,
    arroba,
    tienePunto,
    extensionValida,
  }
}

export function emailEsValido(email) {
  const reglas = validarEmailReglas(email)
  return Object.values(reglas).every(Boolean)
}

export default function EmailChecklist({ email }) {
  if (!email) return null

  const reglas = validarEmailReglas(email)
  const valido = Object.values(reglas).every(Boolean)

  if (valido) return null // una vez es válido, no mostramos nada más

  const items = [
    { key: 'tieneUsuario', texto: 'nombre' },
    { key: 'arroba', texto: '@' },
    { key: 'tienePunto', texto: 'punto' },
    { key: 'extensionValida', texto: 'extensión' },
  ]

  return (
    <p className="mt-1.5 text-xs text-[var(--color-tinta)]/50 flex flex-wrap gap-x-3">
      <span>Falta:</span>
      {items
        .filter((item) => !reglas[item.key])
        .map((item) => (
          <span key={item.key} className="text-[var(--color-ocre)]">
            {item.texto}
          </span>
        ))}
    </p>
  )
}