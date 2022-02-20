import { Wrapper } from "components/Common";
import { useAppContext } from "hooks/useContexts";
import { FC } from "react";
import styled from "styled-components";
import KVElement from "./KVElement";

const KVWrapper = styled(Wrapper)`
	border-radius: 10px;
	overflow: hidden;
`;

const KV: FC = () => {
	const context = useAppContext();

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
