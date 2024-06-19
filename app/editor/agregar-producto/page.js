"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import "./agregar-producto.css";
import Link from "next/link";
import Image from "next/image";
import { Spinner } from "react-bootstrap";
import { FaSave, FaShoppingBag } from "react-icons/fa";
import { MdModeEdit } from "react-icons/md";
import { GrStatusGood } from "react-icons/gr";
import { BiError } from "react-icons/bi";
import { IoMdAddCircleOutline } from "react-icons/io";

function AgregarProducto() {
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
	const inputFileRef = useRef();
	const checkboxRef = useRef();

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
		event.preventDefault();

		if (images.length === 0) {
			setRedToast("Debes seleccionar una imagen para tu producto");
			setRedToastSpinner(<BiError />);
			return;
		}

		setRedToast("");
		setRedToastSpinner("");
		setGreenToast("Estamos subiendo tu producto");
		setGreenToastSpinner(
			<Spinner animation="grow" className="spinner-grow-size" />
		);

		const formData = new FormData();
		formData.append("title", title);
		formData.append("description", description);
		formData.append("price", price);
		formData.append("stock", stock);
		formData.append("slug", slug);
		formData.append("file", images);
		formData.append(
			"upload_preset",
			process.env.NEXT_PUBLIC_UPLOAD_PRESET_NAME
		);
		formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_KEY);

		let errorData;

		try {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_NEXT_APIURL}/api/productos`,
				{
					method: "POST",
					body: formData,
				}
			);

			if (!res.ok) {
				errorData = await res.json();
				throw new Error(errorData.message);
			}

			setGreenToast("Producto subido con éxito");
			setGreenToastSpinner(<GrStatusGood />);
			setTitle("");
			setDescription("");
			setPrice("");
			setStock(true);
			setImages([]);
			setImageUrl(null);
			setSlug("");

			if (inputFileRef.current) {
				inputFileRef.current.value = "";
			}

			setTimeout(() => {
				setGreenToast("");
			}, 5000);
		} catch (error) {
			setGreenToast("");
			setGreenToastSpinner("");
			setRedToast(errorData ? errorData.message : "Error al subir el producto");
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
					<h1 className="h1-page">Agregar Producto</h1>
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
							Seleccionar imagen
						</button>
						{imageUrl && (
							<Image
								src={imageUrl}
								width={300}
								height={300}
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
						<button id="toast" type="submit" className="link-button-success">
							<FaSave className="svg" />
							Guardar y Subir Producto
						</button>
						<Link href="/editor/tienda-editor" className="link-button">
							<MdModeEdit className="svg" />
							Volver al Editor de Tienda
						</Link>
						<Link href="/tienda" className="link-button">
							<FaShoppingBag className="svg" />
							Volver a la Tienda
						</Link>
					</div>

					{greenToast && (
						<p className="success">
							{" "}
							{greenToast}
							{greenToastSpinner}{" "}
						</p>
					)}
					{redToast && (
						<p className="error">
							{" "}
							{redToast}
							{redToastSpinner}{" "}
						</p>
					)}
				</form>
			</section>
		</main>
	);
}

export default AgregarProducto;
