import { useMemo } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { useThemeColors } from "@/hooks";
import { FONT_SIZE, SPACING } from "@/theme";
import type { ThemeColors } from "@/theme";
import type { LoadingSpinnerProps } from "@/types";

export function LoadingSpinner({
	size = "large",
	color,
	overlay = true,
	message,
}: LoadingSpinnerProps) {
	const colors = useThemeColors();
	const spinnerColor = color ?? colors.brand.primary;
	const styles = useMemo(() => createStyles(colors), [colors]);

	const spinner = (
		<>
			<ActivityIndicator size={size} color={spinnerColor} />
			{message != null && <Text style={styles.message}>{message}</Text>}
		</>
	);

	if (overlay) {
		return <View style={styles.overlay}>{spinner}</View>;
	}

	return <View style={styles.inline}>{spinner}</View>;
}

function createStyles(colors: ThemeColors) {
	return StyleSheet.create({
		overlay: {
			flex: 1,
			justifyContent: "center",
			alignItems: "center",
			backgroundColor: colors.background.primary,
		},
		inline: {
			alignItems: "center",
			justifyContent: "center",
			padding: SPACING[8],
		},
		message: {
			marginTop: SPACING[10],
			fontSize: FONT_SIZE[14],
			color: colors.text.muted,
			textAlign: "center",
		},
	});
}
