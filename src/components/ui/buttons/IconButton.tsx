import { useMemo } from "react";
import { Pressable, StyleSheet } from "react-native";

import { useThemeColors } from "@/hooks";
import { RADIUS, SIZE } from "@/theme";
import type { ThemeColors } from "@/theme";
import type { IconButtonProps } from "@/types";

export function IconButton({
	icon,
	onPress,
	size = "md",
	variant = "ghost",
	accessibilityLabel,
	hitSlop = 8,
	disabled,
}: IconButtonProps) {
	const colors = useThemeColors();
	const styles = useMemo(() => createStyles(colors), [colors]);

	return (
		<Pressable
			style={[styles.base, styles[size], styles[variant], disabled && styles.disabled]}
			onPress={onPress}
			disabled={disabled}
			hitSlop={hitSlop}
			accessibilityLabel={accessibilityLabel}
			accessibilityRole="button">
			{icon}
		</Pressable>
	);
}

function createStyles(colors: ThemeColors) {
	return StyleSheet.create({
		base: {
			alignItems: "center",
			justifyContent: "center",
			borderRadius: RADIUS.full,
		},
		// Sizes
		sm: { width: SIZE.xs, height: SIZE.xs },
		md: { width: SIZE.sm, height: SIZE.sm },
		lg: { width: SIZE.lg, height: SIZE.lg },
		// Variants
		ghost: { backgroundColor: "transparent" },
		filled: { backgroundColor: colors.background.elevated },
		outline: {
			backgroundColor: "transparent",
			borderWidth: 1,
			borderColor: colors.border.default,
		},
		// State
		disabled: { opacity: 0.5 },
	});
}
