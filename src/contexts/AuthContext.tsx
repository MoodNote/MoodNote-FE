import { AUTH_CONFIG } from "@/constants";
import type { RegisterFormValues } from "@/schemas";
import { authService } from "@/services/auth.service";
import type { AuthContextValue } from "@/types/contexts.types";
import type {
	ForgotPasswordPayload,
	LoginPayload,
	ResendVerificationPayload,
	ResetPasswordPayload,
	User,
	VerifyEmailPayload,
	VerifyResetOtpPayload,
} from "@/types/user.types";
import { logError } from "@/utils/error";
import {
	clearStorage,
	getAuthToken,
	getStorageItem,
	getUserData,
	setAuthToken,
	setStorageItem,
	setUserData,
} from "@/utils/storage";
import { createContext, useCallback, useEffect, useState, type ReactNode } from "react";

// ─── Internal state ────────────────────────────────────────────────────────────

interface AuthState {
	user: User | null;
	isAuthenticated: boolean;
	isLoading: boolean;
}

// ─── Context ─────────────────────────────────────────────────────────────────

export const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ────────────────────────────────────────────────────────────────

interface AuthProviderProps {
	children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
	const [state, setState] = useState<AuthState>({
		user: null,
		isAuthenticated: false,
		isLoading: true,
	});

	// Restore session from secure storage on app start
	useEffect(() => {
		(async () => {
			try {
				const [token, user] = await Promise.all([getAuthToken(), getUserData()]);

				if (token && user) {
					setState({ user, isAuthenticated: true, isLoading: false });
				} else {
					setState((s) => ({ ...s, isLoading: false }));
				}
			} catch {
				setState((s) => ({ ...s, isLoading: false }));
			}
		})();
	}, []);

	// ─── Actions ─────────────────────────────────────────────────────────────────

	const login = useCallback(async (payload: LoginPayload) => {
		const response = await authService.login(payload);

		const { user, accessToken, refreshToken } = response.data.data;

		await Promise.all([
			await setAuthToken(accessToken),
			await setStorageItem(AUTH_CONFIG.REFRESH_TOKEN_STORAGE_KEY, refreshToken),

			setUserData(user),
		]);

		setState({ user, isAuthenticated: true, isLoading: false });
	}, []);

	const register = useCallback(async (formValues: RegisterFormValues) => {
		await authService.register(formValues);
	}, []);

	const logout = useCallback(async () => {
		try {
			const refreshToken = await getStorageItem<string>(AUTH_CONFIG.REFRESH_TOKEN_STORAGE_KEY);
			if (refreshToken) await authService.logout({ refreshToken });
		} catch (err) {
			logError(err, { context: "logout" });
		} finally {
			await clearStorage();
			setState({ user: null, isAuthenticated: false, isLoading: false });
		}
	}, []);

	const forgotPassword = useCallback(async (payload: ForgotPasswordPayload) => {
		await authService.forgotPassword(payload);
	}, []);

	const verifyEmail = useCallback(async (payload: VerifyEmailPayload) => {
		await authService.verifyEmail(payload);
	}, []);

	const resendVerification = useCallback(async (payload: ResendVerificationPayload) => {
		await authService.resendVerification(payload);
	}, []);

	const verifyResetOtp = useCallback(async (payload: VerifyResetOtpPayload): Promise<void> => {
		await authService.verifyResetOtp(payload);
	}, []);

	const resetPassword = useCallback(async (payload: ResetPasswordPayload) => {
		await authService.resetPassword(payload);
	}, []);

	const updateUser = useCallback(async (user: User) => {
		await setUserData(user);
		setState((s) => ({ ...s, user }));
	}, []);

	return (
		<AuthContext.Provider
			value={{
				...state,
				login,
				register,
				logout,
				forgotPassword,
				verifyEmail,
				resendVerification,
				verifyResetOtp,
				resetPassword,
				updateUser,
			}}>
			{children}
		</AuthContext.Provider>
	);
}
