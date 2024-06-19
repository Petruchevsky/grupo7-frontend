"use client";
import React, { useState } from "react";
import "./IniciarSesionComp.css";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "./Navbar";
import { RiRegisteredLine } from "react-icons/ri";
import { BiError } from "react-icons/bi";
import { GrStatusGood } from "react-icons/gr";
import { Spinner } from "react-bootstrap";
import { Slide, Bounce } from "react-awesome-reveal";

function IniciarSesionComponente() {
	const [greenToast, setGreenToast] = useState("");
	const [greenToastSpinner, setGreenToastSpinner] = useState("");
	const [redToast, setRedToast] = useState("");
	const [redToastSpinner, setRedToastSpinner] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const router = useRouter();

	//HANDLE SUBMIT_______________________________________________________________________
	const handleSubmit = async (e) => {
		e.preventDefault();
		setGreenToast("Estamos verificando tus credenciales...");
		setGreenToastSpinner(<Spinner animation="grow" className="spinner-grow-size" />);

		const credentials = {
			email: email,
			password: password,
		};

		try {
			const res = await fetch(`/api/auth/login`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(credentials),
			});

			if (!res.ok) {
				const error = await res.json();
				setGreenToast("");
				setGreenToastSpinner("");
				setRedToast(error.message);
				setRedToastSpinner(<BiError />);
				throw new Error(error.message);
			}

			const data = await res.json();
			setGreenToast(data.message);
			setGreenToastSpinner(<GrStatusGood />);
			setTimeout(() => {
				router.push("/");
			}, 3000);
		} catch (error) {
			setRedToast(error.message);
			setRedToastSpinner(<BiError />);
			setGreenToast("");
			setGreenToastSpinner("");

			setTimeout(() => {
				setRedToast("");
				setRedToastSpinner("");
			}, 3000);
		}
	};

	//FORGOT PASSWORD_______________________________________________________________________
	const forgotPassword = async () => {
		try {
			const data = { email: email };

			let response = await fetch(
				`${process.env.NEXT_PUBLIC_APIURL}/api/auth/forgot-password`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(data),
				}
			);

			if (response.ok) {
				response = await response.json();
				console.log(response);
				setGreenToast("Si estás registrado, recibirás un Email para reestablecer tu Contraseña");
				setGreenToastSpinner(<GrStatusGood />);
				setTimeout(() => {}, 3700);
			} else {
				const errorData = await response.json();
				const errorMessage = errorData.error.message;
				console.log(errorMessage);
				throw new Error(errorMessage);
			}
		} catch (errorMessage) {
			if (errorMessage.message === "email must be a valid email") {
				setRedToast("Email inválido, inténtalo de nuevo");
				setRedToastSpinner(<BiError />);
			} else {
				setRedToast(errorMessage.message);
				setRedToastSpinner(<BiError />);
			}
		}
	};

	

	return (
		<div className="main-container-login">
			<Bounce>
				<div className="titleDiv-login">
					<Image
						src="/img/Original.png"
						alt="Imagen de Logotipo de Grupo 7"
						width={500}
						height={500}
						className="logo-login"
					/>
					<h1 className="h1-page">Iniciar Sesión</h1>
				</div>
			</Bounce>

			<div className="divForm-login">
				<form onSubmit={handleSubmit}>
					<Slide className="w-100">
						<label>Email</label>
						<input
							type="email"
							placeholder="Ingresa tu email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</Slide>

					<Slide className="w-100" direction="right">
						<label>Contraseña</label>
						<input
							type="password"
							placeholder="Contraseña"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</Slide>

					<Slide className="w-100">
						<button
							variant="primary"
							type="submit"
							className="link-button mb-5"
						>
							Iniciar Sesión
						</button>
					</Slide>

					{greenToast && (
						<Bounce className="w-100">
							<p className="success">{greenToast}{greenToastSpinner}</p>
						</Bounce>
					)}

					{redToast && (
						<Bounce className="w-100">
							<p className="error">{redToast}{redToastSpinner}</p>
						</Bounce>
					)}

					<Slide className="w-100 text-center mb-4" direction="right">
						<Link
							// onClick={forgotPassword}
							href="/"
							className="link"
						>
							¿Olvidaste tu Contraseña?
						</Link>
					</Slide>

					<Slide className="w-100 text-center mb-4">
						<Link href="/registrarse" className="link text-center">
							¿No tienes una cuenta aún? ¡Regístrate Aquí!
						</Link>
					</Slide>
				</form>
			</div>
			<Navbar />
		</div>
	);
}

export default IniciarSesionComponente;
