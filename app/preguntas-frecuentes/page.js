import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import "./preguntas-frecuentes.css";

export const metadata = {
	title: "Preguntas Frecuentes",
	description: "Preguntas frecuentes de la tienda",
};

const getData = async() => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_NEXT_APIURL}/api/preguntas-frecuentes`
    );

    if (!res.ok) {
      const errorData = await res.json();
      console.log(errorData)
      throw new Error(errorData.message);
    }

    const {data} = await res.json();
    return data;

  } catch (error) {
    console.log(error);
  }
};

async function Faqs() {
	const data = await getData();
  const faqs = data.faqs

	return (
		<main className="main-container-y">
			<Header />
			<Navbar />
      <h1 className="h1-page">Preguntas Frecuentes</h1>

			<section className='central-section-faq'>
        <ul>
          {faqs.map(faq => (
            <li key={faq.id}>
              <h1>{faq.question}</h1>
              <p>{faq.answer}</p>
            </li>
          ))}
        </ul>
      </section>
			<Footer />
		</main>
	);
}

export default Faqs;
