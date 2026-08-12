// Cambia este puerto por el que te muestre tu launchSettings.json (applicationUrl, versión https)
export const API_BASE_URL = 'https://localhost:7096'

export async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    const mensaje = data?.mensaje || 'Ocurrió un error. Intenta de nuevo.'
    throw new Error(mensaje)
  }

  return data
}