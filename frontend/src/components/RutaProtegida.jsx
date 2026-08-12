import { Navigate } from 'react-router-dom'

export default function RutaProtegida({ rolRequerido, children }) {
  const token = localStorage.getItem('token')
  const roles = JSON.parse(localStorage.getItem('roles') || '[]')

  if (!token) {
    return <Navigate to="/login" replace />
  }

  if (rolRequerido && !roles.includes(rolRequerido)) {
    // Está logueado pero con un rol distinto al que exige esta ruta
    return <Navigate to="/" replace />
  }

  return children
}