import NosotrosComp from "../components/NosotrosComp";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export const metadata = {
	title: "Nosotros G7",
	description: "Somos una gran empreza familiar en plena expansión!",
};

const getNosotros = async () => {
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_NEXT_APIURL}/api/nosotros`
		);
		if (response.ok) {
			const { data } = await response.json();
			return data;
		} else {
			const errorData = await response.json();
			const errorMessage = `Error: ${response.status}: ${errorData.message}`;
			throw new Error(errorMessage);
		}
	} catch (error) {
		console.error(error);

		return null;
	}
};

async function Nosotros() {

	const data = await getNosotros();
	const descripcion = data?.description;
	const imagenes = data?.images


	return (
		<main>
			<Header />
			<Navbar />
			<NosotrosComp descripcion={descripcion} imagenes={imagenes} />
			<Footer />
		</main>
	);
}

export default Nosotros;
