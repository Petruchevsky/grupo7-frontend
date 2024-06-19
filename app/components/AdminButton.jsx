"use client";
import dynamic from "next/dynamic";
import Cookies from "js-cookie";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { MdModeEdit } from "react-icons/md";

function AdminButton() {

	const pathname = usePathname();

  function getHrefPath(pathname) {
    switch (pathname) {
      case "/":
        return "/editor/slider-editor";
      case "/nosotros":
        return "/editor/nosotros-editor";
      case "/tienda":
        return "/editor/tienda-editor";
      case "/blog":
        return "/editor/tips-editor";
      case "/proximamente":
        return "/editor/proximamente-editor";
      case "/preguntas-frecuentes":
        return "/editor/preguntas-frecuentes-editor";
      case "/trabaja-con-nosotros":
        return "/";
      case "/contacto":
        return "/";
    }
  }

	return (
		<div className="w-100">
			{Cookies.get("adminCookie") && (
				<Link
					className={ (pathname === "/contacto" || pathname === "/trabaja-con-nosotros")  ? "hidden" : "link-button-success"}
          href={getHrefPath(pathname)}
				>
          <MdModeEdit className="svg" />
					Editar Sitio
				</Link>
			)}
		</div>
	);
}

export default dynamic(() => Promise.resolve(AdminButton), { ssr: false });