import Navbar from "./components/Navbar";
import { Spinner } from 'react-bootstrap';
import Image from "next/image";

function NotFound() {
	return (
    <main className="not-found-container">
		<section className="central-section-404">
      <h1 className="h1-error-404">Error 404 <Spinner animation="grow" speed={1000} className="spinner-404"/></h1>
      <h1 className="h1-text">La página solicitada no existe</h1>
      <Image
        src="/img/logo-blanco.jpg"
        alt="Error 404"
        width={300}
        height={300}
          className="img-404"
      />
    </section>
    <Navbar />
	</main>
  )
}

export default NotFound;
