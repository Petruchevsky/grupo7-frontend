import ProximamenteComponente from "../components/ProximamenteComp";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";


export const metadata = {
    title: "Proximamente G7",
    description: "Proximamente en Grupo 7.",
 }

 async function getData() {
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_NEXT_APIURL}/api/proximamente`
		);

		if (!response.ok) {
			const errorData = await response.json();
			const errorMessage = `Error: ${response.status}: ${errorData.message}`;
			throw new Error(errorMessage);
		}

		const { data } = await response.json();
		return data;
	} catch (error) {
		console.error(error);
	}
}

async function Proximamente() {
  const data = await getData();
	console.log(data)

  return (
    <div>
      <Header />
      <Navbar />
      <ProximamenteComponente props={data}/>
      <Footer />
    </div>
  )
}

export default Proximamente

