"use client";
import { useState } from "react";
import Producto from "./Producto";
import "./ProductosDestacados.css";
import '@/app/page.css'
import Image from "next/image";
import { Slide } from "react-awesome-reveal";
import { errorHandler } from "../utils/error-handler";


function TiendaComp({ data }) {
	const [redToast, setRedToast] = useState("");
	const products = data.products;

	{redToast && <p className="error"> {redToast} </p>}

	if (data.isEmpty) {
		return (
			<div className="PD-container-empty">
				<Slide>
					<h1>Aún no hemos agregado Productos a Nuestra Tienda</h1>
				</Slide>

				<Image
					src="/img/tienda-vacia.avif"
					width={626}
					height={351}
					alt="imagen de tienda vacia"
					className="PD-img"
				/>
			</div>
		);
	}

	return (
		<main>
			<Slide>
				<h1 className="h1-page">Tienda</h1>
			</Slide>

			<div className="PD-container">
				{products &&
					products.map((product) => {
						return (
							<Producto key={product.id.toString()} product={product} />
						);
					})}
			</div>

			<div className="home-banner">
				<Image
					src="/img/bannerG7.png"
					width={1600}
					height={400}
					alt="Banner G7"
					className="banner-img"
				/>
			</div>
		</main>
	);
}

export default TiendaComp;
