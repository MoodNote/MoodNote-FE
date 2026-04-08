import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

import { EMOTION_EMOJI } from "@/constants";
import { useThemeColors } from "@/hooks";
import type { ThemeColors } from "@/theme";
import type { EmotionType } from "@/types/entry.types";
import { s } from "@/utils";

interface Props {
	emotion: EmotionType | null;
	size?: number;
}

const EMOTION_TO_MOOD_KEY: Record<EmotionType, keyof ThemeColors["mood"]> = {
	Enjoyment: "enjoyment",
	Sadness: "sadness",
	Anger: "anger",
	Fear: "fear",
	Disgust: "disgust",
	Surprise: "surprise",
	Other: "other",
};

export function EmotionIcon({ emotion, size = 36 }: Props) {
	const colors = useThemeColors();
	const styles = useMemo(() => createStyles(colors, size), [colors, size]);

	const emoji = emotion != null ? EMOTION_EMOJI[emotion] : "⭕";
	const borderColor =
		emotion != null ? colors.mood[EMOTION_TO_MOOD_KEY[emotion]] : colors.border.subtle;

	return (
		<View style={[styles.circle, { borderColor }]}>
			<Text style={styles.emoji}>{emoji}</Text>
		</View>
	);
}

function createStyles(colors: ThemeColors, size: number) {
	return StyleSheet.create({
		circle: {
			width: s(size),
			height: s(size),
			borderRadius: s(size) / 2,
			borderWidth: 2,
			backgroundColor: colors.background.card,
			alignItems: "center",
			justifyContent: "center",
		},
		emoji: {
			fontSize: s(size * 0.5),
		},
	});
}
