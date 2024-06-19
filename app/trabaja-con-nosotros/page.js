import Header from "../components/Header"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import "./trabaja-con-nosotros.css"
import Link from "next/link"

export const metada = {
  title: 'Trabaja con nosotros',
  description: 'Únete a nuestra gran familia Grupo 7!!'
}

function TrabajaConNosotros() {
  return (
    <main>
      <Header />
      <Navbar />
      <section className="central-section-tra">
        <h1 className="h1-page">Trabaja con Nosotros</h1>
        <div className="cont-divs-p">
          <div>
            <p>Trabaja con nosotros y sé parte de un equipo apasionado en la industria de productos de limpieza. Obtén ingresos ilimitados y libertad financiera.</p>
          </div>
          <div>
            <p>Únete a nuestro equipo y disfruta de la libertad de horarios mientras generas ingresos ilimitados vendiendo nuestros productos de limpieza.</p>
          </div>
          <div>
            <p>En nuestra empresa, encontrarás un trabajo apasionante cerrando negocios con dueños de empresas que necesitan productos al por mayor, ofreciéndote libertad financiera y horaria.</p>
          </div>
        </div>
        <h1>Si piensas que eres la persona indicada, no dudes en escribirnos</h1>
        <Link href="/contacto" className="link-button m-auto">Ponte en Contacto!</Link>
      </section>
      <Footer />
    </main>
  )
}

export default TrabajaConNosotros
