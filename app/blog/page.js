import BlogComponente from "../components/BlogComp";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata = {
	title: "Tips G7",
	description: "Mira Nuestros tips de Limpieza",
};

async function getTips() {
	try {
		const res = await fetch(`${process.env.NEXT_PUBLIC_NEXT_APIURL}/api/tips`);

		if (!res.ok) {
			const errorData = await res.json();
			throw new Error(errorData.message);
		}

		const { data } = await res.json();
		return data;
	} catch (error) {
		console.error(error);
	}
}

async function Blog() {
	const data = await getTips();

	return (
		<div>
			<Header />
			<Navbar />
			<BlogComponente props={data} />
			<Footer />
		</div>
	);
}

export default Blog;
