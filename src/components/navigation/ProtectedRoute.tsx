import { Redirect } from "expo-router";
import type React from "react";

import { ROUTES } from "@/constants";
import { useAuth } from "@/hooks";

interface Props {
	children: React.ReactNode;
}

// FR-guard: Blocks unauthenticated users from accessing protected screens
export function ProtectedRoute({ children }: Props) {
	const { isAuthenticated, isLoading } = useAuth();

	if (isLoading) return null;

	if (!isAuthenticated && !__DEV__) {
		return <Redirect href={ROUTES.LOGIN} />;
	}

	return <>{children}</>;
}
