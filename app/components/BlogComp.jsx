"use client";
import "./BlogComp.css";
import Post from "./Post";
import { Slide } from "react-awesome-reveal";

function BlogComponente({ props }) {
	const data = props;
	const tips = data.tips;

	return (
		<main className="tips-container">
			<Slide>
				<h1 className="h1-page">Tips que deberías saber</h1>
			</Slide>
			<div className="posts-container">
				<Slide cascade damping={0.2}>
					{tips?.map((tip) => (
						<Post key={tip.id} tip={tip} />
					))}
				</Slide>
			</div>
		</main>
	);
}

export default BlogComponente;
