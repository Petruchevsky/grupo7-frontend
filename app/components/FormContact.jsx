"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import "./FormContact.css";
import { LiaTelegramPlane } from "react-icons/lia";
import { Slide, Bounce } from "react-awesome-reveal";
import { BsFillTelephoneInboundFill } from "react-icons/bs";
import { FaMapLocationDot } from "react-icons/fa6";
import { IoMdMailUnread } from "react-icons/io";
import { FaWhatsapp } from "react-icons/fa";

function FormContact() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [subject, setSubject] = useState("");
	const [message, setMessage] = useState("");
	const [errorMsg, setErrorMsg] = useState("");
	const [successMsg, setSuccessMsg] = useState("");

	const handleSubmit = async (e) => {
		setSuccessMsg("Estamos enviando tu mensaje...");

		e.preventDefault();
		setErrorMsg("");

		const data = { name, email, subject, message };

		try {
			const res = await fetch("/api/mailer", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			if (!res.ok) {
				throw new Error("Algo salió Mal con tu Email");
			}

			setSuccessMsg("Mensaje Enviado Exitosamente!");

			setTimeout(() => {
				setName("");
				setEmail("");
				setSubject("");
				setMessage("");
				setSuccessMsg("Te responderemos lo antes posible!");
			}, 2000);
		} catch (error) {
			setErrorMsg(error.message);

			setTimeout(() => {
				setName("");
				setEmail("");
				setSubject("");
				setMessage("");
				setErrorMsg("Por favor refresca la página, e inténtalo de nuevo...");
			}, 2000);
		}
	};

	return (
		<main className="main-container-contact">
			<setcion className="form-container">
				<form onSubmit={handleSubmit}>
					<Slide className="w-100 text-l">
						{" "}
						<label htmlFor="name">Nombre</label>
						<input
							type="text"
							value={name}
							placeholder="Ingresa tu Nombre"
							onChange={(e) => setName(e.target.value)}
							required
						/>
					</Slide>
					<Slide direction="right" className="w-100 text-l">
						<label htmlFor="email">Email</label>
						<input
							type="email"
							value={email}
							placeholder="Ingresa tu Email"
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</Slide>
					<Slide className="w-100 text-l">
						<label htmlFor="subject">Asunto</label>
						<input
							type="text"
							value={subject}
							placeholder="Asunto"
							onChange={(e) => setSubject(e.target.value)}
							required
						/>
					</Slide>
					<Slide direction="right" className="w-100 text-l">
						<label htmlFor="message">Mensaje</label>
						<textarea
							value={message}
							placeholder="Escribe tu Mensaje..."
							onChange={(e) => setMessage(e.target.value)}
							required
						/>
					</Slide>
					<Slide className="w-100 text-l">
						<button className="link-button m-auto border-0" type="submit">
							<LiaTelegramPlane />
							Enviar Mensaje
						</button>
					</Slide>

					{successMsg && <p className="success">{successMsg}</p>}
					{errorMsg && <p className="error">{errorMsg}</p>}
				</form>
			</setcion>

			<div className="datos-container-contacto">
				<div className="title-logo-div">
					<Bounce>
						<Image
							src="/img/Original.png"
							width={500}
							height={500}
							alt="logo de grupo 7"
							className="logo-contacto"
						></Image>
						<h1 className="h1-page">Contacto</h1>
					</Bounce>
				</div>

				<Bounce>
					<section className="section-datos">
						<div style={{ display: "flex", gap: "1rem" }}>
							<BsFillTelephoneInboundFill className="svg-contacto" />
							<FaWhatsapp className="svg-contacto" />
						</div>
						<Link
							className="link"
							href="https://wa.me/56937131180?text=Hola!%20Quisiera%20comprar%20un%20producto%20de%20Grupo%207!"
							target="_blank"
						>
							+56 9 3713 1180
						</Link>
						<IoMdMailUnread className="svg-contacto" />
						<Link
							className="link"
							href="mailto:contacto@grupo7.cl?subject=Consulta"
						>
							contacto@grupo7.cl
						</Link>
						<FaMapLocationDot className="svg-contacto" />
						<Link className="link" href="/tienda">
							Distribución en Santiago, Talca y Región de Valparaíso.
						</Link>
					</section>
				</Bounce>
			</div>
		</main>
	);
}

export default FormContact;
