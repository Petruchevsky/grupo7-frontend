import Producto from "./Producto";
import "./ProductosDestacados.css"
import Link from "next/link";

async function getProductos() {
	try {
		const res = await fetch(
			`${process.env.NEXT_PUBLIC_NEXT_APIURL}/api/productos`
		);

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

async function ProductosDestacados() {

	const data = await getProductos();
	const products = data.products;

	if (data.isEmpty) {
		return (
			<div className="PD-container-empty">
				<h1>
					Aún no hemos agregado Productos a Nuestra Tienda
				</h1>
			</div>
		);
	}

	return (
		<main className="main-container-PD">

			<h1 className="h1-page">Productos Destacados</h1>
			<div className="PD-container">
				{products &&
					products.map((product) => {
						return (
							<Producto
								key={product.id.toString()}
								product={product}
							/>
						);
					})}
			</div>
			<Link href="/tienda" className="link-button m-auto rounded-0">Ir a la Tienda</Link>
		</main>
	);
}

export default ProductosDestacados;
