"use client";
import Footer from "@/app/components/Footer";
import { React, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { errorHandler } from "@/app/utils/error-handler";
import { IoMdAddCircleOutline } from "react-icons/io";
import { CgPlayTrackNextO } from "react-icons/cg";
import { GrStatusGood } from "react-icons/gr";
import { BiError } from "react-icons/bi";
import { Fade, Zoom } from "react-awesome-reveal";
import { Spinner } from "react-bootstrap";

function ProximamenteEditor() {
	const [PostgreRes, setPostgreRes] = useState(null);
	const [existData, setExistData] = useState(false);
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [images, setImages] = useState([]);
	const [files, setFiles] = useState([]);
	const [oldID, setOldID] = useState(null);
	const [oldPublicId, setOldPublicId] = useState(null);
	const [isReplacingFile, setIsReplacingFile] = useState(false);
	const [replacingImageId, setReplacingImageId] = useState(null);
	const [redToast, setRedToast] = useState("");
	const [redToastSpinner, setRedToastSpinner] = useState("");
	const [greenToast, setGreenToast] = useState("");
	const [greenToastSpinner, setGreenToastSpinner] = useState("");
	const [enabledButton, setEnabledButton] = useState(false);
	const router = useRouter();

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
			setGreenToast("Cargando productos");
			setGreenToastSpinner(
				<Spinner animation="grow" className="spinner-grow-size" />
			);
			const res = await fetch("/api/proximamente");

			if (!res.ok) {
				setGreenToast("");
				setGreenToastSpinner("");
				errorHandler(res.status);
				setRedToast("Error al cargar los datos, por favor reinicia la página");
				setRedToastSpinner(<BiError className="svg" />);
				throw new Error(res.statusText);
			}

			const { data } = await res.json();
			setExistData(true);
			setPostgreRes(data);
			setTitle(data.title);
			setDescription(data.description);
			setImages(data.images);
			setFiles([]);

			if (data.isEmpty) {
				setGreenToast("");
				setRedToast("No hay productos para mostrar");
				setRedToastSpinner(<BiError className="svg" />);
				setEnabledButton(false);
			}

			if (data.products.length > 0) {
				setGreenToast("Productos cargados con éxito!");
				setGreenToastSpinner(<GrStatusGood className="svg" />);
				setEnabledButton(false);
			}

			return PostgreRes;
		} catch (error) {
			console.error(error);
		}
	};

	//DELETE PRODUCT___________________________________________________________________
	const deleteProduct = async (id, image) => {
		document.getElementById("toast").scrollIntoView({ behavior: "smooth" });
		try {
			const imageId = image.id;
			const url = image.url;
			const publicId = image.publicId;
			setRedToast("");
			setRedToastSpinner("");
			setGreenToast("Eliminando producto");
			setGreenToastSpinner(
				<Spinner animation="grow" className="spinner-grow-size" />
			);
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_NEXT_APIURL}/api/proximamente`,
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
				throw new Error(res.statusText);
			}

			await fetchData();
		} catch (error) {
			console.error(error);
		}
	};

	//RETURN___________________________________________________________________
	return (
		<Fade duration={3000}>
			<main className="main-container-editor">
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
							<h1 className="h1-page">Editando Proximamente</h1>
						</Zoom>
					</div>

					<section className="current-imgs-container-editor">
						{!PostgreRes?.products.length ? (
							<h1 className="h1-page form-editor">No hay productos para editar</h1>
						) : (
							PostgreRes?.products.map((product) => {
								let { id, title, description, releaseDate, images } = product;
								
								return (
									<div key={id} className="product-div-prox-editor">
										<Image
											src={images[0].url}
											width={300}
											height={300}
											alt={`Imagen de Producto ${title}`}
											className="img-product-editor"
										/>
										<div className="text-div-prox-editor">
											<h1>{title}</h1>
											<div className="release-date-div">
												<p style={{ margin:"0"}}>Fecha de lanzamiento</p>
												<h2>{releaseDate}</h2>
											</div>
											<p>{description}</p>
										</div>
										<div className="buttons-div-product-editor">
											<button
												type="button"
												className="link-button-danger"
												onClick={() => deleteProduct(id, images[0])}
											>
												Eliminar
											</button>
											<Link
												href={`/editor/editar-proximamente/${id}`}
												className="link-button"
											>
												Editar
											</Link>
										</div>
									</div>
								);
							})
						)}
					</section>

					<section className="form-editor">
						<div className="button-container">
							<Link href="/proximamente" className="link-button">
								<CgPlayTrackNextO />
								Volver a Proximamente
							</Link>
							<Link
								id="toast"
								href="/editor/agregar-proximamente"
								className="link-button-success"
							>
								<IoMdAddCircleOutline />
								Agregar Nuevo Producto
							</Link>
						</div>
						
						{greenToast && <p className="success"> {greenToast}{greenToastSpinner} </p>}
						{redToast && <p className="error error-editor"> {redToast}{redToastSpinner} </p>}
					</section>
				</div>
			</main>
			<Footer />	
		</Fade>
	);
}

export default ProximamenteEditor;
