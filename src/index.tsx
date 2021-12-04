import { StrictMode } from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { createGlobalStyle, ThemeProvider } from "styled-components";
import theme from "utils/theme";

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
		padding-top: 20px;
		padding-bottom: 20px;
	}

	#root {
		width: 100%;
		height: 100%;
		flex: 1;
		display: flex;
		flex-direction: column;
	}
`;

ReactDOM.render(
	<StrictMode>
		<ThemeProvider theme={theme}>
			<Global />

			<App />
		</ThemeProvider>
	</StrictMode>,
	document.getElementById("root"),
);
