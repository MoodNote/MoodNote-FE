// Context value shapes — consumed by useAuth, useThemeContext

import type { RegisterFormValues } from "@/schemas";
import type { ColorScheme, ThemeColors } from "@/theme/tokens";
import type {
	ForgotPasswordPayload,
	LoginPayload,
	ResendVerificationPayload,
	ResetPasswordPayload,
	User,
	VerifyEmailPayload,
	VerifyResetOtpPayload,
} from "@/types/user.types";

// ─── Auth ──────────────────────────────────────────────────────────────────────

export interface AuthContextValue {
	// State
	user: User | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	// Actions
	login: (payload: LoginPayload) => Promise<void>;
	register: (formValues: RegisterFormValues) => Promise<void>;
	logout: () => Promise<void>;
	forgotPassword: (payload: ForgotPasswordPayload) => Promise<void>;
	verifyEmail: (payload: VerifyEmailPayload) => Promise<void>;
	resendVerification: (payload: ResendVerificationPayload) => Promise<void>;
	verifyResetOtp: (payload: VerifyResetOtpPayload) => Promise<void>;
	resetPassword: (payload: ResetPasswordPayload) => Promise<void>;
	updateUser: (user: User) => Promise<void>;
}

// ─── Theme ─────────────────────────────────────────────────────────────────────

export interface ThemeContextValue {
	colorScheme: ColorScheme;
	colors: ThemeColors;
	setTheme: (scheme: ColorScheme) => void;
	toggleTheme: () => void;
}

