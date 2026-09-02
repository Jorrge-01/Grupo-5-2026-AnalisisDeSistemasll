export const API_BASE_URL = 'https://localhost:7096'

export async function apiFetch(path, options = {}) {
  let res
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })
  } catch (err) {
    // Esto captura errores de RED (backend apagado, sin internet, CORS, etc.)
    // — nunca llega a haber respuesta del servidor.
    throw new Error('No se pudo conectar con el servidor. Verifica tu conexión o intenta más tarde.')
  }

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    const mensaje = data?.mensaje || 'Ocurrió un error. Intenta de nuevo.'
    throw new Error(mensaje)
  }

  return data
}