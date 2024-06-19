"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
import Image from "next/image";
import "./Header.css";
import Link from "next/link";
import { RiLogoutBoxLine, RiLoginBoxLine, RiRegisteredLine } from "react-icons/ri";
import { Zoom, Bounce } from "react-awesome-reveal";
import Cookies from "js-cookie";
import AdminButton from "./AdminButton";

function Header() {
	const [greenMsg, setGreenMsg] = useState("");

	const logout = async () => {
		const res = await fetch("/api/auth/logout", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (res.ok) {
			const data = await res.json();
			console.log(data);
			setGreenMsg(data.message);
			setTimeout(() => {
				setGreenMsg("");
			}, 3000);
		}
	};

	return (
		<header>
			<div className="main-container">
				<div className="logo-cont">
					<Bounce>
						<Image
							src="/img/logo-original-recortado.png"
							width={500}
							height={500}
							alt="logo de Grupo 7"
							className="logo-header"
						/>
					</Bounce>
					<Bounce>
						<h1 className="h1-page grupo7-inside-logo">Grupo 7</h1>
					</Bounce>
				</div>

				<div className="title-container">
					<Zoom className="w-100">
						<h3 className="grupo7">Grupo 7</h3>
						<h3 className="slogan">
							Diseñando productos para que tu vida sea más fácil
						</h3>
					</Zoom>
				</div>

				<div className="header-button-container">
					<Bounce className="w-100" cascade>
						<Link
							className={
								Cookies.get("loginCookie") ? "btn-disabled" : "link-button"
							}
							href="/registrarse"
						>
							<RiRegisteredLine className="svg" />
							Registrarse
						</Link>
						{Cookies.get("loginCookie") ? (
							<button className="link-button-danger" onClick={logout}>
								<RiLogoutBoxLine className="svg" />
								Cerrar Sesión
							</button>
						) : (
							<Link className="link-button" href="/iniciar-sesion">
								<RiLoginBoxLine className="svg" />
								Iniciar Sesión
							</Link>
						)}
						{greenMsg && <p className="green-msg">{greenMsg}</p>}
						<AdminButton />
					</Bounce>
				</div>
			</div>
		</header>
	);
}

export default dynamic(() => Promise.resolve(Header), { ssr: false });
