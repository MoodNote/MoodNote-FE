// FR-10, FR-11, FR-12: Display emotion analysis result on journal detail screen

import { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { Badge } from "@/components/ui/display/Badge";
import {
	EMOTION_TYPE_LABELS,
	INTENSITY_LABELS,
	SENTIMENT_LABELS,
} from "@/constants/journal";
import { useThemeColors } from "@/hooks";
import type { ThemeColors } from "@/theme";
import { FONT_SIZE, LINE_HEIGHT, RADIUS, SPACING } from "@/theme";
import { s, vs } from "@/utils";
import type { EmotionAnalysis, EmotionType } from "@/types/entry.types";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getSentimentLabel(score: number): string {
	return (
		SENTIMENT_LABELS.find((item) => score <= item.max)?.label ??
		SENTIMENT_LABELS[SENTIMENT_LABELS.length - 1].label
	);
}

function getIntensityLabel(intensity: number): string {
	return (
		INTENSITY_LABELS.find((item) => intensity <= item.max)?.label ??
		INTENSITY_LABELS[INTENSITY_LABELS.length - 1].label
	);
}

// ─── Component ───────────────────────────────────────────────────────────────

interface Props {
	analysis: EmotionAnalysis;
}

export function EmotionAnalysisCard({ analysis }: Props) {
	const colors = useThemeColors();
	const styles = useMemo(() => createStyles(colors), [colors]);

	const emotionKey = analysis.primaryEmotion.toLowerCase() as keyof typeof colors.mood;
	const emotionColor = colors.mood[emotionKey] ?? colors.iconDefault;
	const sentimentLabel = getSentimentLabel(analysis.sentimentScore);
	const intensityLabel = getIntensityLabel(analysis.intensity);

	// Sentiment bar: 0% = -1.0, 50% = 0.0, 100% = +1.0
	const sentimentPercent = ((analysis.sentimentScore + 1) / 2) * 100;
	const sentimentFillColor =
		analysis.sentimentScore > 0.2
			? colors.status.success
			: analysis.sentimentScore < -0.2
				? colors.status.error
				: colors.text.muted;

	// Intensity bar: 0–100%
	const intensityPercent = Math.min(100, Math.max(0, analysis.intensity));

	// Emotion distribution — sort descending
	const distribution = analysis.emotionDistribution
		? (Object.entries(analysis.emotionDistribution) as [EmotionType, number][]).sort(
				([, a], [, b]) => b - a,
			)
		: null;

	return (
		<View style={styles.card}>
			{/* Primary emotion row */}
			<View style={styles.primaryRow}>
				<View style={[styles.emotionDot, { backgroundColor: emotionColor }]} />
				<Text style={styles.emotionLabel}>
					{EMOTION_TYPE_LABELS[analysis.primaryEmotion] ?? analysis.primaryEmotion}
				</Text>
				<View style={styles.sentimentChip}>
					<Text style={styles.sentimentChipText}>{sentimentLabel}</Text>
				</View>
			</View>

			{/* Sentiment score bar */}
			<View style={styles.metricRow}>
				<View style={styles.metricHeader}>
					<Text style={styles.metricLabel}>Cảm xúc tổng hợp</Text>
					<Text style={styles.metricValue}>{analysis.sentimentScore.toFixed(2)}</Text>
				</View>
				<View style={styles.track}>
					{/* Center marker */}
					<View style={styles.trackCenter} />
					<View
						style={[
							styles.sentimentFill,
							{
								width: `${sentimentPercent}%` as `${number}%`,
								backgroundColor: sentimentFillColor,
							},
						]}
					/>
				</View>
				<View style={styles.trackLabels}>
					<Text style={styles.trackEdgeLabel}>-1</Text>
					<Text style={styles.trackEdgeLabel}>0</Text>
					<Text style={styles.trackEdgeLabel}>+1</Text>
				</View>
			</View>

			{/* Intensity bar */}
			<View style={styles.metricRow}>
				<View style={styles.metricHeader}>
					<Text style={styles.metricLabel}>Cường độ — {intensityLabel}</Text>
					<Text style={styles.metricValue}>{Math.round(analysis.intensity)}/100</Text>
				</View>
				<View style={styles.track}>
					<View
						style={[
							styles.intensityFill,
							{
								width: `${intensityPercent}%` as `${number}%`,
								backgroundColor: colors.brand.primary,
							},
						]}
					/>
				</View>
			</View>

			{/* Keywords */}
			{analysis.keywords.length > 0 && (
				<View style={styles.keywordsSection}>
					<Text style={styles.sectionTitle}>Từ khóa</Text>
					<ScrollView
						horizontal
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={styles.keywordsContent}>
						{analysis.keywords.map((kw) => (
							<Badge key={kw} label={kw} size="sm" />
						))}
					</ScrollView>
				</View>
			)}

			{/* Emotion distribution */}
			{distribution && (
				<View style={styles.distributionSection}>
					<Text style={styles.sectionTitle}>Phân bổ cảm xúc</Text>
					{distribution.map(([emotion, value]) => {
						const key = emotion.toLowerCase() as keyof typeof colors.mood;
						const barColor = colors.mood[key] ?? colors.iconDefault;
						const barWidth = Math.round(value * 100);
						return (
							<View key={emotion} style={styles.distRow}>
								<Text style={styles.distLabel}>
									{EMOTION_TYPE_LABELS[emotion] ?? emotion}
								</Text>
								<View style={styles.distTrack}>
									<View
										style={[
											styles.distFill,
											{
												width: `${barWidth}%` as `${number}%`,
												backgroundColor: barColor,
											},
										]}
									/>
								</View>
								<Text style={styles.distPercent}>{barWidth}%</Text>
							</View>
						);
					})}
				</View>
			)}
		</View>
	);
}

function createStyles(colors: ThemeColors) {
	return StyleSheet.create({
		card: {
			backgroundColor: colors.background.card,
			borderRadius: RADIUS.lg,
			padding: SPACING[16],
			gap: SPACING[12],
			marginTop: SPACING[12],
		},
		primaryRow: {
			flexDirection: "row",
			alignItems: "center",
			gap: s(8),
		},
		emotionDot: {
			width: s(10),
			height: vs(10),
			borderRadius: RADIUS.full,
		},
		emotionLabel: {
			fontSize: FONT_SIZE[15],
			fontWeight: "600",
			color: colors.text.primary,
			flex: 1,
		},
		sentimentChip: {
			backgroundColor: colors.background.elevated,
			borderRadius: RADIUS.full,
			paddingHorizontal: SPACING[8],
			paddingVertical: SPACING[2],
		},
		sentimentChipText: {
			fontSize: FONT_SIZE[11],
			color: colors.text.secondary,
			lineHeight: LINE_HEIGHT.tight,
		},
		metricRow: {
			gap: s(4),
		},
		metricHeader: {
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",
		},
		metricLabel: {
			fontSize: FONT_SIZE[12],
			color: colors.text.secondary,
			lineHeight: LINE_HEIGHT.tight,
		},
		metricValue: {
			fontSize: FONT_SIZE[12],
			color: colors.text.muted,
			lineHeight: LINE_HEIGHT.tight,
		},
		track: {
			height: vs(6),
			backgroundColor: colors.border.subtle,
			borderRadius: RADIUS.full,
			overflow: "hidden",
		},
		trackCenter: {
			position: "absolute",
			left: "50%",
			top: 0,
			bottom: 0,
			width: 1,
			backgroundColor: colors.border.default,
		},
		sentimentFill: {
			height: "100%",
			borderRadius: RADIUS.full,
		},
		intensityFill: {
			height: "100%",
			borderRadius: RADIUS.full,
		},
		trackLabels: {
			flexDirection: "row",
			justifyContent: "space-between",
			marginTop: s(2),
		},
		trackEdgeLabel: {
			fontSize: FONT_SIZE[11],
			color: colors.text.muted,
			lineHeight: LINE_HEIGHT.tight,
		},
		keywordsSection: {
			gap: s(6),
		},
		sectionTitle: {
			fontSize: FONT_SIZE[12],
			fontWeight: "500",
			color: colors.text.secondary,
			lineHeight: LINE_HEIGHT.tight,
		},
		keywordsContent: {
			gap: s(6),
			flexDirection: "row",
		},
		distributionSection: {
			gap: s(6),
		},
		distRow: {
			flexDirection: "row",
			alignItems: "center",
			gap: s(8),
		},
		distLabel: {
			fontSize: FONT_SIZE[11],
			color: colors.text.secondary,
			width: s(64),
			lineHeight: LINE_HEIGHT.tight,
		},
		distTrack: {
			flex: 1,
			height: vs(4),
			backgroundColor: colors.border.subtle,
			borderRadius: RADIUS.full,
			overflow: "hidden",
		},
		distFill: {
			height: "100%",
			borderRadius: RADIUS.full,
		},
		distPercent: {
			fontSize: FONT_SIZE[11],
			color: colors.text.muted,
			width: s(28),
			textAlign: "right",
			lineHeight: LINE_HEIGHT.tight,
		},
	});
}
