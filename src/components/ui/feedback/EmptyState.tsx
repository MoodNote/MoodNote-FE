import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

import { useThemeColors } from "@/hooks";
import type { ThemeColors } from "@/theme";
import { FONT_SIZE, LINE_HEIGHT, SPACING } from "@/theme";
import type { EmptyStateProps } from "@/types";
import { Button } from "../buttons/Button";

export function EmptyState({ icon, title, subtitle, action }: EmptyStateProps) {
	const colors = useThemeColors();
	const styles = useMemo(() => createStyles(colors), [colors]);

	return (
		<View style={styles.container}>
			{icon != null && <View style={styles.iconWrapper}>{icon}</View>}
			<Text style={styles.title}>{title}</Text>
			{subtitle != null && <Text style={styles.subtitle}>{subtitle}</Text>}
			{action != null && (
				<View style={styles.actionWrapper}>
					<Button title={action.label} onPress={action.onPress} variant="outline" size="sm" />
				</View>
			)}
		</View>
	);
}

function createStyles(colors: ThemeColors) {
	return StyleSheet.create({
		container: {
			flex: 1,
			alignItems: "center",
			justifyContent: "center",
			paddingHorizontal: SPACING[32],
			paddingVertical: SPACING[48],
		},
		iconWrapper: { marginBottom: SPACING[16], opacity: 0.6 },
		title: {
			fontSize: FONT_SIZE[17],
			fontWeight: "600",
			color: colors.text.primary,
			textAlign: "center",
			marginBottom: SPACING[8],
		},
		subtitle: {
			fontSize: FONT_SIZE[14],
			color: colors.text.muted,
			textAlign: "center",
			lineHeight: LINE_HEIGHT.normal,
		},
		actionWrapper: { marginTop: SPACING[20] },
	});
}
