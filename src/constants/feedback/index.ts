import type { Ionicons } from "@expo/vector-icons";

import type { NotificationPopupType, StatusIndicatorStatus, ToastType } from "@/types";
import { vs } from "@/utils/responsive";

export const STATUS_INDICATOR_LABELS: Record<StatusIndicatorStatus, string> = {
	saving: "Đang lưu...",
	saved: "Đã lưu",
	error: "Lỗi lưu",
	online: "Online",
	offline: "Offline",
};

export const BANNER_HEIGHT = vs(36);

export const TOAST_ICON_MAP: Record<ToastType, React.ComponentProps<typeof Ionicons>["name"]> = {
	success: "checkmark-circle",
	error: "alert-circle",
	warning: "warning",
	info: "information-circle",
};

export type StatusColorKey = "success" | "error" | "warning" | "info";
export const TOAST_ICON_COLOR_KEY: Record<ToastType, StatusColorKey> = {
	success: "success",
	error: "error",
	warning: "warning",
	info: "info",
};

export const NOTIFICATION_POPUP_SLIDE_OFFSET = -120;

export const NOTIFICATION_POPUP_ICON_MAP: Record<
	NotificationPopupType,
	React.ComponentProps<typeof Ionicons>["name"]
> = {
	info: "information-circle",
	success: "checkmark-circle",
	warning: "warning",
	error: "close-circle",
};
