"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "./Navbar.css";
import { MdHome } from "react-icons/md";
import { BsInfoCircle } from "react-icons/bs";
import { FaShoppingBag } from "react-icons/fa";
import { MdOutlineTipsAndUpdates } from "react-icons/md";
import { GrContact } from "react-icons/gr";
import { CgPlayTrackNextO } from "react-icons/cg";
import { Zoom } from "react-awesome-reveal";

function Navbar() {
	const pathname = usePathname();
	const [path, setPath] = useState(pathname);

	useEffect(() => {
		setPath(pathname);
		console.log(path);
	}, [pathname]);

	const isActive = (route) =>
		route === path ? " link-button active" : "link-button";

	return (
		<nav className="navbar">
			<Zoom cascade damping={0.1}>
				<div>
					<Link href="/" className={isActive("/")}>
						<MdHome />
						Inicio
					</Link>
				</div>
				<div>
					<Link href="/nosotros" className={isActive("/nosotros")}>
						<BsInfoCircle />
						Nosotros
					</Link>
				</div>
				<div>
					<Link href="/tienda" className={isActive("/tienda")}>
						<FaShoppingBag />
						Tienda
					</Link>
				</div>
				<div>
					<Link href="/blog" className={isActive("/blog")}>
						<MdOutlineTipsAndUpdates />
						Tips
					</Link>
				</div>
				<div>
					<Link href="/contacto" className={isActive("/contacto")}>
						<GrContact />
						Contacto
					</Link>
				</div>
				<div>
					<Link href="/proximamente" className={isActive("/proximamente")}>
						<CgPlayTrackNextO />
						Proximamente
					</Link>
				</div>
			</Zoom>
		</nav>
	);
}

export default Navbar;
