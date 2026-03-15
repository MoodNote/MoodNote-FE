import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import type { ThemeColors } from "@/theme";
import { FONT_SIZE, LINE_HEIGHT, RADIUS, SPACING } from "@/theme";
import { s } from "@/utils";
import type { IoniconName } from "@/constants";

interface Props {
	iconName: IoniconName;
	label: string;
	onPress: () => void;
	colors: ThemeColors;
}

export function MenuOption({ iconName, label, onPress, colors }: Props) {
	const styles = useMemo(() => createOptionStyles(colors), [colors]);
	return (
		<Pressable
			style={({ pressed }) => [styles.option, pressed && styles.optionPressed]}
			onPress={onPress}
			accessibilityRole="button"
			accessibilityLabel={label}>
			<Text style={styles.label}>{label}</Text>
			<View style={styles.iconWrap}>
				<Ionicons name={iconName} size={s(20)} color={colors.brand.onPrimary} />
			</View>
		</Pressable>
	);
}

function createOptionStyles(colors: ThemeColors) {
	return StyleSheet.create({
		option: {
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-between",
			paddingVertical: SPACING[14],
			paddingHorizontal: SPACING[20],
		},
		optionPressed: {
			backgroundColor: colors.brand.primaryPressed,
		},
		iconWrap: {
			width: s(40),
			height: s(40),
			borderRadius: RADIUS.md,
			backgroundColor: colors.brand.primaryPressed,
			alignItems: "center",
			justifyContent: "center",
		},
		label: {
			fontSize: FONT_SIZE[15],
			lineHeight: LINE_HEIGHT.normal,
			color: colors.brand.onPrimary,
			fontWeight: "500",
		},
	});
}
