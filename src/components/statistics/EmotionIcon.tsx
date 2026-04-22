import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import {
	SmileyIcon,
	SmileySadIcon,
	SmileyAngryIcon,
	SmileyNervousIcon,
	SmileyWinkIcon,
	SmileyXEyesIcon,
	SmileyBlankIcon,
	type Icon,
} from "phosphor-react-native";

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

const EMOTION_ICON: Record<EmotionType, Icon> = {
	Enjoyment: SmileyIcon,
	Sadness: SmileySadIcon,
	Anger: SmileyAngryIcon,
	Fear: SmileyNervousIcon,
	Surprise: SmileyWinkIcon,
	Disgust: SmileyXEyesIcon,
	Other: SmileyBlankIcon,
};

export function EmotionIcon({ emotion, size = 36 }: Props) {
	const colors = useThemeColors();
	const styles = useMemo(() => createStyles(colors, size), [colors, size]);

	if (emotion == null) {
		return <View style={styles.emptyCircle} />;
	}

	const IconComponent = EMOTION_ICON[emotion];
	const borderColor = colors.mood[EMOTION_TO_MOOD_KEY[emotion]];
	const iconSize = s(size * 0.62);

	return (
		<View style={[styles.circle, { borderColor }]}>
			<IconComponent size={iconSize} color={borderColor} weight="fill" />
		</View>
	);
}

function createStyles(colors: ThemeColors, size: number) {
	const circleSize = s(size);
	const borderWidth = size >= 30 ? 2 : 1.5;
	return StyleSheet.create({
		circle: {
			width: circleSize,
			height: circleSize,
			borderRadius: circleSize / 2,
			borderWidth,
			backgroundColor: colors.background.card,
			alignItems: "center",
			justifyContent: "center",
		},
		emptyCircle: {
			width: circleSize,
			height: circleSize,
			borderRadius: circleSize / 2,
			borderWidth,
			borderColor: colors.border.subtle,
		},
	});
}
