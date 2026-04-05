import { INTENSITY_LABELS, SENTIMENT_LABELS } from "@/constants";

export function getSentimentLabel(score: number): string {
	return (
		SENTIMENT_LABELS.find((item) => score <= item.max)?.label ??
		SENTIMENT_LABELS[SENTIMENT_LABELS.length - 1].label
	);
}

export function getIntensityLabel(intensity: number): string {
	return (
		INTENSITY_LABELS.find((item) => intensity <= item.max)?.label ??
		INTENSITY_LABELS[INTENSITY_LABELS.length - 1].label
	);
}
