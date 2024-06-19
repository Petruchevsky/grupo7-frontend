"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Spinner } from "react-bootstrap";
import { FaSave } from "react-icons/fa";
import { MdModeEdit } from "react-icons/md";
import { GrStatusGood } from "react-icons/gr";
import { BiError } from "react-icons/bi";
import { IoMdAddCircleOutline } from "react-icons/io";
import { MdOutlineTipsAndUpdates } from "react-icons/md";
import { Bounce, Slide } from "react-awesome-reveal";
import "./editar-tip.css";

function EditarTip({ params }) {
	const { id } = params;

	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [createdBy, setCreatedBy] = useState("");
	const [images, setImages] = useState(null);
	const [imageUrl, setImageUrl] = useState(null);
	const [slug, setSlug] = useState("");
	const [greenToast, setGreenToast] = useState("");
	const [greenToastSpinner, setGreenToastSpinner] = useState("");
	const [redToast, setRedToast] = useState("");
	const [redToastSpinner, setRedToastSpinner] = useState("");
	const router = useRouter();
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
		setRedToastSpinner("");
		setGreenToast("Estamos cargando tu tip");
		setGreenToastSpinner(
			<Spinner animation="grow" className="spinner-grow-size" />
		);
		document.getElementById("toast").scrollIntoView({ behavior: "smooth" });

		if (id) {
			try {
				const res = await fetch(
					`${process.env.NEXT_PUBLIC_NEXT_APIURL}/api/editar-tip`,
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
				setCreatedBy(data.createdBy);
				setSlug(data.slug);
				setImageUrl(data.images[0].url);
				setGreenToast("Tip listo para edición");
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
			.replace(/\s+/g, "-")
			.replace(/[áä]/g, "a")
			.replace(/[éë]/g, "e")
			.replace(/[íï]/g, "i")
			.replace(/[óö]/g, "o")
			.replace(/[úü]/g, "u");
		setTitle(event.target.value);
		setSlug(newTitle);
	};

	// HANDLE SUBMIT_________________________________________________________________
	const handleSubmit = async (event) => {
		setRedToast("");
		setRedToastSpinner("");
		setGreenToast("Estamos subiendo los cambios");
		setGreenToastSpinner(
			<Spinner animation="grow" className="spinner-grow-size" />
		);
		event.preventDefault();

		const formData = new FormData();
		formData.append("id", id);
		formData.append("title", title);
		formData.append("description", description);
		formData.append("createdBy", createdBy);
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
				`${process.env.NEXT_PUBLIC_NEXT_APIURL}/api/editar-tip`,
				{
					method: "PUT",
					body: formData,
				}
			);

			if (!res.ok) {
				errorData = await res.json();
				throw new Error(errorData.message);
			}

			const data = await res.json();
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
				errorData
					? errorData.message
					: "Error al editar el tip, por favor intenta de nuevo"
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
					<h1 className="h1-page">Editar Tip</h1>
				</div>

				<form onSubmit={handleSubmit} className="form-editor">
					<label htmlFor="title">Título</label>
					<input
						type="text"
						id="title"
						name="title"
						value={title}
						onChange={handleTitleChange}
						required
					/>
					<label htmlFor="description">Post o Artículo</label>
					<textarea
						type="text"
						id="description"
						name="description"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						required
					/>
					<label htmlFor="createdBy">Creado por</label>
					<input
						type="text"
						id="createdBy"
						name="createdBy"
						value={createdBy}
						onChange={(e) => setCreatedBy(e.target.value)}
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
						<Slide direction="left" className="w-100">
							<button id="toast" type="submit" className="link-button-success">
								<FaSave className="svg" />
								Guardar y Subir Cambios
							</button>
						</Slide>

						<Bounce className="w-100">
							<Link href="/editor/tips-editor" className="link-button">
								<MdModeEdit className="svg" />
								Volver al Editor de Tips
							</Link>
						</Bounce>
						<Slide direction="right" className="w-100">
							<Link href="/blog" className="link-button">
								<MdOutlineTipsAndUpdates />
								Volver a la Sección Tips
							</Link>
						</Slide>
					</div>

					<div className="w-100">
						<Bounce className="w-100">
							{greenToast && (
								<p className="success">
									{" "}
									{greenToast}
									{greenToastSpinner}{" "}
								</p>
							)}
						</Bounce>
					</div>
					<div className="w-100">
						<Bounce className="w-100">
							{redToast && (
								<p className="error">
									{" "}
									{redToast}
									{redToastSpinner}{" "}
								</p>
							)}
						</Bounce>
					</div>
				</form>
			</section>
		</main>
	);
}

export default EditarTip;
