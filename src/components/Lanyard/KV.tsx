import { Wrapper } from "components/Common";
import { useAppContext } from "hooks/useContexts";
import { FC, useState } from "react";
import styled from "styled-components";
import KVElement from "./KVElement";
import { AnimatePresence, Variants } from "framer-motion";
import { useSort } from "hooks/useSort";
import SearchBar from "./SearchBar";

const KVWrapper = styled(Wrapper)`
	border-radius: 10px;
	overflow: hidden;
`;

const KV_ANIMATION_VARIANTS: Variants = {
	animate: { opacity: 1, height: "auto", paddingTop: "", paddingBottom: "", marginTop: "", marginBottom: "" },
	initial: { opacity: 0.2, height: 0, paddingTop: 0, paddingBottom: 0, marginTop: 0, marginBottom: 0 },
};

const KV: FC = () => {
	const context = useAppContext();
	const sorthook = useSort();
	const [filter, setFilter] = useState("");

	if (!context.presance) return null;

	const kv = Object.entries(context.presance?.kv);

	const sorted = sorthook.sorter(kv);
	const filtered = !filter ? sorted : sorted.filter(([key, value]) => key.includes(filter) || value.includes(filter));

	return (
		<KVWrapper>
			<h2>Lanyard KV</h2>

			<SearchBar sort={sorthook} onSearch={setFilter} />

			<KVElement data={["", ""]} />

			<AnimatePresence initial={false}>
				{filtered.map((data) => (
					<KVElement
						key={data[0]}
						data={data}
						initial="initial"
						animate="animate"
						exit="initial"
						variants={KV_ANIMATION_VARIANTS}
						transition={{ duration: 0.2, ease: "easeInOut" }}
					/>
				))}
			</AnimatePresence>
		</KVWrapper>
	);
};

export default KV;
