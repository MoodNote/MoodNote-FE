import { Redirect } from "expo-router";
import type React from "react";

import { ROUTES } from "@/constants";
import { useAuth } from "@/hooks";

interface Props {
	children: React.ReactNode;
}

// FR-guard: Redirects already-authenticated users away from auth screens to the app
export function PublicRoute({ children }: Props) {
	const { isAuthenticated, isLoading } = useAuth();

	if (isLoading) return null;

	if (isAuthenticated) {
		return <Redirect href={ROUTES.HOME} />;
	}

	return <>{children}</>;
}
