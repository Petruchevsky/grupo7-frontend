"use client";
import Carousel from "react-bootstrap/Carousel";
import Image from "next/image";
import "./SliderComp.css";

function SliderComp({ props }) {
	const data = props;

	return (
		<div className="carousel-container container">
			<Carousel interval={1000} pause="hover" fade>
				{data?.map((file) => {
					const { url, publicId, fileType } = file;

					if (fileType === "video") {
						return (
							<Carousel.Item key={publicId} className="border-c">
								<video
									className="media-carousel"
									src={url}
									alt="Slide media"
									width={1200}
									height={700}
									autoPlay
									loop
									muted
									layout="responsive"
								/>
							</Carousel.Item>
						);
					} else {
						return (
							<Carousel.Item key={publicId} className="border-c">
								<Image
									className="media-carousel"
									src={url}
									alt="Slide media"
									width={1200}
									height={700}
									layout="responsive"
								/>
							</Carousel.Item>
						);
					}
				})}
			</Carousel>
		</div>
	);
}

export default SliderComp;
