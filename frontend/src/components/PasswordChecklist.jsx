export function validarPassword(password) {
  return {
    longitud: password.length >= 8,
    mayuscula: /[A-Z]/.test(password),
    minuscula: /[a-z]/.test(password),
    numero: /[0-9]/.test(password),
    especial: /[^A-Za-z0-9]/.test(password),
  }
}

export function passwordEsValida(password) {
  const reglas = validarPassword(password)
  return Object.values(reglas).every(Boolean)
}

export default function PasswordChecklist({ password }) {
  const reglas = validarPassword(password)

  const items = [
    { key: 'longitud', texto: 'Al menos 8 caracteres' },
    { key: 'mayuscula', texto: 'Una letra mayúscula' },
    { key: 'minuscula', texto: 'Una letra minúscula' },
    { key: 'numero', texto: 'Un número' },
    { key: 'especial', texto: 'Un carácter especial (!@#$%...)' },
  ]

  return (
    <ul className="mt-2 space-y-1">
      {items.map((item) => (
        <li
          key={item.key}
          className={`text-xs flex items-center gap-1.5 ${
            reglas[item.key] ? 'text-green-600' : 'text-[var(--color-tinta)]/50'
          }`}
        >
          <span>{reglas[item.key] ? '✓' : '○'}</span>
          {item.texto}
        </li>
      ))}
    </ul>
  )
}