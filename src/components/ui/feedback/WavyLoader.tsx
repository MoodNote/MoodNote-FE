import { LinearGradient } from "expo-linear-gradient";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
	Easing,
	useAnimatedStyle,
	useSharedValue,
	withDelay,
	withRepeat,
	withSequence,
	withTiming,
} from "react-native-reanimated";

import { useThemeColors } from "@/hooks";
import type { WavyLoaderProps } from "@/types";

const STAGGER_MS = 100;
const DURATION_MS = 500;
const MAX_SCALE = 1.0;
const MIN_SCALE = 0.15;

function Bar({
	index,
	width,
	height,
	gap,
	solidColor,
	gradientColors,
	radius,
}: {
	index: number;
	width: number;
	height: number;
	gap: number;
	solidColor: string | undefined;
	gradientColors: readonly [string, string];
	radius: number;
}) {
	const scaleY = useSharedValue(MAX_SCALE);

	useEffect(() => {
		scaleY.value = withDelay(
			index * STAGGER_MS,
			withRepeat(
				withSequence(
					withTiming(MIN_SCALE, {
						duration: DURATION_MS,
						easing: Easing.inOut(Easing.sin),
					}),
					withTiming(MAX_SCALE, {
						duration: DURATION_MS,
						easing: Easing.inOut(Easing.sin),
					}),
				),
				-1,
				false,
			),
		);
	}, [index, scaleY]);

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ scaleY: scaleY.value }],
	}));

	if (solidColor !== undefined) {
		return (
			<Animated.View
				style={[
					{
						width,
						height,
						marginHorizontal: gap / 2,
						borderRadius: radius,
						backgroundColor: solidColor,
					},
					animatedStyle,
				]}
			/>
		);
	}

	return (
		<Animated.View
			style={[
				{
					width,
					height,
					marginHorizontal: gap / 2,
					borderRadius: radius,
					overflow: "hidden",
				},
				animatedStyle,
			]}>
			<LinearGradient
				colors={[gradientColors[0], gradientColors[1]]}
				start={{ x: 0.5, y: 0 }}
				end={{ x: 0.5, y: 1 }}
				style={styles.gradient}
			/>
		</Animated.View>
	);
}

export function WavyLoader({
	barCount = 5,
	barWidth = 4,
	barHeight = 40,
	gap = 5,
	color,
	gradientColors,
	borderRadius,
}: WavyLoaderProps) {
	const colors = useThemeColors();
	const radius = borderRadius ?? barWidth / 2;
	const resolvedGradient =
		gradientColors ?? ([colors.brand.secondary, colors.brand.primary] as const);
	const bars = Array.from({ length: barCount });

	return (
		<View style={styles.container}>
			{bars.map((_, i) => (
				<Bar
					key={i}
					index={i}
					width={barWidth}
					height={barHeight}
					gap={gap}
					solidColor={color}
					gradientColors={resolvedGradient}
					radius={radius}
				/>
			))}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
	},
	gradient: {
		flex: 1,
	},
});
