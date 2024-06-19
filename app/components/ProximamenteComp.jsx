"use client";
import "./ProximamenteComp.css";
import Image from "next/image";
import { Bounce, Slide } from "react-awesome-reveal";

function ProximamenteComponente({ props }) {
	const data = props;
	console.log(data);
	console.log(data.products);

	return (
		<main className="prox-container">
			<Slide>
				<h1 className="h1-page">Proximamente en Grupo 7</h1>
			</Slide>
			<div className="items-container">
				<Bounce cascade damping={0.2}>
					{!data.isEmpty ? (
						data.products.map((product) => {
							const { id, title, description, images, releaseDate } = product;
							console.log(images);
							return (
								<div className="itemDiv ishadow" key={id}>
									<Image
										src={images && images[0].url}
										width={250}
										height={250}
										alt="imagen de nuevo producto"
									/>
									<div className="textoDiv">
										<h1>{title}</h1>
										<p>Fecha de lanzamiento: {releaseDate}</p>
										<div>
											<pre className="pre">{description}</pre>
										</div>
									</div>
								</div>
							);
						})
					) : (
						<div className="container2">
							<h1>
								¡Aquí verás todos los productos que te podremos ofrecer en el
								futuro!
							</h1>
							<Image
								src="/img/logo-redondo-oro.png"
								width={400}
								height={400}
								alt="logo de Grupo 7"
							/>
							<Image
								src="/img/prox-img2.jpg"
								width={450}
								height={450}
								alt="imagen de quimico trabajando"
							/>
						</div>
					)}
				</Bounce>
			</div>
		</main>
	);
}

export default ProximamenteComponente;
