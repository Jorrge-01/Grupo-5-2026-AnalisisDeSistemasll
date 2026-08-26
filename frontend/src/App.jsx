import { BrowserRouter, Routes, Route } from 'react-router-dom'
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
import GestionAldeas from './pages/GestionAldeas'
import GestionAreas from './pages/GestionAreas'
import GestionUsuarios from './pages/GestionUsuarios'
import CrearVecino from './pages/CrearVecino'
import CrearEmpleadoMunicipal from './pages/CrearEmpleadoMunicipal'
import Reportes from './pages/Reportes'
import ReporteBitacora from './pages/ReporteBitacora'
import RutaProtegida from './components/RutaProtegida'
import ReporteUsuarios from './pages/ReporteUsuarios'

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

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
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
              path="/admin/usuarios"
              element={
                <RutaProtegida rolRequerido="Administrador">
                  <GestionUsuarios />
                </RutaProtegida>
              }
            />
            <Route
              path="/admin/usuarios/vecino"
              element={
                <RutaProtegida rolRequerido="Administrador">
                  <CrearVecino />
                </RutaProtegida>
              }
            />
            <Route
              path="/admin/usuarios/empleado"
              element={
                <RutaProtegida rolRequerido="Administrador">
                  <CrearEmpleadoMunicipal />
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
            <Route
  path="/admin/reporte-usuarios"
  element={
    <RutaProtegida rolRequerido="Administrador">
      <ReporteUsuarios />
    </RutaProtegida>
  }
/>
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App