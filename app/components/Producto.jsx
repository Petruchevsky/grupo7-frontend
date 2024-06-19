"use client";
import Image from "next/image";
import Link from "next/link";
import { Zoom } from "react-awesome-reveal";
import "./Producto.css";

const Producto = ({ product }) => {
	let { title, price, stock, images, slug } = product;

	price = price.toLocaleString("es-CL", {
		style: "currency",
		currency: "CLP",
	});

	return (
		<Zoom cascade damping={0.1}>
			<div className="card-prod">
				<Image
					src={images[0].url}
					alt={`Imagen de Producto ${title}`}
					width={300}
					height={300}
					className="img-prod"
				/>

				<div className="card-prod-text">
						<Zoom>
							<h1>{title}</h1>
							<h2>Precio: {price}</h2>
							<p>Disponible: {stock ? "SI" : "NO"}</p>
						</Zoom>
						{stock ? (
							<div className="btn-prod-div">
								<Link href={`/tienda/${slug}`} className="link-button">
									Ver Producto
								</Link>
							</div>
						) : (
							<div className="btn-prod-div">
								<button className="btn-disabled">Sin Stock</button>
							</div>
						)}
				</div>
			</div>
		</Zoom>
	);
};

export default Producto;
