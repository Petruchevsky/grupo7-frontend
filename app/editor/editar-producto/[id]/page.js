"use client";
import { React, useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./editar-producto.css";
import Link from "next/link";
import Image from "next/image";
import { Spinner } from "react-bootstrap";
import { FaSave, FaShoppingBag } from "react-icons/fa";
import { MdModeEdit } from "react-icons/md";
import { GrStatusGood } from "react-icons/gr";
import { BiError } from "react-icons/bi";
import { IoMdAddCircleOutline } from "react-icons/io";

function EditarProducto({ params }) {
	const { id } = params;

	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [price, setPrice] = useState("");
	const [stock, setStock] = useState(true);
	const [images, setImages] = useState([]);
	const [imageUrl, setImageUrl] = useState(null);
	const [slug, setSlug] = useState("");
	const [greenToast, setGreenToast] = useState("");
	const [greenToastSpinner, setGreenToastSpinner] = useState("");
	const [redToast, setRedToast] = useState("");
	const [redToastSpinner, setRedToastSpinner] = useState("");
	const router = useRouter();
	const checkboxRef = useRef();
	const inputFileRef = useRef();

	useEffect(() => {
		fetchData();
	}, []);

	// CHECK IF USER IS ADMIN OR JUST LOGGED USER____________________________________
	const sessionType = async () => {
		const res = await fetch(`${process.env.NEXT_PUBLIC_NEXT_APIURL}/api/auth/check-admin-auth`);

		if (!res.ok) {
			router.push("/acceso-denegado");
		}
	};
	useEffect(()=>{
		sessionType();
	} ,[]);

	// FETCH DATA____________________________________________________________________
	const fetchData = async () => {
		setRedToast("");
		setGreenToast("Estamos cargando tu producto, espera un momento");
		setGreenToastSpinner(<Spinner animation="grow" className="spinner-grow-size" />);
		document.getElementById("toast").scrollIntoView({ behavior: "smooth" });

		if (id) {
			try {
				const res = await fetch(
					`${process.env.NEXT_PUBLIC_NEXT_APIURL}/api/editar-producto`,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({ id }),
					}
				);
				if (!res.ok) {
					const errorData = await res.json();
					throw new Error(errorData.message);
				}

				const { data } = await res.json();

				setTitle(data.title);
				setDescription(data.description);
				setPrice(data.price);
				setSlug(data.slug);
				setStock(data.stock);
				setImageUrl(data.images[0].url);
				setGreenToast("Producto listo para edición");
				setGreenToastSpinner(<GrStatusGood />);
			} catch (error) {
				console.log(error);
				setRedToast(error.message);
				setRedToastSpinner(<BiError />);
			}
		}
	};

	// CREATING SLUG FROM TITLE_______________________________________________________
	const handleTitleChange = (event) => {
		const newTitle = event.target.value
			.trim()
			.toLowerCase()
			.replace(/\s+/g, "-");
		setTitle(event.target.value);
		setSlug(newTitle);
	};

	// HANDLE SUBMIT_________________________________________________________________
	const handleSubmit = async (event) => {
		setRedToast("");
		setGreenToast("Estamos subiendo los cambios, espera un momento");
		setGreenToastSpinner(<Spinner animation="grow" className="spinner-grow-size" />);
		event.preventDefault();

		const formData = new FormData();
		formData.append("id", id);
		formData.append("title", title);
		formData.append("description", description);
		formData.append("price", price);
		formData.append("stock", stock);
		formData.append("slug", slug);
		{
			images
				? formData.append("file", images)
				: formData.append("empty", images);
		}
		formData.append(
			"upload_preset",
			process.env.NEXT_PUBLIC_UPLOAD_PRESET_NAME
		);
		formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_KEY);

		let errorData;

		try {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_NEXT_APIURL}/api/editar-producto`,
				{
					method: "PUT",
					body: formData,
				}
			);

			if (!res.ok) {
				errorData = await res.json();
				throw new Error(errorData.message);
			}

			setGreenToast("Cambios realizados con éxito");
			setGreenToastSpinner(<GrStatusGood />);
			setTimeout(() => {
				setGreenToast("");
				setGreenToastSpinner("");
			}, 3000);
		} catch (error) {
			setGreenToast("");
			setGreenToastSpinner("");
			setRedToast(
				errorData ? errorData.message : "Error al editar el producto"
			);
			setRedToastSpinner(<BiError />);
			console.error(error);
		}
	};

	return (
		<main className="main-container-editor">
			<section className="main-section-editor">
					<div className="title-and-logo-div-editor">
						<Image
							src="/img/logo-original-recortado.png"
							width={500}
							height={500}
							alt="logo de Grupo 7"
							className="logo-editor"
						/>
						<h1 className="h1-page">Editar Producto</h1>
					</div>
				<form onSubmit={handleSubmit} className="form-editor">
					<label htmlFor="title">Nombre</label>
					<input
						type="text"
						id="title"
						name="title"
						value={title}
						onChange={handleTitleChange}
						required
					/>
					<label htmlFor="description">Descripción</label>
					<textarea
						type="text"
						id="description"
						name="description"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						required
					/>
					<label htmlFor="price">Precio</label>
					<input
						type="number"
						step="100"
						id="price"
						name="price"
						value={price}
						onChange={(e) => setPrice(e.target.value)}
						required
					/>
					<div
						style={{
							display: "flex",
							gap: "1rem",
							width: "100%",
							justifyContent: "flex-start",
						}}
					>
						<div className="checkbox-cont">
							<label htmlFor="stock" className="checkbox-label">
								¿Producto en Disponible?
							</label>
							<div
								className={
									checkboxRef.current?.checked
										? "green-checkbox"
										: "red-checkbox"
								}
							></div>
							<input
								className="hidden"
								type="checkbox"
								id="stock"
								name="stock"
								checked={stock}
								ref={checkboxRef}
								onChange={(e) => {
									setStock(e.target.checked);
									console.log(e.target.checked);
								}}
							/>
						</div>
					</div>

					<div className="img-preview-cont-add-editor">
						<button
							type="button"
							className="link-button"
							onClick={() => inputFileRef.current?.click()}
						>
							<IoMdAddCircleOutline className="svg" />
							Seleccionar nueva imagen
						</button>
						{imageUrl && (
							<Image
								src={imageUrl}
								width={1000}
								height={1000}
								alt={`Imagen de Producto ${title}`}
								className="img-preview-add-editor"
							/>
						)}
						<p className="text-center">
							{images?.length === 0
								? "Aún no has seleccionado ningún archivo"
								: "1 archivo seleccionado"}
						</p>
					</div>
					<input
						className="hidden"
						type="file"
						ref={inputFileRef}
						accept="image/*"
						id="images"
						name="images"
						onChange={(e) => {
							setImages(e.target.files[0]);
							setImageUrl(URL.createObjectURL(e.target.files[0]));
						}}
					/>


					<div className="three-button-container">
						<button
							id="toast"
							type="submit"
							className="link-button-success"
						>
							< FaSave className="svg"/>
							Guardar y Subir Cambios
						</button>
						<Link href="/editor/tienda-editor" className="link-button">
							< MdModeEdit className="svg"/>
							Volver al Editor de Tienda
						</Link>
						<Link href="/tienda" className="link-button">
							< FaShoppingBag className="svg"/>
							Volver a la Tienda
						</Link>
					</div>
					{greenToast && <p className="success"> {greenToast}{greenToastSpinner} </p>}
					{redToast && <p className="error"> {redToast}{redToastSpinner} </p>}
				</form>
			</section>
		</main>
	);
}

export default EditarProducto;
