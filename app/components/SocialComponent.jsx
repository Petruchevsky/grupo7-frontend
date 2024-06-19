"use client";
import "./SocialComponent.css";
import Image from "next/image";
import { MdHome } from "react-icons/md";
import Link from "next/link";
import { Fade, Zoom } from "react-awesome-reveal";

function SocialComponent() {
	return (
		<Fade duration={3000}>
			<main className="section-social main-container-y">
				<section className="article-social">
					<Zoom className="m-auto" cascade damping={0.2} delay={300}>
						<Image
							src="/img/logo-original-recortado.png"
							width={500}
							height={500}
							alt="logo de Orlando Rojas"
							className="logo-sm m-auto"
						/>
						<h1 className="pri">Socialmedia Link</h1>
						<h1 className="sec">Aquí muy pronto...</h1>
						<h1 className="ter">podrás ver...</h1>
						<h1 className="cua">nuestro contenido en redes sociales</h1>
						<Link href="/" className="link-button">
							<MdHome />
							Volver al Inicio
						</Link>
					</Zoom>
				</section>
			</main>
		</Fade>
	);
}

export default SocialComponent;
