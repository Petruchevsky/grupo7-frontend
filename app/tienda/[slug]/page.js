import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import Image from "next/image";
import Link from "next/link";
import "./tienda-url.css";
import { FaWhatsapp } from "react-icons/fa";
import ReactMarkdown from "react-markdown";

export const metadata = {
	title: "Tienda G7",
	description: "Todos nuestros productos son Biodegradables",
	keywords: "tienda",
};

const obtenerProductos = async (slug) => {
	try {
		const res = await fetch(
			`${process.env.NEXT_PUBLIC_NEXT_APIURL}/api/obtener-producto`,
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
		return data;
	} catch (error) {
		console.log(error);
	}
};

async function Articulo({ params }) {
	let { slug } = params;
	let data = await obtenerProductos(slug);
	let { title, description, price, images } = data;
	console.log(data);
	price = price.toLocaleString("es-CL", {
		style: "currency",
		currency: "CLP",
	});

	return (
		<main>
			<section className="url-main-container">
				<h2 className="observacion">
					Recuerda que solo en tu primera compra deberás incluir el costo de
					$1.500 correspondiente a nuestro envase retornable.
					<br />
					<span>
						Los precios de nuestra tienda no incluyen el costo del envase.
					</span>
				</h2>

				<section className="inner-container">
					<div className="url-img-div">
						<Image
							src={images[0].url}
							alt={`Imagen de Producto`}
							width={300}
							height={300}
							className="url-img"
						/>
					</div>

					<div className="text-btn-div">
						<div className="div-text-url">
							<h1>{title}</h1>
							<h2>{price}</h2>
							<ReactMarkdown>{description}</ReactMarkdown>
						</div>
						
						<div className="btn-div-url">
							<Link
								className="link-button-success"
								href="https://wa.me/56937131180?text=Hola!%20Quisiera%20comprar%20un%20producto%20de%20Grupo%207!"
								target="_blank"
								rel="noopener noreferrer"
							>
								<FaWhatsapp />
								Comprar!
							</Link>
						</div>
					</div>

				</section>
				<Navbar />
			</section>
			<Footer />
		</main>
	);
}

export default Articulo;
