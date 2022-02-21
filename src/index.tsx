import { StrictMode } from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { createGlobalStyle, ThemeProvider } from "styled-components";
import theme from "utils/theme";
import ErrorBoundary from "components/Boundary";

const Global = createGlobalStyle`
	*, *:before, *:after {
		box-sizing: border-box;
		margin: 0;
			padding: 0;
	}
	body {
		font-family: "Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI",  "Oxygen";
		font-size: 16px;
		background-color: ${theme.colors.background};
		color: ${theme.colors.primary};
		width: 100%;
		height: 100%;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	#root {
		width: 100%;
		height: 100%;
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	::-webkit-scrollbar {
		width: 7px;
		height: 7px;
		background: transparent;
	}

	::-webkit-scrollbar-thumb {
		background: ${theme.colors.outline};
		border-radius: 5px;
	}

	::-webkit-scrollbar-track {
		background: transparent;
	}

	::-webkit-scrollbar-button {
		display: none;
	}
`;

ReactDOM.render(
	<StrictMode>
		<ThemeProvider theme={theme}>
			<Global />

			<ErrorBoundary>
				<App />
			</ErrorBoundary>
		</ThemeProvider>
	</StrictMode>,
	document.getElementById("root"),
);
