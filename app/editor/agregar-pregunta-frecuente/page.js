"use client";
import { useState, useEffect } from "react";
import "./agregar-pregunta-frecuente.css";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaRegQuestionCircle, FaSave } from "react-icons/fa";
import { GrStatusGood } from "react-icons/gr";
import { BiError } from "react-icons/bi";
import { Zoom } from "react-awesome-reveal";
import { Spinner } from "react-bootstrap";
import Footer from "../../components/Footer";
import { MdModeEdit } from "react-icons/md";

function AgregarPreguntaFrecuente() {
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
	

	// HANDLE SUBMIT_________________________________________________________________
	const handleSubmit = async (event) => {
		setRedToast("");
		setRedToastSpinner("");
		setGreenToast("Estamos subiendo tu nueva pregunta");
		setGreenToastSpinner(<Spinner animation="grow" className="spinner-grow-size" />);
		event.preventDefault();

		const formData = new FormData();
		formData.append("question", question);
		formData.append("answer", answer);

		let errorData;

		try {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_NEXT_APIURL}/api/preguntas-frecuentes`,
				{
					method: "POST",
					body: formData,
				}
			);

			if (!res.ok) {
				errorData = await res.json();
				throw new Error(errorData.message);
			}

			const {data} = await res.json();
			setGreenToast(data.message);
			setGreenToastSpinner(<GrStatusGood className="svg" />);
			setQuestion("");
			setAnswer("");
			setTimeout(() => {
				setGreenToast("");
				setGreenToastSpinner("");
			}, 4000);
		} catch (error) {
			setGreenToast("");
			setGreenToastSpinner("");
			setRedToast(errorData ? errorData.message : "Error al subir la pregunta frecuente");
			setRedToastSpinner(<BiError className="svg" />);
			console.error(error);
		}
	};

	return (
		<main className="main-container-editor">
			<section className="main-section-editor">
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
							<h1 className="h1-page">Agregar Pregunta</h1>
						</Zoom>
					</div>

				<form onSubmit={handleSubmit} className="form-editor">
					<label htmlFor="question">Agregar pregunta frecuente</label>
					<textarea
						type="text"
						id="question"
						name="question"
						value={question}
						onChange={(e) => setQuestion(e.target.value)}
						required
					/>
					<label htmlFor="answer">Respuesta</label>
					<textarea
						type="text"
						id="answer"
						name="answer"
						value={answer}
						onChange={(e) => setAnswer(e.target.value)}
						required
					/>
	
					<button type="submit" className="link-button-success w-100 mb-3">
						<FaSave className="svg" />
						Guardar y Publicar Pregunta Frecuente
					</button>
					<Link
						href="/editor/preguntas-frecuentes-editor"
						className="link-button w-100 mb-3"
						>
							<MdModeEdit className="svg" />
						Volver al Editor
					</Link>
					<Link href="/preguntas-frecuentes" className="link-button w-100 mb-3">
						<FaRegQuestionCircle className="svg" />
						Volver a Preguntas Frecuentes
					</Link>

						{greenToast && <p className="success"> {greenToast}{greenToastSpinner} </p>}
						{redToast && <p className="error"> {redToast}{redToastSpinner} </p>}
				</form>
			</section>
			<Footer />
		</main>
	);
}

export default AgregarPreguntaFrecuente;
