import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
	return (
		<div className="flex justify-center mx-2 md:mx-auto p-10">{children}</div>
	);
}
