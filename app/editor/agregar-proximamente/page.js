"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Spinner } from "react-bootstrap";
import { FaSave } from "react-icons/fa";
import { CgPlayTrackNextO } from "react-icons/cg";
import { MdModeEdit } from "react-icons/md";
import { GrStatusGood } from "react-icons/gr";
import { BiError } from "react-icons/bi";
import { IoMdAddCircleOutline } from "react-icons/io";
import "@/app/editor/agregar-producto/agregar-producto.css";

function AgregarProximamente() {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [releaseDate, setReleaseDate] = useState("");
	const [images, setImages] = useState(null);
	const [imageUrl, setImageUrl] = useState(null);
	const [greenToast, setGreenToast] = useState("");
	const [greenToastSpinner, setGreenToastSpinner] = useState("");
	const [redToast, setRedToast] = useState("");
	const [redToastSpinner, setRedToastSpinner] = useState("");
	const router = useRouter();
	const inputFileRef = useRef();

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

	// HANDLE SUBMIT_________________________________________________________________
	const handleSubmit = async (event) => {
		setRedToast("");
		setRedToastSpinner("");
		setGreenToast("Estamos subiendo tu nuevo producto");
		setGreenToastSpinner(<Spinner animation="border" variant="success" />);
		event.preventDefault();

		const formData = new FormData();
		formData.append("title", title);
		formData.append("description", description);
		formData.append("releaseDate", releaseDate);
		formData.append("file", images);
		formData.append(
			"upload_preset",
			process.env.NEXT_PUBLIC_UPLOAD_PRESET_NAME
		);
		formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_KEY);

		let errorData;

		try {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_NEXT_APIURL}/api/proximamente`,
				{
					method: "POST",
					body: formData,
				}
			);

			if (!res.ok) {
				errorData = await res.json();
				throw new Error(errorData.message);
			}

			const data = await res.json();
			setGreenToast(data.message);
			setGreenToastSpinner(<GrStatusGood className="svg" />);
			setTitle("");
			setDescription("");
			setReleaseDate("");
			setImages(null);
			setImages(null);
			fileInputRef.current.value = "";
			setTimeout(() => {
				setGreenToast("");
				setGreenToastSpinner("");
			}, 4000);
		} catch (error) {
			setGreenToast("");
			setGreenToastSpinner("");
			setRedToast(errorData ? errorData.message : "Error al subir el producto");
			setRedToastSpinner(<BiError className="svg" />);
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
					<label htmlFor="title">Nombre del Producto</label>
					<input
						type="text"
						id="title"
						name="title"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
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
					<label htmlFor="releaseDate">Fecha estimada de Lanzamiento</label>
					<input
						type="text"
						id="releaseDate"
						name="releaseDate"
						value={releaseDate}
						onChange={(e) => setReleaseDate(e.target.value)}
						required
					/>
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
						<Link href="/editor/proximamente-editor" className="link-button">
							<MdModeEdit className="svg" />
							Volver al Editor
						</Link>
						<Link href="/proximamente" className="link-button">
							<CgPlayTrackNextO className="svg" />
							Volver a Proximamente
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

export default AgregarProximamente;
