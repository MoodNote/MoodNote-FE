import { useCallback, useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useThemeColors } from "@/hooks";
import { FONT_SIZE, LINE_HEIGHT, RADIUS, SPACING } from "@/theme";
import type { ThemeColors } from "@/theme";
import type { CalendarDay, MonthlyCalendar as MonthlyCalendarData } from "@/types/stats.types";
import { s, vs } from "@/utils";
import { Ionicons } from "@expo/vector-icons";
import { EmotionIcon } from "./EmotionIcon";

interface Props {
	data: MonthlyCalendarData;
	onChangeMonth: (year: number, month: number) => void;
}

const DAY_HEADERS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

export function MonthlyCalendar({ data, onChangeMonth }: Props) {
	const colors = useThemeColors();
	const styles = useMemo(() => createStyles(colors), [colors]);

	const today = new Date().toISOString().split("T")[0] ?? "";

	// Build calendar grid: offset empty cells at start, then fill days
	const cells = useMemo<(CalendarDay | null)[]>(() => {
		const firstDay = new Date(data.year, data.month - 1, 1);
		// getDay(): 0=Sun,1=Mon,...,6=Sat → convert to Mon-start: (day+6)%7
		const offset = (firstDay.getDay() + 6) % 7;
		return [...Array<null>(offset).fill(null), ...data.days];
	}, [data]);

	// Pad to complete last row
	const paddedCells = useMemo<(CalendarDay | null)[]>(() => {
		const remainder = cells.length % 7;
		if (remainder === 0) return cells;
		return [...cells, ...Array<null>(7 - remainder).fill(null)];
	}, [cells]);

	const rows = useMemo<(CalendarDay | null)[][]>(() => {
		const result: (CalendarDay | null)[][] = [];
		for (let i = 0; i < paddedCells.length; i += 7) {
			result.push(paddedCells.slice(i, i + 7));
		}
		return result;
	}, [paddedCells]);

	const currentYear = new Date().getFullYear();
	const currentMonth = new Date().getMonth() + 1;

	const isNextDisabled =
		data.year > currentYear ||
		(data.year === currentYear && data.month >= currentMonth);

	const handlePrev = useCallback(() => {
		let y = data.year;
		let m = data.month - 1;
		if (m < 1) {
			m = 12;
			y -= 1;
		}
		onChangeMonth(y, m);
	}, [data.year, data.month, onChangeMonth]);

	const handleNext = useCallback(() => {
		let y = data.year;
		let m = data.month + 1;
		if (m > 12) {
			m = 1;
			y += 1;
		}
		onChangeMonth(y, m);
	}, [data.year, data.month, onChangeMonth]);

	return (
		<View>
			{/* Month selector header */}
			<View style={styles.monthHeader}>
				<Text style={styles.monthLabel}>{`Tháng ${data.month}`}</Text>
				<View style={styles.navRow}>
					<Pressable
						onPress={handlePrev}
						hitSlop={8}
						accessibilityRole="button"
						accessibilityLabel="Tháng trước">
						<Ionicons name="chevron-back" size={s(20)} color={colors.brand.primary} />
					</Pressable>
					<Pressable
						onPress={handleNext}
						hitSlop={8}
						disabled={isNextDisabled}
						accessibilityRole="button"
						accessibilityLabel="Tháng sau">
						<Ionicons
							name="chevron-forward"
							size={s(20)}
							color={isNextDisabled ? colors.interactive.disabled : colors.brand.primary}
						/>
					</Pressable>
				</View>
			</View>

			{/* Weekday headers */}
			<View style={styles.headerRow}>
				{DAY_HEADERS.map((h) => (
					<Text key={h} style={styles.headerCell}>
						{h}
					</Text>
				))}
			</View>

			{/* Calendar rows */}
			{rows.map((row, rowIdx) => (
				<View key={rowIdx} style={styles.row}>
					{row.map((cell, colIdx) => {
						if (cell == null) {
							return <View key={`empty-${rowIdx}-${colIdx}`} style={styles.cell} />;
						}
						const isToday = cell.date === today;
						return (
							<View key={cell.date} style={[styles.cell, isToday && styles.todayCell]}>
								<Text style={[styles.dayNumber, isToday && styles.todayNumber]}>
									{cell.day}
								</Text>
								<EmotionIcon emotion={cell.emotion} size={22} />
							</View>
						);
					})}
				</View>
			))}
		</View>
	);
}

function createStyles(colors: ThemeColors) {
	return StyleSheet.create({
		monthHeader: {
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",
			marginBottom: SPACING[12],
		},
		monthLabel: {
			fontSize: FONT_SIZE[17],
			fontWeight: "600",
			color: colors.text.primary,
		},
		navRow: {
			flexDirection: "row",
			gap: s(8),
		},
		headerRow: {
			flexDirection: "row",
			marginBottom: SPACING[4],
		},
		headerCell: {
			flex: 1,
			textAlign: "center",
			fontSize: FONT_SIZE[12],
			fontWeight: "600",
			color: colors.text.muted,
			lineHeight: LINE_HEIGHT.normal,
		},
		row: {
			flexDirection: "row",
		},
		cell: {
			flex: 1,
			alignItems: "center",
			paddingVertical: vs(4),
			gap: vs(2),
		},
		todayCell: {
			backgroundColor: colors.brand.surface,
			borderRadius: RADIUS.sm,
		},
		dayNumber: {
			fontSize: FONT_SIZE[11],
			color: colors.text.secondary,
			lineHeight: LINE_HEIGHT.tight,
		},
		todayNumber: {
			color: colors.brand.primary,
			fontWeight: "700",
		},
	});
}
