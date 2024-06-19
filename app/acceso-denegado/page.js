import React from 'react'
import Header from '../components/Header'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './acceso-denegado.css'

export const metadata = {
  title: "Acceso Denegado",
  description: "No tienes permisos para acceder a esta página."
};


function AccesoDenegado() {
  return (
    <main className="main-container-y">
      <Header />
      <Navbar />
      <div className="content">
        <h1 style={{ color:'red'}}>Acceso Denegado</h1>
        <p className="text-center">No tienes permisos para acceder a esta página.</p>
        <p className="text-center">Por favor, inicia sesión con una cuenta de administrador.</p>
      </div>
      <Footer />
    </main>
  )
}

export default AccesoDenegado
