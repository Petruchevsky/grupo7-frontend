'use server'
import SliderComp from "./SliderComp";

const getData = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_NEXT_APIURL}/api/slider`, { cache: "no-store" })
    if (!res.ok) {
      throw new Error(res.statusText)
    }

    const data = await res.json();
    return data;

  } catch (error) {
    console.error(error);
  }
}

async function Slider() {
  const data = await getData();

  return  <SliderComp props={data}/>
  
}

export default Slider;
