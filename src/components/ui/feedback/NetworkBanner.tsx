// NFR-04: Offline/syncing status banner

import { useSync, useThemeColors } from "@/hooks";
import type { ThemeColors } from "@/theme";
import { FONT_SIZE, LINE_HEIGHT, SPACING } from "@/theme";
import { BANNER_HEIGHT } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo } from "react";
import { StyleSheet, Text } from "react-native";
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";

export function NetworkBanner() {
	const { isOnline, isSyncing } = useSync();
	const colors = useThemeColors();
	const styles = useMemo(() => createStyles(colors), [colors]);

	const visible = !isOnline || isSyncing;
	const translateY = useSharedValue(visible ? 0 : -BANNER_HEIGHT);

	useEffect(() => {
		translateY.value = withTiming(visible ? 0 : -BANNER_HEIGHT, {
			duration: 250,
		});
	}, [visible, translateY]);

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ translateY: translateY.value }],
	}));

	const bgColor = isOnline ? colors.status.infoBackground : colors.status.warningBackground;
	const textColor = isOnline ? colors.status.info : colors.status.warning;
	const iconName: "sync-outline" | "cloud-offline-outline" = isOnline
		? "sync-outline"
		: "cloud-offline-outline";
	const label = isOnline
		? "Đang đồng bộ dữ liệu..."
		: "Bạn đang offline. Nhật ký sẽ đồng bộ khi có kết nối.";

	if (!visible) return null;

	return (
		<Animated.View style={[styles.container, { backgroundColor: bgColor }, animatedStyle]}>
			<Ionicons name={iconName} size={14} color={textColor} />
			<Text style={[styles.text, { color: textColor }]} numberOfLines={1}>
				{label}
			</Text>
		</Animated.View>
	);
}

function createStyles(colors: ThemeColors) {
	return StyleSheet.create({
		container: {
			position: "absolute",
			top: 0,
			left: 0,
			right: 0,
			height: BANNER_HEIGHT,
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "center",
			gap: SPACING[6],
			paddingHorizontal: SPACING[16],
			zIndex: 999,
		},
		text: {
			fontSize: FONT_SIZE[12],
			lineHeight: LINE_HEIGHT.tight,
		},
	});
}
