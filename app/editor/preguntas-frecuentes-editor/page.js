"use client";
import { React, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { errorHandler } from "@/app/utils/error-handler";
import Link from "next/link";
import Image from "next/image";
import { FaRegQuestionCircle } from "react-icons/fa";
import { GrStatusGood } from "react-icons/gr";
import { BiError } from "react-icons/bi";
import { IoMdAddCircleOutline } from "react-icons/io";
import { Fade, Zoom } from "react-awesome-reveal";
import { Spinner } from "react-bootstrap";
import Footer from "../../components/Footer";


function FaqsEditor() {
	const [PostgreRes, setPostgreRes] = useState(null);
	const [existData, setExistData] = useState(false);
	const [question, setQuestion] = useState("");
	const [answer, setAnswer] = useState("");
	const [redToast, setRedToast] = useState("");
	const [redToastSpinner, setRedToastSpinner] = useState("");
	const [greenToast, setGreenToast] = useState("");
	const [greenToastSpinner, setGreenToastSpinner] = useState("");
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
			setGreenToast("Cargando preguntas frecuentes");
			setGreenToastSpinner(
				<Spinner animation="grow" className="spinner-grow-size" />
			);
			const res = await fetch("/api/preguntas-frecuentes");

			if (!res.ok) {
				const errorData = await res.json();
				setGreenToast("");
				setGreenToastSpinner("");
				errorHandler(res.status);
				setRedToast("Error al cargar las preguntas frecuentes");
				setRedToastSpinner(<BiError className="svg" />);
				throw new Error(errorData.message);
			}

			const { data } = await res.json();
			setRedToast("");
			setRedToastSpinner("");
			setGreenToast("Preguntas frecuentes cargadas con éxito!");
			setGreenToastSpinner(<GrStatusGood className="svg" />);
			setExistData(true);
			setPostgreRes(data);
			setQuestion(data.question);
			setAnswer(data.answer);

			if (data.isEmpty) {
				setGreenToast("");
				setGreenToastSpinner("");
				setRedToast(data.message);
				setRedToastSpinner(<BiError className="svg" />);
				setEnabledButton(false);
			}

			if (data.faqs.length > 0) {
				setGreenToast(data.message);
				setGreenToastSpinner(<GrStatusGood className="svg" />);
				setEnabledButton(false);
			}

			return PostgreRes;
		} catch (error) {
			console.error(error);
		}
	};

	//DELETE FAQ_______________________________________________
	const deleteProduct = async (id) => {
		document.getElementById("toast").scrollIntoView({ behavior: "smooth" });
		try {
      setRedToast("");
      setRedToastSpinner("");
			setGreenToast("Eliminando pregunta frecuente");
			setGreenToastSpinner(
				<Spinner animation="grow" className="spinner-grow-size" />
			);
			const res = await fetch(`${process.env.NEXT_PUBLIC_NEXT_APIURL}/api/preguntas-frecuentes`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ id }),
			});

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
							<h1 className="h1-page">Editor de FAQs</h1>
						</Zoom>
					</div>

					<section className="current-imgs-container-editor">
					{PostgreRes?.faqs.map((faq) => {
						let { id, question, answer } = faq;
						return (
							<div key={id} className="product-div-prox-editor faq-div-editor">
								<div className="product-text-div">
									<h1>{question}</h1>
									<p>{answer}</p>
								</div>
								<div className="buttons-div-product-editor">
									<button
										type="button"
										className="link-button-danger"
										onClick={() => deleteProduct(id)}
									>
										Eliminar
									</button>
									<Link
										href={`/editor/editar-pregunta-frecuente/${id}`}
										className="link-button"
									>
										Editar
									</Link>
								</div>
							</div>
						);
					})}
					</section>

					<section className="form-editor">
						<div className="button-container">
							<Link href="/preguntas-frecuentes" className="link-button">
								<FaRegQuestionCircle />
								Volver a Preguntas Frecuentes
							</Link>
							<Link
								id="toast"
								href="/editor/agregar-pregunta-frecuente"
								className="link-button-success"
							>
								<IoMdAddCircleOutline />
								Agregar Nueva Pregunta
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

export default FaqsEditor;
