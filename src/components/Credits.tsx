import { AUTHOR_URL, REPOSITORY_URL } from "utils/consts";
import { Anchor, Wrapper } from "./Common";

const Credits = () => {
	return (
		<Wrapper>
			<p>
				Created by{" "}
				<Anchor href={AUTHOR_URL} target="_blank" rel="noopener noreferrer">
					pxseu
				</Anchor>
				.
			</p>
			<p>
				The source code is available on{" "}
				<Anchor href={REPOSITORY_URL} target="_blank" rel="noopener noreferrer">
					GitHub
				</Anchor>
				.
			</p>
		</Wrapper>
	);
};

export default Credits;
