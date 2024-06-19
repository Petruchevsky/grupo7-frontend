"use client";
import Link from "next/link";
import Image from "next/image";
import { React, useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { errorHandler } from "@/app/utils/error-handler";
import { FaSave } from "react-icons/fa";
import { MdHome } from "react-icons/md";
import { MdModeEdit } from "react-icons/md";
import { GrStatusGood } from "react-icons/gr";
import { BiError } from "react-icons/bi";
import { IoMdAddCircleOutline } from "react-icons/io";
import { Spinner } from "react-bootstrap";
import { Fade, Zoom, Bounce } from "react-awesome-reveal";
import Footer from "@/app/components/Footer";

function SliderEditor() {
	const [edit, setEdit] = useState(false);
	const [files, setFiles] = useState([]);
	const [oldID, setOldID] = useState(null);
	const [oldPublicId, setOldPublicId] = useState(null);
	const [isReplacingFile, setIsReplacingFile] = useState(false);
	const [replacingImageId, setReplacingImageId] = useState(null);
	const [PostgreRes, setPostgreRes] = useState([]);
	const [toast, setToast] = useState("");
	const [toastSpinner, setToastSpinner] = useState(null);
	const router = useRouter();
	const inputFileUpload = useRef();
	const inputFileEdit = useRef();

	// GET___________________________________________________________________
	useEffect(() => {
		fetchData();
		setEdit(false);
	}, []);

	// CHECK IF USER IS ADMIN OR JUST LOGGED USER____________________________________
	const sessionType = async () => {
		const res = await fetch(
			`${process.env.NEXT_PUBLIC_NEXT_APIURL}/api/auth/check-admin-auth`
		);

		if (!res.ok) {
			router.push("/acceso-denegado");
		}
	};
	useEffect(()=>{
		sessionType();
	} ,[]);

	//FETCH-DATA___________________________________________________________________
	const fetchData = async () => {
		try {
			setToast("Cargando archivos del slider");
			setToastSpinner(
				<Spinner animation="grow" className="spinner-grow-size" />
			);
			const res = await fetch("/api/slider");
			if (!res.ok) {
				errorHandler(res.status);
				setToast("Error al cargar los archivos, por favor reinicia la página");
				setToastSpinner(<BiError className="svg" />);
				throw new Error(res.statusText);
			}

			const data = await res.json();
			setPostgreRes(data);

			if (data.length === 0) {
				setEdit(false);
				setToast("No hay archivos en el slider");
				setToastSpinner(<BiError className="svg" />);
			} else {
				setEdit(true);
				setToast("Archivos cargados con éxito!");
				setToastSpinner(<GrStatusGood className="svg" />);
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
			setEdit(true);
			setToast("Eliminando imagen");
			setToastSpinner(
				<Spinner animation="grow" className="spinner-grow-size" />
			);
			const res = await fetch(`/api/slider`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ id, url, publicId }),
			});

			if (!res.ok) {
				errorHandler(res.status);
				setToast("Error al eliminar la imagen, por favor intenta de nuevo");
				setToastSpinner(<BiError className="svg" />);
				throw new Error(res.statusText);
			}

			await fetchData();
			if (data.length === 0) {
				setEdit(false);
				setToast("No hay imágenes en el slider");
				setToastSpinner(<BiError className="svg" />);
			} else {
				setToast("Imagen eliminada con éxito!");
				setToastSpinner(<GrStatusGood className="svg" />);
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
			setToast("Por favor selecciona un archivo");
			setToastSpinner(<BiError className="svg" />);

			inputFileUpload.current = document.getElementById("inputFileUpload");
			inputFileUpload.current.value = "";
		}
	};

	//HANDLESUBMIT___________________________________________________________________
	const handleSubmit = async (e) => {
		e.preventDefault();

		if (files.length === 0) {
			setToast("Por favor selecciona un archivo");
			setToastSpinner(<BiError className="svg" />);
			return;
		}

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
				setEdit(true);
				setToast("Subiendo archivos");
				setToastSpinner(
					<Spinner animation="grow" className="spinner-grow-size" />
				);
				const res = await fetch("/api/slider", {
					method: "POST",
					body: formData,
				});

				if (!res.ok) {
					setToast("Error al subir las imágenes, por favor intenta de nuevo");
					setToastSpinner(<BiError className="svg" />);
					throw new Error(res.statusText);
				}

				const { data } = await res.json();
			} catch (error) {
				console.error(error);
			}
		}

		inputFileUpload.current = document.getElementById("inputFileUpload");
		inputFileUpload.current.value = ""; //Codigo para limpiar el input file

		await fetchData();
		setFiles([]);
		setEdit(false);
		setEdit(true);
		setToast("Datos subidos con éxito!");
		setToastSpinner(<GrStatusGood className="svg" />);
		return;
	};

	//PREPARING FOR REPLACING___________________________________________________________________
	const preparingForReplacing = async (id, url, publicId) => {
		document.getElementById("toast").scrollIntoView({ behavior: "smooth" });
		setIsReplacingFile(true); //Para condicionar la classNAme de la imagen que se está reemplazando
		setReplacingImageId(id); //Para que la className "blur" se aplique solo a la imagen que se está reemplazando
		setOldID(id);
		setOldPublicId(publicId);
		setEdit(true);
		setToast("Esperando nuevo archivo");
		setToastSpinner(<Spinner animation="grow" className="spinner-grow-size" />);
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
				setEdit(true);
				setToast("Reemplazando archivo");
				setToastSpinner(
					<Spinner animation="grow" className="spinner-grow-size" />
				);
				const res = await fetch("/api/slider", {
					method: "PUT",
					body: formData,
				});

				if (!res.ok) {
					setToast(
						"Error al reemplazar la imagen antigua, por favor intenta de nuevo"
					);
					setToastSpinner(<BiError className="svg" />);
					throw new Error(res.statusText);
				}

				const { data } = await res.json();
			} catch (error) {
				console.error(error);
			}
		}

		fetchData();
		setFiles([]);
		setEdit(false);
		setEdit(true);
		setToast("Slider actualizado con éxito!");
		setToastSpinner(<GrStatusGood className="svg" />);
		setIsReplacingFile(false);
		setReplacingImageId(null);
		return;
	};

	//CANCEL-REPLACING___________________________________________________________________
	const cancelReplacing = () => {
		setIsReplacingFile(false);
		setReplacingImageId(null);
		setEdit(false);
	};

	//HANDLE CLICK SELECCIONAR ARCHIVOS___________________________________________________________________
	const handleClickSeleccionarArchivos = () => {
		inputFileUpload.current = document.getElementById("inputFileUpload");
		inputFileUpload.current.click();
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
			return "Aun no has seleccionado ningún archivo";
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
								alt="logo de Orlando Rojas"
								className="logo-editor"
							/>
						</Zoom>
						<Zoom>
							<h1 className="h1-page text-right">Editor de Slider Principal</h1>
						</Zoom>
					</div>

					{/* SI NO HAY DATA MOSTRAMOS EL TOAST */}
					<Bounce className="w-100">
						<div className="current-imgs-container-editor">
							{!PostgreRes.length && !edit ? (
								<div className="error-div m-auto">
									<Bounce className="w-100">
										<p className="error error-editor">
											{toast}
											{toastSpinner}
										</p>
									</Bounce>
								</div>
							) : (
								PostgreRes.map((image) => {
									const { id, url, publicId, fileType } = image;
									return fileType === "image" ? (
										<div key={id} className="current-img-div-editor">
											<Image
												src={url}
												width={2000}
												height={2000}
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
												accept="image/*, video/*"
												onChange={(e) => {
													setFiles(e.target.files);
													document
														.getElementById("toast")
														.scrollIntoView({ behavior: "smooth" });
												}}
											/>

											{replacingImageId === id && isReplacingFile && (
												<button
													onClick={cancelReplacing}
													className="cancel-btn"
												>
													Cancelar Edición
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
									) : (
										<div key={id} className="current-img-div-editor">
											<video
												src={url}
												width={2000}
												height={2000}
												autoPlay
												muted
												loop
												className={
													isReplacingFile && id === replacingImageId
														? "blur"
														: "img-editor"
												}
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
												accept="image/*, video/*"
												onChange={(e) => {
													setFiles(e.target.files);
													document
														.getElementById("toast")
														.scrollIntoView({ behavior: "smooth" });
												}}
											/>
											{replacingImageId === id && isReplacingFile && (
												<button
													onClick={cancelReplacing}
													className="cancel-btn"
												>
													Cancelar Edición
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
								})
							)}
						</div>
					</Bounce>

					<form
						onSubmit={isReplacingFile ? replaceFile : handleSubmit}
						className="form-editor"
					>
						<Zoom cascade damping={0.2} delay={300} className="w-100 text-l">
							<input
								className="hidden"
								id="inputFileUpload"
								ref={inputFileUpload}
								accept="image/*, video/*"
								type="file"
								onChange={(e) => {
									setFiles(e.target.files);
								}}
								onClick={() => setEdit(false)}
								multiple
							/>
							<div className="btn-and-file-list-div">
								<button
									className="link-button"
									onClick={handleClickSeleccionarArchivos}
									type="button"
								>
									<IoMdAddCircleOutline className="svg" />
									Seleccionar Imágenes o Videos
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
											if (file.type.includes("image")) {
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
											} else {
												return (
													<div key={index} className="img-preview-div">
														<video
															src={URL.createObjectURL(file)}
															width={200}
															height={200}
															autoPlay
															loop
															muted
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
											}
										})}
									</div>
								</div>
							)}
						</section>

						<div className="w-100">
							<Bounce>
								<div className="button-container">
									<button
										className={
											files.length === 0
												? "btn-disabled"
												: "link-button-success"
										}
										type="submit"
										id="toast"
									>
										<FaSave />
										Guardar Cambios
									</button>
									<Link href="/" className="link-button">
										<MdHome />
										Volver al Inicio
									</Link>
								</div>
							</Bounce>
						</div>

						{edit && (
							<Bounce className="text-center m-auto w-100">
								<p className="success">
									{toast}
									{toastSpinner}
								</p>
							</Bounce>
						)}
					</form>
				</div>
				<Footer />
			</main>
		</Fade>
	);
}

export default SliderEditor;
