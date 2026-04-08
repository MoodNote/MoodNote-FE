// Statistics screen data: weekly sentiment + monthly calendar

import { statsService } from "@/services";
import type { MonthlyCalendar, WeeklyStats } from "@/types/stats.types";
import { logError } from "@/utils";
import { useCallback, useEffect, useState } from "react";

/** Returns YYYY-MM-DD for the Monday of the current week */
function getCurrentMonday(): string {
	const d = new Date();
	const day = d.getDay(); // 0=Sun
	const diff = day === 0 ? -6 : 1 - day;
	d.setDate(d.getDate() + diff);
	return d.toISOString().split("T")[0] ?? "";
}

/** Add/subtract days from a YYYY-MM-DD string */
function shiftDate(dateStr: string, days: number): string {
	const d = new Date(dateStr);
	d.setDate(d.getDate() + days);
	return d.toISOString().split("T")[0] ?? "";
}

interface UseStatisticsResult {
	weeklyData: WeeklyStats | null;
	calendarData: MonthlyCalendar | null;
	weekStartDate: string;
	calendarYear: number;
	calendarMonth: number;
	isLoadingWeekly: boolean;
	isLoadingCalendar: boolean;
	goToPrevWeek: () => void;
	goToNextWeek: () => void;
	isNextWeekDisabled: boolean;
	setCalendarMonth: (year: number, month: number) => void;
}

export function useStatistics(): UseStatisticsResult {
	const today = new Date().toISOString().split("T")[0] ?? "";
	const now = new Date();

	const [weekStartDate, setWeekStartDate] = useState<string>(getCurrentMonday());
	const [calendarYear, setCalendarYear] = useState<number>(now.getFullYear());
	const [calendarMonth, setCalendarMonthState] = useState<number>(now.getMonth() + 1);

	const [weeklyData, setWeeklyData] = useState<WeeklyStats | null>(null);
	const [calendarData, setCalendarData] = useState<MonthlyCalendar | null>(null);
	const [isLoadingWeekly, setIsLoadingWeekly] = useState(true);
	const [isLoadingCalendar, setIsLoadingCalendar] = useState(true);

	// Fetch weekly data whenever weekStartDate changes
	useEffect(() => {
		let cancelled = false;
		const fetch = async () => {
			setIsLoadingWeekly(true);
			const res = await statsService.getWeekly(weekStartDate);
			if (cancelled) return;
			if (res.success) {
				setWeeklyData(res.data);
			} else {
				logError(res.error, { context: "useStatistics.getWeekly" });
			}
			setIsLoadingWeekly(false);
		};
		void fetch();
		return () => {
			cancelled = true;
		};
	}, [weekStartDate]);

	// Fetch calendar data whenever year/month changes
	useEffect(() => {
		let cancelled = false;
		const fetch = async () => {
			setIsLoadingCalendar(true);
			const res = await statsService.getMonthlyCalendar(calendarYear, calendarMonth);
			if (cancelled) return;
			if (res.success) {
				setCalendarData(res.data);
			} else {
				logError(res.error, { context: "useStatistics.getMonthlyCalendar" });
			}
			setIsLoadingCalendar(false);
		};
		void fetch();
		return () => {
			cancelled = true;
		};
	}, [calendarYear, calendarMonth]);

	const goToPrevWeek = useCallback(() => {
		setWeekStartDate((prev) => shiftDate(prev, -7));
	}, []);

	const goToNextWeek = useCallback(() => {
		setWeekStartDate((prev) => shiftDate(prev, 7));
	}, []);

	// Disable next-week button when endDate (startDate + 6) >= today
	const endDate = shiftDate(weekStartDate, 6);
	const isNextWeekDisabled = endDate >= today;

	const setCalendarMonth = useCallback((year: number, month: number) => {
		setCalendarYear(year);
		setCalendarMonthState(month);
	}, []);

	return {
		weeklyData,
		calendarData,
		weekStartDate,
		calendarYear,
		calendarMonth,
		isLoadingWeekly,
		isLoadingCalendar,
		goToPrevWeek,
		goToNextWeek,
		isNextWeekDisabled,
		setCalendarMonth,
	};
}
