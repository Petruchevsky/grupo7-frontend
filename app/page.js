import Slider from "./components/Slider";
import dynamic from "next/dynamic";
const Header = dynamic(()=> import("./components/Header"), {ssr: false});
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProductosDestacados from "./components/ProductosDestacados";
import Image from "next/image";
import "./page.css";


export const metadata = {
	title: "Inicio",
	description: "Bienvenidos a Grupo 7",
};

function Home() {
	return (
		<main>
			<Header />
			<Navbar />
			<section className="flex-container-y">
				<Slider />
			</section>
			<section>
				<ProductosDestacados />
			</section>
			<div className="home-banner">
				<Image
					src="/img/bannerG7.png"
					width={1600}
					height={400}
					alt="Banner G7"
					className="banner-img"
				/>
			</div>
			<Footer />
		</main>
	);
}

export default Home;
