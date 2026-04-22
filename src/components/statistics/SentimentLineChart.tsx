import { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { CartesianChart, Line, useAreaPath, useLinePath, type ChartBounds, type PointsArray } from "victory-native";
import { LinearGradient, Path, vec } from "@shopify/react-native-skia";
import Animated, { FadeIn, useSharedValue, withTiming, Easing, type SharedValue } from "react-native-reanimated";
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
import { FONT_SIZE, LINE_HEIGHT, SPACING } from "@/theme";
import type { ThemeColors } from "@/theme";
import type { EmotionType } from "@/types/entry.types";
import type { WeeklyDay } from "@/types/stats.types";
import { s, vs } from "@/utils";

interface Props {
	days: WeeklyDay[];
	width: number;
	height?: number;
}

type ChartDatum = {
	dayIndex: number;
	refScore: number;
	mainScore: number | null;
};

const DAY_FULL_LABEL: Record<string, string> = {
	T2: "Thứ 2",
	T3: "Thứ 3",
	T4: "Thứ 4",
	T5: "Thứ 5",
	T6: "Thứ 6",
	T7: "Thứ 7",
	CN: "CN",
};

const DOMAIN_MIN = -1.2;
const DOMAIN_MAX = 1.2;
const DOMAIN_RANGE = DOMAIN_MAX - DOMAIN_MIN;

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

interface GradientAreaProps {
	points: PointsArray;
	y0: number;
	startColor: string;
	endColor: string;
	chartBounds: ChartBounds;
	opacity: SharedValue<number>;
}

function GradientArea({ points, y0, startColor, endColor, chartBounds, opacity }: GradientAreaProps) {
	const { path } = useAreaPath(points, y0, { curveType: "natural", connectMissingData: false });
	return (
		<Path path={path} style="fill" opacity={opacity}>
			<LinearGradient
				start={vec(0, chartBounds.top)}
				end={vec(0, y0)}
				colors={[startColor, endColor]}
			/>
		</Path>
	);
}

interface AnimatedMainLineProps {
	points: PointsArray;
	color: string;
	strokeWidth: number;
	drawProgress: SharedValue<number>;
}

/**
 * Renders the main sentiment line with a left-to-right draw animation.
 * Must be a separate component so useLinePath hook runs inside the Skia canvas context.
 */
function AnimatedMainLine({ points, color, strokeWidth, drawProgress }: AnimatedMainLineProps) {
	const { path } = useLinePath(points, { curveType: "natural", connectMissingData: false });
	return (
		<Path
			path={path}
			style="stroke"
			strokeWidth={strokeWidth}
			color={color}
			end={drawProgress}
			strokeCap="round"
			strokeJoin="round"
		/>
	);
}

export function SentimentLineChart({ days, width, height = vs(180) }: Props) {
	const colors = useThemeColors();
	const styles = useMemo(() => createStyles(colors), [colors]);

	const drawProgress = useSharedValue(0);
	useEffect(() => {
		drawProgress.value = withTiming(1, { duration: 1100, easing: Easing.out(Easing.cubic) });
	}, [drawProgress]);

	const [chartBounds, setChartBounds] = useState<ChartBounds | null>(null);

	const chartData = useMemo<ChartDatum[]>(() => {
		return days.map((day, i) => ({
			dayIndex: i,
			refScore: day.hasEntry && day.sentimentScore != null ? day.sentimentScore : 0,
			mainScore: day.hasEntry && day.sentimentScore != null ? day.sentimentScore : null,
		}));
	}, [days]);

	const emojiPositions = useMemo<
		{ x: number; y: number; emotion: EmotionType; date: string }[]
	>(() => {
		if (!chartBounds) return [];
		const chartW = chartBounds.right - chartBounds.left;
		const chartH = chartBounds.bottom - chartBounds.top;
		return days
			.map((day, i) => {
				if (!day.hasEntry || day.sentimentScore == null || !day.emotion) return null;
				const x = chartBounds.left + (i / 6) * chartW;
				const y = chartBounds.top + ((DOMAIN_MAX - day.sentimentScore) / DOMAIN_RANGE) * chartH;
				return { x, y, emotion: day.emotion, date: day.date };
			})
			.filter(
				(p): p is { x: number; y: number; emotion: EmotionType; date: string } => p !== null,
			);
	}, [chartBounds, days]);

	const brandColor = colors.brand.primary;
	const gradientStart = `${brandColor}4D`;
	const gradientEnd = `${brandColor}00`;

	return (
		<View>
			<View style={{ height, width }}>
				<CartesianChart
					data={chartData}
					xKey="dayIndex"
					yKeys={["refScore", "mainScore"]}
					domain={{ y: [DOMAIN_MIN, DOMAIN_MAX] }}
					domainPadding={{ left: SPACING[16], right: SPACING[16] }}
					onChartBoundsChange={setChartBounds}>
					{({ points, chartBounds: bounds }) => (
						<>
							{/* Gray reference curve — static background guide */}
							<Line
								points={points.refScore}
								color={colors.border.subtle}
								strokeWidth={s(2)}
								curveType="natural"
								opacity={0.55}
							/>

							{/* Gradient area — fades in alongside the line drawing */}
							<GradientArea
								points={points.mainScore}
								y0={bounds.bottom}
								startColor={gradientStart}
								endColor={gradientEnd}
								chartBounds={bounds}
								opacity={drawProgress}
							/>

							{/* Main entry curve — draws from left to right */}
							<AnimatedMainLine
								points={points.mainScore}
								color={brandColor}
								strokeWidth={s(3)}
								drawProgress={drawProgress}
							/>
						</>
					)}
				</CartesianChart>

				{/* Icon overlays — fade in after line finishes drawing */}
				{emojiPositions.map((p) => {
					const IconComponent = EMOTION_ICON[p.emotion];
					const iconColor = colors.mood[EMOTION_TO_MOOD_KEY[p.emotion]];
					const iconSize = s(28);
					return (
						<Animated.View
							key={p.date}
							entering={FadeIn.delay(900).duration(300)}
							style={[
								styles.iconOverlay,
								{
									left: p.x - iconSize / 2,
									top: p.y - iconSize - vs(4),
								},
							]}
							pointerEvents="none">
							<IconComponent size={iconSize} color={iconColor} weight="fill" />
						</Animated.View>
					);
				})}
			</View>

			{/* Day labels row */}
			<View style={[styles.labelsRow, { paddingHorizontal: SPACING[16] }]}>
				{days.map((day) => (
					<View key={day.date} style={styles.labelCell}>
						<Text style={styles.dayLabel} numberOfLines={1} adjustsFontSizeToFit>
							{DAY_FULL_LABEL[day.dayLabel] ?? day.dayLabel}
						</Text>
					</View>
				))}
			</View>
		</View>
	);
}

function createStyles(colors: ThemeColors) {
	return StyleSheet.create({
		iconOverlay: {
			position: "absolute",
		},
		labelsRow: {
			flexDirection: "row",
			marginTop: vs(6),
		},
		labelCell: {
			flex: 1,
			alignItems: "center",
		},
		dayLabel: {
			fontSize: FONT_SIZE[11],
			color: colors.text.muted,
			lineHeight: LINE_HEIGHT.tight,
		},
	});
}
