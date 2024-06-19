"use client";
import React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./tips-editor.css";
import Footer from "@/app/components/Footer";
import Link from "next/link";
import Image from "next/image";
import { Fade, Zoom, Bounce, Slide } from "react-awesome-reveal";
import { errorHandler } from "@/app/utils/error-handler";
import { GrStatusGood } from "react-icons/gr";
import { BiError } from "react-icons/bi";
import { IoMdAddCircleOutline } from "react-icons/io";
import { MdOutlineTipsAndUpdates } from "react-icons/md";
import { Spinner } from "react-bootstrap";

function TipsEditor() {
	const [PostgreRes, setPostgreRes] = useState(null);
	const [existData, setExistData] = useState(false);
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [createdby, setCreatedBy] = useState("");
	const [images, setImages] = useState([]);
	const [files, setFiles] = useState([]);
	const [redToast, setRedToast] = useState("");
	const [redToastSpinner, setRedToastSpinner] = useState("");
	const [greenToast, setGreenToast] = useState("");
	const [greenToastSpinner, setGreenToastSpinner] = useState("");
	const [enabledButton, setEnabledButton] = useState(false);
	const router = useRouter();
	const inputFileUpload = React.useRef();
	const inputFileEdit = React.useRef();

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

	// GET_________________________________________________________________________
	useEffect(() => {
		fetchData();
	}, []);

	//FETCH-DATA___________________________________________________________________
	const fetchData = async () => {
		try {
			setExistData(true);
			setRedToast("");
			setRedToastSpinner("");
			setGreenToast("Cargando todos los tips");
			setGreenToastSpinner(<Spinner animation="grow" className="spinner-grow-size" />);
			const res = await fetch("/api/tips", { cache: "no-store" });

			if (!res.ok) {
				const errorData = await res.json();
				setGreenToast("");
				setGreenToastSpinner("");
				errorHandler(res.status);
				setRedToast("Error al cargar los tips, por favor reinicia la página");
				setRedToastSpinner(<BiError className="svg" />);
				throw new Error(errorData.message);
			}

			const { data } = await res.json();
			setRedToast("");
			setRedToastSpinner("");
			setGreenToast(data.message);
			setGreenToastSpinner(<GrStatusGood className="svg" />);
			setExistData(true);
			setPostgreRes(data);
			setTitle(data.title);
			setDescription(data.description);
			setCreatedBy(data.createdBy);
			setImages(data.images);
			setFiles([]);

			if (data.isEmpty) {
				setGreenToast("");
				setGreenToastSpinner("");
				setRedToast(data.message);
				setRedToastSpinner(<BiError className="svg" />);
				setEnabledButton(false);
			}

			if (data.tips.length > 0) {
				setGreenToast(data.message);
				setGreenToastSpinner(<GrStatusGood className="svg" />);
				setEnabledButton(false);
			}

			return PostgreRes;
		} catch (error) {
			console.error(error);
		}
	};

	//DELETE TIP
	const deleteProduct = async (id, image) => {
		document.getElementById("toast").scrollIntoView({ behavior: "smooth" });
		try {
			const imageId = image.id;
			const url = image.url;
			const publicId = image.publicId;
			setRedToast("");
			setRedToastSpinner("");
			setGreenToast("Eliminando tip, espera un momento...");
			setGreenToastSpinner(
				<Spinner animation="grow" className="spinner-grow-size" />
			);
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_NEXT_APIURL}/api/tips`,
				{
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ id, imageId, publicId, url }),
				}
			);

			if (!res.ok) {
				const errorData = await res.json();
				setGreenToast("");
				setGreenToastSpinner("");
				errorHandler(res.status);
				setRedToast(errorData.message);
				setRedToastSpinner(<BiError className="svg" />);
				throw new Error(errorData.message);
			}

			await fetchData();
		} catch (error) {
			console.error(error);
		}
	};

	//RETURN___________________________________________________________________
	return (
		<Fade duration={3000}>
			<main className="main-container-editor ">
				<div className="main-section-editor">
					<div className="title-and-logo-div-editor">
						<Zoom>
							<Image
								src="/img/logo-original-recortado.png"
								width={500}
								height={500}
								alt="logo de Grupo 7"
								className="logo-editor"
							/>
						</Zoom>
						<Zoom>
							<h1 className="h1-page">Editor de Sección Tips</h1>
						</Zoom>
					</div>

					<Bounce>
						<div className="tips-cont-editor">
							{PostgreRes?.tips.map((tip) => {
								let { id, title, createdBy, description, createdAt, images } =
									tip;
								createdAt = new Date(createdAt).toLocaleDateString("es-ES", {
									day: "2-digit",
									month: "long",
									year: "numeric",
								});
								return (
									<div key={id} className="tip-div">
										<Image
											src={images[0].url}
											width={300}
											height={300}
											alt={`Imagen de ${title}`}
											className="tip-img"
										/>
										<div className="tip-text-div">
											<h1>{title}</h1>
											<h2>Creador: {createdBy}</h2>
											<p>{createdAt}</p>
										</div>
										<div className="buttons-div-tips-editor">
											<button
												type="button"
												className="link-button-danger"
												onClick={() => deleteProduct(id, images[0])}
											>
												Eliminar
											</button>
											<Link
												href={`/editor/editar-tip/${id}`}
												className="link-button"
											>
												Editar
											</Link>
										</div>
									</div>
								);
							})}
						</div>
					</Bounce>

					<section className="form-editor">
						<div className="button-container">
							<Slide direction="left" className="w-100">
								<Link
									id="toast"
									href="/editor/agregar-tip"
									className="link-button-success"
								>
									<IoMdAddCircleOutline className="svg" />
									Publicar Nuevo Tip
								</Link>
							</Slide>

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
					</section>

				</div>
			</main>
			<Footer />
		</Fade>
	);
}

export default TipsEditor;
