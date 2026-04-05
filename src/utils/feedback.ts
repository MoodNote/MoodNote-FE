import type { ThemeColors } from "@/theme";
import type { NotificationPopupType } from "@/types";

interface NotificationPopupTypeColors {
	bg: string;
	accent: string;
	icon: string;
}

export function getNotificationPopupTypeColors(
	type: NotificationPopupType,
	colors: ThemeColors,
): NotificationPopupTypeColors {
	switch (type) {
		case "info":
			return {
				bg: colors.background.elevated,
				accent: colors.status.info,
				icon: colors.status.info,
			};
		case "success":
			return {
				bg: colors.background.elevated,
				accent: colors.status.success,
				icon: colors.status.success,
			};
		case "warning":
			return {
				bg: colors.background.elevated,
				accent: colors.status.warning,
				icon: colors.status.warning,
			};
		case "error":
			return {
				bg: colors.background.elevated,
				accent: colors.status.error,
				icon: colors.status.error,
			};
	}
}
