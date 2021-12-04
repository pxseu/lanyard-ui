import { FC } from "react";
import styled from "styled-components";
import KVElement from "./KVElement";

const KVContainer = styled.div`
	margin-top: 20px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 90%;
	padding: 10px;
	border-radius: 10px;
	max-width: 600px;
	height: 100%;
	background-color: ${({ theme }) => theme.colors.presance};
	box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
`;

const KV: FC<{ data: Record<string, string> }> = ({ data }) => {
	const dataArr = Object.entries(data);

	return (
		<KVContainer>
			<h2>Lanyard KV</h2>
			<KVElement data={["", ""]} />

			{dataArr.map((elData) => (
				<KVElement key={elData.join(":")} data={elData} />
			))}
		</KVContainer>
	);
};

export default KV;
