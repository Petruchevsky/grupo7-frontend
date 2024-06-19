import RegistrarseComponente from "../components/RegistrarseComp"


export const metadata = {
	openGraph: {
	  title: "Registrarse G7",
	  description: "Registrate ya en Grupo 7",
	  images: {
		 url: "https://res.cloudinary.com/dtqfrwjdm/image/upload/v1695335899/logo_cuadrado_8e31427e86.jpg"
	  },
	  locale: 'es_CL',
	  type: 'website',
	}
 }

function Registrarse() {
  return (
	 <div>
		<RegistrarseComponente />
	 </div>
  )
}

export default Registrarse
