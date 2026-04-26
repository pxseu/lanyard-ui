import { AnimatePresence, motion, type Variants } from "framer-motion";
import { AiOutlineSortAscending, AiOutlineSortDescending } from "react-icons/ai";
import styled from "styled-components";
import { Button, ElementWrapper, Input } from "@/components/Common";
import type { useSort } from "@/hooks/useSort";

interface SearchBarProps {
	sort: ReturnType<typeof useSort>;
	onSearch: (search: string) => void;
}

const SortButton = styled(Button)`
	margin: 0;
	margin-left: 10px;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const IconWrapper = styled(motion.div)`
	display: flex;
	justify-content: center;
	align-items: center;
`;

const IconVariants: Variants = {
	initial: {
		rotate: -180,
		scale: 0.5,
		transition: {
			duration: 0.2,
		},
	},
	animate: {
		rotate: 0,
		scale: 1,
	},
	exit: {
		rotate: 180,
		scale: 0.5,
		transition: {
			duration: 0.2,
		},
	},
};

const SearchBar = ({ sort, onSearch }: SearchBarProps) => (
	<ElementWrapper>
		<Input placeholder="Search" onChange={(event) => onSearch(event.target.value)} />
		<SortButton onClick={() => sort.toggleSort()}>
			<AnimatePresence mode="wait" initial={false}>
				{sort.type === "asc" ? (
					<IconWrapper key="asc" variants={IconVariants} initial="initial" animate="animate" exit="exit">
						<AiOutlineSortAscending fontSize={20} />
					</IconWrapper>
				) : (
					<IconWrapper key="desc" variants={IconVariants} initial="initial" animate="animate" exit="exit">
						<AiOutlineSortDescending fontSize={20} />
					</IconWrapper>
				)}
			</AnimatePresence>
		</SortButton>
	</ElementWrapper>
);

export default SearchBar;
