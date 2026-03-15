import { actions } from "react-native-pell-rich-editor";

export const TOOLBAR_ACTIONS = [
	actions.heading1,
	actions.heading2,
	actions.setBold,
	actions.setItalic,
	actions.insertBulletsList,
	actions.insertOrderedList,
];

export const ANALYSIS_STATUS_LABELS: Record<string, string> = {
	PENDING: "Chờ phân tích",
	PROCESSING: "Đang phân tích",
	COMPLETED: "Đã phân tích",
	FAILED: "Phân tích lỗi",
};
