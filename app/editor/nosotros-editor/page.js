"use client";
import { useEffect, useState } from "react";
import Footer from "@/app/components/Footer";
import React from "react";
import { FaSave } from "react-icons/fa";
import { IoInformationCircleOutline } from "react-icons/io5";
import { MdModeEdit } from "react-icons/md";
import { GrStatusGood } from "react-icons/gr";
import { BiError } from "react-icons/bi";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Fade, Zoom } from "react-awesome-reveal";
import { Spinner } from "react-bootstrap";
import { errorHandler } from "@/app/utils/error-handler";


function NosotrosEditor() {
	const [PostgreRes, setPostgreRes] = useState();
	const [existData, setExistData] = useState();
	const [description, setDescription] = useState(null);
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
	const inputFileUpload = React.useRef();
	const inputFileEdit = React.useRef();
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
			setGreenToast("Cargando imágenes y textos...");
			setGreenToastSpinner(<Spinner animation="grow" className="spinner-grow-size" />);
			const res = await fetch("/api/nosotros");
			if (!res.ok) {
				setGreenToast("");
				setGreenToastSpinner("");
				setExistData(false);
				errorHandler(res.status);
				setRedToast("Error al cargar los datos, por favor reinicia la página");
				setRedToastSpinner(<BiError className="svg" />);

				throw new Error(res.statusText);
			}

			const { data } = await res.json();
			setExistData(true);
			setPostgreRes(data);
			setDescription(data.description);
			setImages(data.images);
			setFiles([]);

			console.log(data.images.length);

			if (data.images.length === 0) {
				setGreenToast("");
				setGreenToastSpinner("");
				setExistData(false);
				setRedToast("No hay imágenes para mostrar");
				setRedToastSpinner(<BiError className="svg" />);
				setEnabledButton(false);
			}

			if (data.isEmpty) {
				setRedToast("Nada en la sección Nosotros por ahora.");
				setRedToastSpinner(<BiError className="svg" />);
				setEnabledButton(false);
			}

			if (data.images.length > 0) {
				setGreenToast("Datos cargados con éxito!");
				setGreenToastSpinner(<GrStatusGood className="svg" />);
				setEnabledButton(false);
			}

			return PostgreRes;
		} catch (error) {
			console.error(error);
		}
	};

	//DELETE FILE___________________________________________________________________
	const deleteFile = async (id, url, publicId) => {
		document.getElementById("toast").scrollIntoView({ behavior: "smooth" });
		try {
			setGreenToast("Eliminando imagen");
			setGreenToastSpinner(<Spinner animation="grow" className="spinner-grow-size" />);
			const res = await fetch(`/api/nosotros`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ id, url, publicId }),
			});

			if (!res.ok) {
				errorHandler(res.status);
				setRedToast("Error al eliminar la imagen, por favor intenta de nuevo");
				setRedToastSpinner(<BiError className="svg" />);
				throw new Error(res.statusText);
			}

			await fetchData();
			console.log(images.length);

			if (images.length - 1 === 0) {
				setGreenToast("");
				setGreenToastSpinner("");
				setRedToast("No hay imágenes para mostrar");
				setRedToastSpinner(<BiError className="svg" />);
				setEnabledButton(false);
			} else {
				setGreenToast("Imagen eliminada con éxito!");
				setGreenToastSpinner(<GrStatusGood className="svg" />);
				setEnabledButton(false);
			}
		} catch (error) {
			console.error(error);
		}

		setTimeout(() => {
			inputFileEdit.current = document.getElementById("inputFileEdit");
			inputFileUpload.current = document.getElementById("inputFileUpload");
			inputFileUpload.current.value = "";
		}, 0);
	};

	//DELETE-FILE-FROM-PREVIEW___________________________________________________________________
	const deleteFileFromPreview = (index) => {
		const newFiles = Array.from(files).filter((file, i) => i !== index);
		setFiles(newFiles);
		if (newFiles.length === 0) {
			setRedToast("Por favor selecciona un archivo");
			setRedToastSpinner(<BiError className="svg" />);

			inputFileUpload.current = document.getElementById("inputFileUpload");
			inputFileUpload.current.value = "";
		}
	};

	//HANDLESUBMIT___________________________________________________________________
	const handleSubmit = async (e) => {
		e.preventDefault();

		console.log(files.length, description, PostgreRes.description);
		console.log(files.length > 0);
		console.log(description !== PostgreRes.description);

		//FOTO Y TEXTO **************************************
		if (files.length > 0 && description !== PostgreRes.description) {
			const formDataArray = Array.from(files).map((file) => {
				const formData = new FormData();
				formData.append("file", file);
				formData.append(
					"upload_preset",
					process.env.NEXT_PUBLIC_UPLOAD_PRESET_NAME
				);
				formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_KEY);
				formData.append("description", description);
				return formData;
			});

			for (const formData of formDataArray) {
				try {
					setGreenToast("Subiendo archivos y texto");
					setGreenToastSpinner(<Spinner animation="grow" className="spinner-grow-size" />);
					const res = await fetch("/api/nosotros", {
						method: "POST",
						body: formData,
					});

					if (!res.ok) {
						setRedToast(
							"Error al subir las imágenes o el texto, por favor intenta de nuevo"
						);
						setRedToastSpinner(<BiError className="svg" />);
						throw new Error(res.statusText);
					}
				} catch (error) {
					console.error(error);
				}
			}
			await fetchData();
			return;
		}

		//SOLO FOTO ******************************************************************
		if (files.length > 0 && description === PostgreRes.description) {
			const formDataArray = Array.from(files).map((file) => {
				const formData = new FormData();
				formData.append("file", file);
				formData.append(
					"upload_preset",
					process.env.NEXT_PUBLIC_UPLOAD_PRESET_NAME
				);
				formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_KEY);
				return formData;
			});

			for (const formData of formDataArray) {
				try {
					setGreenToast("Subiendo imagen(es)");
					setGreenToastSpinner(<Spinner animation="grow" className="spinner-grow-size" />);
					const res = await fetch("/api/nosotros", {
						method: "POST",
						body: formData,
					});

					if (!res.ok) {
						setRedToast(
							"Error al subir las imágenes, por favor intenta de nuevo"
						);
						setRedToastSpinner(<BiError className="svg" />);
						throw new Error(res.statusText);
					}
				} catch (error) {
					console.error(error);
				}
			}
			await fetchData();
			return;
		}

		//SOLO TEXTO *****************************************************************
		if (files.length === 0 && description !== PostgreRes.description) {
			try {
				setGreenToast("Subiendo cambios en el texto");
				setGreenToastSpinner(<Spinner animation="grow" className="spinner-grow-size" />);
				const formData = new FormData();
				formData.append("description", description);

				const res = await fetch("/api/nosotros", {
					method: "POST",
					body: formData,
				});
				if (!res.ok) {
					setRedToast(
						"Error al subir la descripción, por favor intenta de nuevo"
					);
					setRedToastSpinner(<BiError className="svg" />);
					errorHandler(res.status);
					throw new Error(res.statusText);
				}
			} catch (error) {
				console.error(error);
			}
			await fetchData();
			return;
		}
	};

	//PREPARING FOR REPLACING___________________________________________________________________
	const preparingForReplacing = async (id, url, publicId) => {
		document.getElementById("toast").scrollIntoView({ behavior: "smooth" });
		setIsReplacingFile(true); //Para condicionar la className de la imagen que se está reemplazando
		setReplacingImageId(id); //Para que la className "blur" se aplique solo a la imagen que se está reemplazando
		setOldID(id);
		setOldPublicId(publicId);
		setGreenToast("Esperando nueva imagen");
		setGreenToastSpinner(<Spinner animation="grow" className="spinner-grow-size" />);
		if (inputFileEdit.current) {
			inputFileEdit.current.click();
		}
	};

	//REPLACE-FILE___________________________________________________________________
	const replaceFile = async (e) => {
		e.preventDefault();
		document.getElementById("toast").scrollIntoView({ behavior: "smooth" });
		const formDataArray = Array.from(files).map((file) => {
			const formData = new FormData();
			formData.append("file", file);
			formData.append(
				"upload_preset",
				process.env.NEXT_PUBLIC_UPLOAD_PRESET_NAME
			);
			formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_KEY);
			formData.append("oldID", parseInt(oldID));
			formData.append("oldPublicId", oldPublicId);
			return formData;
		});

		for (const formData of formDataArray) {
			try {
				setGreenToast("Reemplazando imagen");
				setGreenToastSpinner(<Spinner animation="grow" className="spinner-grow-size" />);
				const res = await fetch("/api/nosotros", {
					method: "PUT",
					body: formData,
				});

				if (!res.ok) {
					errorHandler(res.status);
					setRedToast(
						"Error al reemplazar la imagen antigua, por favor intenta de nuevo"
					);
					setRedToastSpinner(<BiError className="svg" />);
					throw new Error(res.statusText);
				}
			} catch (error) {
				console.error(error);
			}
		}

		await fetchData();
		setFiles([]);
		setGreenToast("Imagen reemplazada con éxito!");
		setGreenToastSpinner(<GrStatusGood className="svg" />);
		setIsReplacingFile(false);
		setReplacingImageId(null);
		return;
	};

	//CANCEL-REPLACING___________________________________________________________________
	const cancelReplacing = () => {
		setIsReplacingFile(false);
		setReplacingImageId(null);
		setGreenToast("");
		return;
	};

	//HANDLE CLICK SELECCIONAR ARCHIVOS___________________________________________________________________
	const handleClickSeleccionarArchivos = () => {
		inputFileUpload.current = document.getElementById("inputFileUpload");
		inputFileUpload.current.click();
		setGreenToast("");
		setRedToast("");
	};

	//ARCHIVOS LISTOS PARA SUBIR___________________________________________________________________
	const archivosListosParaSubir = () => {
		if (files) {
			return (
				<div className="selected-file-list-div">
					<h1 style={{ textAlign: "center" }}>
						{Array.from(files).length === 1
							? "1 archivo seleccionado"
							: Array.from(files).length + " archivos seleccionados"}
					</h1>
					<ul className="selected-file-list">
						{Array.from(files).map((file, index) => {
							const { name } = file;
							return <li key={index}>{name}</li>;
						})}
					</ul>
				</div>
			);
		} else {
			return "Aún no has seleccionado ningún archivo";
		}
	};

	//RETURN___________________________________________________________________
	return (
		<Fade duration={3000}>
			<main className="main-container-editor">
				<div className="main-section-editor">
					<div className="title-and-logo-div-editor">
						<Zoom cascade damping={0.2} delay={300}>
							<Image
								src="/img/logo-original-recortado.png"
								width={500}
								height={500}
								alt="logo de Grupo 7"
								className="logo-editor"
							/>
							<h1 className="h1-page">Editor Sección Nosotros</h1>
						</Zoom>
					</div>
					
					<div className="current-imgs-container-editor">
						{PostgreRes?.images.map((image) => {
							const { id, url, publicId } = image;
							return (
								<div key={publicId} className="current-img-div-editor">
									<Image
										src={url}
										width={200}
										height={200}
										alt="imagen actual"
										className={
											isReplacingFile && id === replacingImageId
												? "blur"
												: "img-editor"
										} // Aplica la clase "blur" solo a la imagen que se está reemplazando
									/>
						
									<MdModeEdit
										onClick={() => preparingForReplacing(id, url, publicId)}
										className="edit-btn"
									/>
						
									<input
										id="inputFileEdit"
										type="file"
										className="hidden"
										ref={inputFileEdit}
										accept="image/*"
										onChange={(e) => {
											setFiles(e.target.files);
											document
												.getElementById("toast")
												.scrollIntoView({ behavior: "smooth" });
											setEnabledButton(true);
										}}
									/>
						
									{replacingImageId === id && isReplacingFile && (
										<button onClick={cancelReplacing} className="cancel-btn">
											Cancelar
										</button>
									)}
						
									<button
										type="button"
										className="x-btn"
										onClick={() => deleteFile(id, url, publicId)}
									>
										x
									</button>
								</div>
							);
						})}
					</div>

					<form onSubmit={isReplacingFile ? replaceFile : handleSubmit} className="form-editor">
						<Zoom cascade damping={0.2} delay={300} className="w-100 text-l">
							<textarea
								value={description}
								placeholder="Escribe aquí la descripción de la sección Nosotros..."
								onChange={(e) => {
									setDescription(e.target.value);
									setEnabledButton(true);
								}}
							/>
							<input
								className="hidden"
								id="inputFileUpload"
								ref={inputFileUpload}
								accept="image/*"
								type="file"
								onChange={(e) => {
									setFiles(e.target.files);
									setEnabledButton(true);
								}}
								multiple
							/>
							<div className="btn-and-file-list-div">
								<button
									className="link-button"
									onClick={handleClickSeleccionarArchivos}
									type="button"
								>
									Seleccionar Imágenes
								</button>
								<p className="paragraph">
									{files && files.length === 0
										? "Aún no has seleccionado ningún archivo"
										: archivosListosParaSubir()}
								</p>
							</div>
						</Zoom>

						<section className="w-100">
							{files.length > 0 && (
								<div className="file-preview-container">
									<h1>Archivos listos para subir</h1>

									<div className="file-preview-imgs-div">
										{Array.from(files).map((file, index) => {
											return (
												<div key={index} className="file-preview-img-div">
													<Image
														src={URL.createObjectURL(file)}
														width={200}
														height={200}
														alt="preview"
														className="file-preview-img"
													/>
													<button
														type="button"
														className="x-btn"
														onClick={() => deleteFileFromPreview(index)}
													>
														x
													</button>
												</div>
											);
										})}
									</div>
								</div>
							)}
						</section>

						<div className="button-container">
							<button
								className={
									!enabledButton ? "btn-disabled" : "link-button-success"
								}
								type="submit"
								id="toast"
							>
								<FaSave />
								Guardar Cambios
							</button>
							<Link href="/nosotros" className="link-button">
							<IoInformationCircleOutline />
								Volver a Nosotros
							</Link>
						</div>
						{greenToast && (
							<Zoom style={{ width: "100%" }}>
								<p className="success">
									{greenToast}
									{greenToastSpinner}
								</p>
							</Zoom>
						)}
						{redToast && (
							<Zoom style={{ width: "100%" }}>
								<p className="error">
									{redToast}
									{redToastSpinner}
								</p>
							</Zoom>
						)}
					</form>
				</div>
			</main>
			<Footer />
		</Fade>
	);
}

export default NosotrosEditor;
