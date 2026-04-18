import type { ReactNode } from "react";

declare module "framer-motion" {
	interface AnimatePresenceProps {
		children?: ReactNode;
	}
}
