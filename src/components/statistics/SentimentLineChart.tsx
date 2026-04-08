import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

import { EMOTION_EMOJI } from "@/constants";
import { useThemeColors } from "@/hooks";
import { FONT_SIZE, LINE_HEIGHT, SPACING } from "@/theme";
import type { ThemeColors } from "@/theme";
import type { WeeklyDay } from "@/types/stats.types";
import { s, vs } from "@/utils";

interface Props {
	days: WeeklyDay[];
	width: number;
	height?: number;
}

interface Point {
	x: number;
	y: number;
	day: WeeklyDay;
}

/** Map sentimentScore (-1..1) to Y coordinate (0..chartH, inverted) */
function scoreToY(score: number, chartH: number): number {
	// score -1 → bottom (chartH), score 1 → top (0)
	return chartH * (1 - (score + 1) / 2);
}

/** Build a smooth cubic bezier SVG path through the given points */
function buildPath(points: Point[]): string {
	if (points.length === 0) return "";
	if (points.length === 1) return `M ${points[0]!.x} ${points[0]!.y}`;

	let d = `M ${points[0]!.x} ${points[0]!.y}`;
	for (let i = 1; i < points.length; i++) {
		const prev = points[i - 1]!;
		const curr = points[i]!;
		const cp1x = prev.x + (curr.x - prev.x) / 3;
		const cp1y = prev.y;
		const cp2x = curr.x - (curr.x - prev.x) / 3;
		const cp2y = curr.y;
		d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
	}
	return d;
}

export function SentimentLineChart({ days, width, height = vs(160) }: Props) {
	const colors = useThemeColors();
	const styles = useMemo(() => createStyles(colors), [colors]);

	const PADDING_H = SPACING[16];
	const PADDING_V = vs(16);
	const chartW = width - PADDING_H * 2;
	const chartH = height - PADDING_V * 2;
	const colW = chartW / 6; // 7 columns → 6 gaps

	const points = useMemo<Point[]>(() => {
		return days
			.map((day, i) => {
				if (!day.hasEntry || day.sentimentScore == null) return null;
				return {
					x: PADDING_H + i * colW,
					y: PADDING_V + scoreToY(day.sentimentScore, chartH),
					day,
				};
			})
			.filter((p): p is Point => p !== null);
	}, [days, colW, chartH, PADDING_H, PADDING_V]);

	const pathD = useMemo(() => buildPath(points), [points]);

	// Midline Y (score = 0)
	const midY = PADDING_V + scoreToY(0, chartH);

	return (
		<View>
			<Svg width={width} height={height} style={styles.svg}>
				{/* Zero line */}
				<Path
					d={`M ${PADDING_H} ${midY} L ${width - PADDING_H} ${midY}`}
					stroke={colors.border.subtle}
					strokeWidth={1}
					strokeDasharray="4,4"
				/>

				{/* Sentiment curve */}
				{points.length > 1 && (
					<Path
						d={pathD}
						stroke={colors.brand.primary}
						strokeWidth={2.5}
						fill="none"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				)}

				{/* Data point circles */}
				{points.map((p) => (
					<Circle
						key={p.day.date}
						cx={p.x}
						cy={p.y}
						r={s(5)}
						fill={colors.brand.primary}
						stroke={colors.background.primary}
						strokeWidth={2}
					/>
				))}
			</Svg>

			{/* Emotion emoji overlay — positioned absolutely above each data point */}
			{points.map((p) => {
				const emoji = p.day.emotion != null ? EMOTION_EMOJI[p.day.emotion] : null;
				if (emoji == null) return null;
				const emojiSize = s(28);
				return (
					<View
						key={`emoji-${p.day.date}`}
						style={[
							styles.emojiOverlay,
							{
								left: p.x - emojiSize / 2,
								top: p.y - emojiSize - vs(6),
							},
						]}
						pointerEvents="none">
						<Text style={styles.emojiText}>{emoji}</Text>
					</View>
				);
			})}

			{/* Day labels row */}
			<View style={[styles.labelsRow, { paddingHorizontal: PADDING_H }]}>
				{days.map((day, i) => (
					<View key={day.date} style={[styles.labelCell, { width: colW }]}>
						<Text style={styles.dayLabel}>{day.dayLabel}</Text>
					</View>
				))}
			</View>
		</View>
	);
}

function createStyles(colors: ThemeColors) {
	return StyleSheet.create({
		svg: {
			overflow: "visible",
		},
		emojiOverlay: {
			position: "absolute",
		},
		emojiText: {
			fontSize: s(22),
		},
		labelsRow: {
			flexDirection: "row",
			marginTop: vs(4),
		},
		labelCell: {
			alignItems: "center",
		},
		dayLabel: {
			fontSize: FONT_SIZE[11],
			color: colors.text.muted,
			lineHeight: LINE_HEIGHT.tight,
		},
	});
}
