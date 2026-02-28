import { useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";

import { useThemeColors } from "@/hooks";
import { FONT_SIZE, RADIUS, SPACING } from "@/theme";
import type { ThemeColors } from "@/theme";
import type { SegmentedControlProps } from "@/types";
import { s } from "@/utils";

export function SegmentedControl({ options, value, onChange }: SegmentedControlProps) {
	const colors = useThemeColors();
	const styles = useMemo(() => createStyles(colors), [colors]);

	return (
		<ScrollView
			horizontal
			showsHorizontalScrollIndicator={false}
			contentContainerStyle={styles.container}>
			{options.map((option) => {
				const isActive = option.value === value;
				return (
					<Pressable
						key={option.value}
						style={[styles.segment, isActive && styles.segmentActive]}
						onPress={() => onChange(option.value)}
						accessibilityRole="button"
						accessibilityState={{ selected: isActive }}>
						<Text style={[styles.label, isActive && styles.labelActive]}>
							{option.label}
						</Text>
					</Pressable>
				);
			})}
		</ScrollView>
	);
}

function createStyles(colors: ThemeColors) {
	return StyleSheet.create({
		container: {
			flexDirection: "row",
			gap: SPACING[6],
			paddingHorizontal: SPACING[2],
			paddingVertical: SPACING[2],
		},
		segment: {
			paddingVertical: s(7),
			paddingHorizontal: SPACING[16],
			borderRadius: RADIUS.sm,
			backgroundColor: colors.background.secondary,
		},
		segmentActive: { backgroundColor: colors.brand.primary },
		label: {
			fontSize: FONT_SIZE[14],
			fontWeight: "500",
			color: colors.text.secondary,
		},
		labelActive: { color: colors.text.inverse },
	});
}
