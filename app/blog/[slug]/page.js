import Image from "next/image";
import "./post-url.css";
import ReactMarkdown from "react-markdown";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export const metadata = {
	title: "Tips G7",
	description: "Nuestros tips de Limpieza",
};

const getTip = async (slug) => {
	try {
		const res = await fetch(
			`${process.env.NEXT_PUBLIC_NEXT_APIURL}/api/obtener-tip`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ slug: slug }),
			}
		);

		if (!res.ok) {
			const errorData = await res.json();
			throw new Error(errorData.message);
		}

		const { data } = await res.json();
		console.log(data);
		return data;
	} catch (error) {
		console.log(error);
	}
};

async function Tip({ params }) {
	const { slug } = params;

	const data = await getTip(slug);
	console.log(data);
	let { title, description, createdAt, createdBy, images } = data;
	const date = new Date(createdAt);
	const options = {
		year: "numeric",
		month: "long",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	};
	const formattedDate = date.toLocaleDateString("es-ES", options) + " hrs.";

	return (
		<main>
			<div className="post-url-container">
				<h1 className="h1-page">{title}</h1>
				<h2>{formattedDate}</h2>
				<p style={{ textAlign:'center' }}>Creado por {createdBy}</p>

				<article className="post-url-article">
					<div className="post-url-img-div ">
						<Image
							src={images[0].url}
							alt={`Imagen de ${title}`}
							width={1000}
							height={1000}
							className="post-url-img"
						/>
					</div>
					<div className="post-url-text-div">
						<ReactMarkdown style={{ margin:0}}>{description}</ReactMarkdown>
					</div>
				</article>
			</div>

			<Navbar />
			<Footer />
		</main>
	);
}

export default Tip;
