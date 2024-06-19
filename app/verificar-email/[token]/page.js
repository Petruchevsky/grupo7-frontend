"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import './VerifyEmailToken.css';

function VerifyEmailToken({ params }) {
	const [greenToast, setGreenToast] = useState("");
	const [redToast, setRedToast] = useState("");
	const { token } = params;
  const router = useRouter();

	useEffect(() => {
		setGreenToast("Espera un segundo, estamos verificando tu email...");

		const verifyEmail = async () => {
			const res = await fetch("/api/verify-email", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ token }),
			});

			if (res.ok) {
        const data = await res.json();
				setGreenToast(data.message);
				setTimeout(() => {
					router.push("/iniciar-sesion");
				}, 3500);
			} else {
        const error = await res.json();
        setGreenToast("");
        setRedToast(error.message);

        if(res.status === 405) {
          setTimeout(() => {
            setRedToast("Te estamos redirigiendo a la página de registro...")
          }, 4000);

          setTimeout(() => {
            router.push("/registrarse");
          }, 4000);
        }
        
      }
		};

		verifyEmail();
	}, [token]);

	return (
		<main className="main-container-token">
			<div className="central-div">
				<Image src="/logo-original-recortado.png" alt="logo" width={100} height={100} />
				<h1>Registro Exitoso!</h1>
				{greenToast && <p className="success">{greenToast}</p>}
        {redToast && <p className="error">{redToast}</p>}
			</div>
		</main>
	);
}

export default VerifyEmailToken;
