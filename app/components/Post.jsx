import Image from "next/image";
import Link from "next/link";
import "./Post.css";

function Post({ tip }) {
	const { title, description, images, slug, createdAt, createdBy } = tip;
	const date = new Date(createdAt);

	const options = {
		year: "numeric",
		month: "long",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	};
	const formattedDate = date.toLocaleDateString("es-ES", options) + " hrs.";

	return (
		<article className="post-container">
			<div className="img-div-post">
				<Image
					quality={100}
					src={images[0].url}
					alt={`Imagen de ${title}`}
					width={900}
					height={900}
					className="img-post"
				/>
			</div>

			<div className="text-post-container">
				<div>
					<h1>{title}</h1>
					<p>Post creado por {createdBy}</p>
					<p>{formattedDate}</p>
				</div>

				<div className="contenido-div">
					<div>
						<pre className="pre">{`${description.slice(0, 150)}...`}</pre>
					</div>
					<Link href={`/blog/${slug}`} className="link">
						Leer más...
					</Link>
				</div>
			</div>
		</article>
	);
}

export default Post;
