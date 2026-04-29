import { apiService as api } from "@/lib/api";
import type { ApiResponse } from "@/types";
import type {
	DeleteAccountPayload,
	ExportData,
	ImportData,
	ImportResult,
	UpdateProfilePayload,
	UpdateSettingsPayload,
	User,
	UserSettings,
} from "@/types/user.types";
import { withErrorHandling } from "@/utils/error";

// FR-05: User profile management
export const userService = {
	// GET /users/me → data: User (flat, not nested)
	getMe: withErrorHandling(() => api.get<ApiResponse<User>>("/users/me")),

	// PATCH /users/me → data: User
	updateMe: withErrorHandling((payload: UpdateProfilePayload) =>
		api.patch<ApiResponse<User>>("/users/me", payload),
	),

	// GET /users/settings → data: { settings: UserSettings }
	getSettings: withErrorHandling(() =>
		api.get<ApiResponse<{ settings: UserSettings }>>("/users/settings"),
	),

	// PATCH /users/settings → data: { settings: UserSettings }
	updateSettings: withErrorHandling((payload: UpdateSettingsPayload) =>
		api.patch<ApiResponse<{ settings: UserSettings }>>("/users/settings", payload),
	),

	// NFR-11: GET /users/me/export → data: ExportData
	exportData: withErrorHandling(() => api.get<ApiResponse<ExportData>>("/users/me/export")),

	// NFR-11: DELETE /users/me → no data (requires password confirmation)
	deleteAccount: withErrorHandling((payload: DeleteAccountPayload) =>
		api.delete<ApiResponse<null>>("/users/me", { data: payload }),
	),

	// NFR-11: POST /users/me/import → data: ImportResult
	importData: withErrorHandling((payload: ImportData) =>
		api.post<ApiResponse<ImportResult>>("/users/me/import", payload),
	),
};
