import FormContact from "../components/FormContact";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata = {
  title: "Contacto G7",
  description: "Mantente en Contacto con Grupo 7.",
};

function Contacto() {
  return (
    <main>
      <Header />
      <Navbar />
      <FormContact />
      <Footer />
    </main>
  )
}

export default Contacto
