import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Hero from './components/Hero'
import Autoridades from './components/Autoridades'
import InfoGeneral from './components/InfoGeneral'
import MisionVision from './components/MisionVision'
import Footer from './components/Footer'
import Login from './pages/Login'
import Registro from './pages/Registro'
import OlvideContrasena from './pages/OlvideContrasena'
import CambiarPassword from './pages/CambiarPassword'
import Admin from './pages/Admin'
import Vecino from './pages/Vecino'
import RutaProtegida from './components/RutaProtegida'
import GestionAldeas from './pages/GestionAldeas'
import GestionAreas from './pages/GestionAreas'
import Reportes from './pages/Reportes'
import ReporteBitacora from './pages/ReporteBitacora'

function Inicio() {
  return (
    <>
      <Hero />
      <Autoridades />
      <InfoGeneral />
      <MisionVision />
    </>
  )
}

// Rutas que NO deben mostrar el header/footer públicos,
// porque ya tienen su propio encabezado (paneles internos autenticados).
const RUTAS_SIN_LAYOUT_PUBLICO = ['/admin', '/vecino', '/analista', '/empleado']

function Layout({ children }) {
  const location = useLocation()
  const esInterna = RUTAS_SIN_LAYOUT_PUBLICO.some((ruta) =>
    location.pathname.startsWith(ruta)
  )

  if (esInterna) {
    return children
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/olvide-password" element={<OlvideContrasena />} />
          <Route path="/cambiar-password" element={<CambiarPassword />} />
          <Route
            path="/admin"
            element={
              <RutaProtegida rolRequerido="Administrador">
                <Admin />
              </RutaProtegida>
            }
          />
          <Route
            path="/vecino"
            element={
              <RutaProtegida rolRequerido="Vecino">
                <Vecino />
              </RutaProtegida>
            }
          />

          <Route
            path="/admin/aldeas"
            element={
              <RutaProtegida rolRequerido="Administrador">
                <GestionAldeas />
              </RutaProtegida>
            }
          />

          <Route
            path="/admin/areas"
            element={
              <RutaProtegida rolRequerido="Administrador">
                <GestionAreas />
              </RutaProtegida>
            }
          />
          
        <Route
  path="/admin/reportes"
  element={
    <RutaProtegida rolRequerido="Administrador">
      <Reportes />
    </RutaProtegida>
  }
/>
<Route
  path="/admin/bitacora"
  element={
    <RutaProtegida rolRequerido="Administrador">
      <ReporteBitacora />
    </RutaProtegida>
  }
/>
        </Routes>


      </Layout>
    </BrowserRouter>
  )
}

export default App