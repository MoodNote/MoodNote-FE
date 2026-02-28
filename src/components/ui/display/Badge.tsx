import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useThemeColors } from "@/hooks";
import type { ThemeColors } from "@/theme";
import { FONT_SIZE, RADIUS, SPACING } from "@/theme";
import type { BadgeProps } from "@/types";

export function Badge({ label, color, textColor, size = "md", onPress, onDismiss }: BadgeProps) {
	const colors = useThemeColors();
	const bgColor = color ?? colors.brand.surface;
	const txtColor = textColor ?? colors.brand.primary;

	const styles = useMemo(
		() => createStyles(colors, bgColor, txtColor),
		[colors, bgColor, txtColor],
	);

	const dismissIconSize = size === "sm" ? FONT_SIZE[12] : FONT_SIZE[14];

	const content = (
		<View style={[styles.badge, size === "sm" && styles.badgeSm]}>
			<Text style={[styles.text, size === "sm" && styles.textSm]}>{label}</Text>
			{onDismiss != null && (
				<Pressable
					onPress={onDismiss}
					hitSlop={6}
					style={styles.dismissButton}
					accessibilityLabel={`Xoá ${label}`}
					accessibilityRole="button">
					<Ionicons name="close" size={dismissIconSize} color={txtColor} />
				</Pressable>
			)}
		</View>
	);

	if (onPress != null) {
		return (
			<Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={label}>
				{content}
			</Pressable>
		);
	}

	return content;
}

function createStyles(_colors: ThemeColors, bgColor: string, txtColor: string) {
	return StyleSheet.create({
		badge: {
			flexDirection: "row",
			alignItems: "center",
			borderRadius: RADIUS.full,
			paddingVertical: SPACING[4],
			paddingHorizontal: SPACING[12],
			alignSelf: "flex-start",
			backgroundColor: bgColor,
		},
		badgeSm: { paddingVertical: SPACING[2], paddingHorizontal: SPACING[8] },
		text: { fontSize: FONT_SIZE[13], fontWeight: "500", color: txtColor },
		textSm: { fontSize: FONT_SIZE[11] },
		dismissButton: { marginLeft: SPACING[4] },
	});
}
