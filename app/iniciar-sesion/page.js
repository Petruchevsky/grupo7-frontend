import React from 'react'
import IniciarSesionComponente from '../components/IniciarSesionComp'


export const metadata = {
	openGraph: {
		title: "Iniciar Sesion G7",
		description: "Inicia Sesion en Grupo 7",
		images: {
			url: "https://res.cloudinary.com/dtqfrwjdm/image/upload/v1695335899/logo_cuadrado_8e31427e86.jpg",
		},
		locale: "es_CL",
		type: "website",
	},
};

function IniciarSesion() {
  return (
	 <div>
		<IniciarSesionComponente />
	 </div>
  )
}

export default IniciarSesion
