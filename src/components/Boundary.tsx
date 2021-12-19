import { useCatchGlobalErrors } from "hooks/catchGlobalErrors";
import React, { Component, ErrorInfo, FC, ReactNode } from "react";
import { logger } from "utils/log";
import ErrorPage from "./ErrorPage";

interface Props {
	children: ReactNode;
}

interface State {
	error: Error | null;
}

const log = logger("error", "boundary");

class ErrorBoundaryClass extends Component<Props, State> {
	public state: State = {
		error: null,
	};

	public static getDerivedStateFromError(error: Error): State {
		return { error };
	}

	public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		log("Uncaught error:", error, errorInfo);
	}

	public render() {
		if (this.state.error) {
			return <ErrorPage error={this.state.error} />;
		}

		return this.props.children;
	}
}

const ErrorBoundary: FC = ({ children }) => {
	const globalError = useCatchGlobalErrors();

	if (globalError) return <ErrorPage error={globalError} />;

	return <ErrorBoundaryClass>{children}</ErrorBoundaryClass>;
};

export default ErrorBoundary;
