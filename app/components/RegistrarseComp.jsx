"use client";
import React, { useState, useRef } from "react";
import Link from "next/link";
import "./RegistrarseComp.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Bounce, Slide } from "react-awesome-reveal";
import { errorHandler } from "../utils/error-handler";
import { RiRegisteredLine } from "react-icons/ri";
import { BiError } from "react-icons/bi";
import { GrStatusGood } from "react-icons/gr";
import { Spinner } from "react-bootstrap";
import Navbar from "./Navbar";

function RegistrarseComponente() {
	const router = useRouter();
	const toastRef = useRef(null);

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [greenToast, setGreenToast] = useState("");
	const [greenToastSpinner, setGreenToastSpinner] = useState("");
	const [redToast, setRedToast] = useState("");
	const [redToastSpinner, setRedToastSpinner] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		setRedToast("");

		const data = {
			name: name,
			email: email,
			password: password,
		};

		if (password !== confirmPassword) {
			setRedToast("Las contraseñas no coinciden. Inténtalo de nuevo.");
			setRedToastSpinner(<BiError />);
			setPassword("");
			setConfirmPassword("");

			setTimeout(() => {
				setRedToast("");
				setRedToastSpinner("");
			}, 3000);

			return;
		}

		try {
			setGreenToast("Espera un segundo, te estamos registrando...");
			setGreenToastSpinner(<Spinner animation="grow" className="spinner-grow-size"/>);
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_NEXT_APIURL}/api/auth/register`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(data),
				}
			);

			if (res.ok) {
				const data = await res.json();
				setGreenToast(data.message);
				setGreenToastSpinner(<GrStatusGood />);
			} else {
				setGreenToast("");
				setGreenToastSpinner("");
				const errorData = await res.json();
				setRedToast(errorData.message);
				setRedToastSpinner(<BiError />);
				errorHandler(errorData.status);
				throw new Error(errorData.message);
			}
		} catch (error) {
			console.error("Error:", error);
		}
	};

	return (
		<div className="reg-container">
			<Bounce>
				<div className="title-div">
					<Image
						src="/img/Original.png"
						alt="Imagen de Logotipo de Grupo 7"
						width={500}
						height={500}
						className="logo"
					/>
					<h1 className="h1-page">Formulario de Registro</h1>
				</div>
			</Bounce>

			<div className="divForm">
				<form onSubmit={handleSubmit}>
					<Slide className="w-100">
						<label>Nombre de usuario</label>
						<input
							type="text"
							placeholder="Ingresa tu nombre"
							value={name}
							onChange={(e) => setName(e.target.value)}
							required
						/>
					</Slide>

					<Slide className="w-100" direction="right">
						<label>Email</label>
						<input
							type="email"
							placeholder="Ingresa tu email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</Slide>

					<Slide className="w-100">
						<label>Contraseña</label>
						<input
							type="password"
							placeholder="Contraseña"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							autoComplete="true"
						/>
					</Slide>

					<Slide className="w-100" direction="right">
						<label>Confirmar Contraseña</label>
						<input
							type="password"
							placeholder="Por Favor Repite tu Contraseña"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							required
						/>
					</Slide>

					<Bounce className="w-100">
						<button variant="primary" type="submit" className="link-button">
							<RiRegisteredLine className="svg" />
							Registrarse
						</button>
					</Bounce>

					<Bounce className="mt-5 link">
						<Link href="/iniciar-sesion" className="link">
							Ya tienes una cuenta? Inicia sesión aquí
						</Link>
					</Bounce>

					{greenToast !== "" ? (
						<Bounce>
							<p className="success">{greenToast}{greenToastSpinner}</p>
						</Bounce>
					) : null}

					{redToast !== "" ? (
						<Bounce className="w-100">
							<p className="error">{redToast}{redToastSpinner}</p>
						</Bounce>
					) : null}
				</form>
			</div>
			<Navbar />
		</div>
	);
}

export default RegistrarseComponente;
