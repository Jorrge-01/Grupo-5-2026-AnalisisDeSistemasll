// Traduce mensajes conocidos de ASP.NET Identity (en inglés) al español.
// Si no reconoce el mensaje, lo devuelve tal cual llegó.
const traducciones = [
  { patron: /Passwords must be at least (\d+) characters/i, reemplazo: (m) => `La contraseña debe tener al menos ${m[1]} caracteres.` },
  { patron: /Passwords must have at least one digit/i, reemplazo: () => 'La contraseña debe contener al menos un número.' },
  { patron: /Passwords must have at least one uppercase/i, reemplazo: () => 'La contraseña debe contener al menos una letra mayúscula.' },
  { patron: /Passwords must have at least one lowercase/i, reemplazo: () => 'La contraseña debe contener al menos una letra minúscula.' },
  { patron: /Passwords must have at least one non alphanumeric/i, reemplazo: () => 'La contraseña debe contener al menos un carácter especial.' },
  { patron: /Incorrect password/i, reemplazo: () => 'La contraseña actual es incorrecta.' },
  { patron: /already taken/i, reemplazo: () => 'Ese correo o usuario ya está en uso.' },
  { patron: /is invalid/i, reemplazo: () => 'El valor ingresado no es válido.' },
  { patron: /locked out/i, reemplazo: () => 'La cuenta está bloqueada temporalmente por múltiples intentos fallidos.' },
]

export function traducirError(mensaje) {
  if (!mensaje) return mensaje

  const partes = mensaje.split('|').map((parte) => parte.trim())

  const traducidas = partes.map((parte) => {
    for (const { patron, reemplazo } of traducciones) {
      const match = parte.match(patron)
      if (match) return reemplazo(match)
    }
    return parte
  })

  return traducidas.join(' ')
}