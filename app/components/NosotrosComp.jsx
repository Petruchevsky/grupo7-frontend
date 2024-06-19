"use client";
import Image from "next/image";
import "./NosotrosComp.css";
import Link from "next/link";
import { Slide, Bounce } from "react-awesome-reveal";

function NosotrosComp({ descripcion, imagenes }) {
	return (
		<main className="nosotros-container">
			<Bounce>
				<h1 className="h1-page">Nosotros</h1>
			</Bounce>
			<div className="nosotros-img-container">
				<Slide>
					{imagenes?.map((img) => {
						let { id } = img;

						return (
							<Image
								src={img.url}
								alt="Imagen sobre nosotros"
								width={300}
								height={300}
								className="nosotros-img"
								key={id}
							/>
						);
					})}
				</Slide>
			</div>
			<Slide>
				<div>
					<pre className="pre">{descripcion}</pre>
				</div>
			</Slide>
			<div className="btn-div-nos">
				<Bounce>
					<Link
						className="link-button"
						href="mailto:contacto@grupo7.cl?subject=Consulta"
					>
						Escríbenos!
					</Link>
				</Bounce>
			</div>
		</main>
	);
}

export default NosotrosComp;
