import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { createGlobalStyle, ThemeProvider } from "styled-components";
import ErrorBoundary from "@/components/Boundary";
import theme from "@/utils/theme";
import App from "./App";

const Global = createGlobalStyle`
	*, *:before, *:after {
		box-sizing: border-box;
		margin: 0;
		padding: 0;
	}

	html, body {
		min-height: 100%;
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

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

const root = createRoot(rootElement);

root.render(
	<StrictMode>
		<ThemeProvider theme={theme}>
			<HelmetProvider>
				<Global />
				<ErrorBoundary>
					<App />
				</ErrorBoundary>
			</HelmetProvider>
		</ThemeProvider>
	</StrictMode>,
);
