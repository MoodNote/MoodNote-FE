// Statistics screen data: weekly sentiment + monthly calendar

import { statsService } from "@/services";
import type { MonthlyCalendar, WeeklyStats } from "@/types/stats.types";
import { getCurrentMonday, logError, shiftDate, todayDateString } from "@/utils";
import { useCallback, useEffect, useState } from "react";

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
	const today = todayDateString();
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
