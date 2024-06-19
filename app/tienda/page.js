import Header from "../components/Header";
import Navbar from "../components/Navbar";
import TiendaComp from "../components/TiendaComp";
import Footer from "../components/Footer";

export const metadata = {
	title: "Tienda G7",
	description: "Productos 100% Biodegradables",
};

const getProductos = async() => {
	try {
		const res = await fetch(
			`${process.env.NEXT_PUBLIC_NEXT_APIURL}/api/productos`
		);

		if (!res.ok) {
			errorHandler(res.status);
			setRedToast(res.statusText);
			throw new Error(res.statusText);
		}

		const { data } = await res.json();
		return data;
	} catch (error) {
		console.error(error);
	}
}

async function Tienda() {
	const data = await getProductos();

	return (
		<div>
			<Header />
			<Navbar />
			<TiendaComp data={data}/>
			<Footer />
		</div>
	);
}

export default Tienda;
