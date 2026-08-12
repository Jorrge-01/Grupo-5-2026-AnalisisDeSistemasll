import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Hero from './components/Hero'
import Autoridades from './components/Autoridades'
import InfoGeneral from './components/InfoGeneral'
import MisionVision from './components/MisionVision'
import Footer from './components/Footer'
import Login from './pages/Login'
import Registro from './pages/Registro'

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
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App