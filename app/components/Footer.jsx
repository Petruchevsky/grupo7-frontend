"use client";
import Image from "next/image";
import Link from "next/link";
import "./Footer.css";
import { BsFillTelephoneInboundFill } from "react-icons/bs";
import { FaMapLocationDot } from "react-icons/fa6";
import { IoMdMailUnread } from "react-icons/io";
import { FaWhatsapp } from "react-icons/fa";
import { Zoom } from "react-awesome-reveal";

function Footer() {
	return (
		<footer>
			<section className="section-footer">
				<Zoom cascade damping={0.1}>
					<Link href="/">
						<Image
							src="/img/logo-byn-recortado.png"
							width={300}
							height={300}
							alt="logo de abogado"
							className="logo-footer"
						/>
					</Link>

					<div className="enlaces">
						<Link className="enlaces-h3" href="/">
							<h3 style={{ fontWeight:'bold' }}>GRUPO 7</h3>
						</Link>
						<Link className="enlaces-h3" href="/trabaja-con-nosotros">
							<h3>Trabaja con Nosotros</h3>
						</Link>
						<Link className="enlaces-h3" href="/preguntas-frecuentes">
							<h3>Preguntas Frecuentes</h3>
						</Link>
					</div>

					<div className="datos">
						<div>
							<div style={{ display: "flex", gap: "1rem" }}>
								<BsFillTelephoneInboundFill className="svg" />
								<FaWhatsapp className="svg" />
							</div>
							<Link
								className="link-footer"
								href="https://wa.me/56937131180?text=Hola!%20Quisiera%20comprar%20un%20producto%20de%20Grupo%207!"
								target="_blank"
							>
								+56 9 3713 1180
							</Link>
						</div>
						<div>
							<IoMdMailUnread className="svg" />
							<Link
								className="link-footer"
								href="mailto:contacto@grupo7.cl?subject=Consulta"
							>
								contacto@grupo7.cl
							</Link>
						</div>
						<div>
							<FaMapLocationDot className="svg" />
							<Link className="link-footer" href="/tienda">
								Distribución en Santiago, Talca y Región de Valparaiso.
							</Link>
						</div>
					</div>

					<div className="RRSS-container">
						<Link href="/socialmedia">
							<Image
								src="/img/face.jpeg"
								width={50}
								height={50}
								alt="icono de facebook"
								className="icon-f"
							/>
						</Link>

						<Link href="/socialmedia">
							<Image
								src="/img/insta.png"
								width={50}
								height={50}
								alt="icon de instagram"
								className="icon-i"
							/>
						</Link>
					</div>
				</Zoom>

				{/* <button className="up-btn" type="button" onClick={scrollUp}>
						<BiSolidUpArrow style={{ width:'5rem' }}/>
					</button> */}
			</section>
			<Zoom className="w-100">
				<section className="developedBy">
					<Link href="/">Grupo 7 &copy;</Link>
					<Link href="/">Diseño y Desarrollo por Moises-WEB</Link>
				</section>
			</Zoom>
		</footer>
	);
}

export default Footer;
