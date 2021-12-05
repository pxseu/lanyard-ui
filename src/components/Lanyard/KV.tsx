import { AppContext } from "App";
import { Wrapper } from "components/Common";
import { FC, useContext } from "react";
import styled from "styled-components";
import KVElement from "./KVElement";

const KVWrapper = styled(Wrapper)`
	border-radius: 10px;
	overflow: hidden;
`;

const KV: FC = () => {
	const context = useContext(AppContext);

	if (!context.presance) return null;

	const dataArr = Object.entries(context.presance?.kv);

	return (
		<KVWrapper>
			<h2>Lanyard KV</h2>
			<KVElement data={["", ""]} />

			{dataArr.map((elData) => (
				<KVElement key={elData.join(":")} data={elData} />
			))}
		</KVWrapper>
	);
};

export default KV;
