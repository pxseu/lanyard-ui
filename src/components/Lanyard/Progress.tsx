import { FC } from "react";
import styled from "styled-components";
import { useTime } from "hooks/useTime";

const Row = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	width: 100%;
`;

const ProgressWrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 100%;
	padding: 0 5px;
`;

const BarWrapper = styled.div`
	display: flex;
	flex: 1 1 80%;
	height: 5px;
	border-radius: 5px;
	background-color: ${({ theme }) => theme.colors.gray};
	overflow: hidden;
`;

const ProgressBar = styled.div<{ activity: number }>`
	width: calc(var(--progress) * 1%);
	height: 100%;
	border-radius: 5px;
	background-color: ${({ theme, activity }) => (activity === 2 ? theme.colors.spotify : theme.colors.primary)};
`;

const ProgressTime = styled.p`
	font-size: 0.6rem;
	margin: 0 5px;
	color: ${({ theme }) => theme.colors.primary};
	font-weight: normal;
`;

const Progress: FC<{ time: ReturnType<typeof useTime>; activity: number }> = ({ time, activity }) => {
	if (!time || !time.completion) return null;

	return (
		<ProgressWrapper>
			<Row>
				<ProgressTime>{time.start}</ProgressTime>
				<ProgressTime>{time.end}</ProgressTime>
			</Row>
			<Row>
				<BarWrapper>
					{/* @ts-ignore */}
					<ProgressBar activity={activity} style={{ "--progress": time.completion }} />
				</BarWrapper>
			</Row>
		</ProgressWrapper>
	);
};

export default Progress;
