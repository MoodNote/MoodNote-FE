// Date/time formatting utilities — Vietnamese locale (vi-VN)

const LOCALE = "vi-VN" as const;

// ─── Display formatters ───────────────────────────────────────────────────────

/**
 * Short date: "15/06/2025"
 * Use for: fallback dates, compact displays
 */
export function formatShortDate(iso: string): string {
	return new Date(iso).toLocaleDateString(LOCALE, {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	});
}

/**
 * Date with abbreviated weekday: "T3, 15/06/2025"
 * Use for: journal entry cards, detail headers
 */
export function formatDateWithWeekday(iso: string): string {
	return new Date(iso).toLocaleDateString(LOCALE, {
		weekday: "short",
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	});
}

/**
 * Time only: "14:30"
 * Use for: notification reminders, time pickers
 */
export function formatTime(iso: string): string {
	return new Date(iso).toLocaleTimeString(LOCALE, {
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
	});
}

/**
 * Date + time: "15/06/2025 14:30"
 * Use for: detailed timestamps, logs
 */
export function formatDateTime(iso: string): string {
	return `${formatShortDate(iso)} ${formatTime(iso)}`;
}

/**
 * Month + year: "Tháng 6, 2025"
 * Use for: statistics headers, month groupings
 */
export function formatMonthYear(iso: string): string {
	return new Date(iso).toLocaleDateString(LOCALE, {
		month: "long",
		year: "numeric",
	});
}

/**
 * Relative time, falls back to short date after 48 hours:
 * "Vừa xong" / "5 phút trước" / "3 giờ trước" / "Hôm qua" / "15/06/2025"
 * Use for: notification timestamps, activity feeds
 */
export function formatRelativeTime(iso: string): string {
	const diff = Date.now() - new Date(iso).getTime();
	const mins = Math.floor(diff / 60_000);
	if (mins < 1) return "Vừa xong";
	if (mins < 60) return `${mins} phút trước`;
	const hours = Math.floor(mins / 60);
	if (hours < 24) return `${hours} giờ trước`;
	if (hours < 48) return "Hôm qua";
	return formatShortDate(iso);
}

// ─── API / storage helpers ────────────────────────────────────────────────────

/**
 * Today's date as "YYYY-MM-DD" for API payloads and DB storage.
 * Replaces: new Date().toISOString().split("T")[0]
 */
export function todayDateString(): string {
	return new Date().toISOString().split("T")[0];
}

/**
 * Current timestamp as full ISO string for API payloads and DB storage.
 * Replaces: new Date().toISOString()
 */
export function nowISO(): string {
	return new Date().toISOString();
}

/**
 * YYYY-MM-DD for the Monday of the current calendar week.
 * Used by statistics weekly range selector.
 */
export function getCurrentMonday(): string {
	const d = new Date();
	const day = d.getDay(); // 0 = Sunday
	const diff = day === 0 ? -6 : 1 - day;
	d.setDate(d.getDate() + diff);
	return d.toISOString().split("T")[0] ?? "";
}

/**
 * Add or subtract days from a YYYY-MM-DD string.
 * Used by statistics weekly navigation.
 */
export function shiftDate(dateStr: string, days: number): string {
	const d = new Date(dateStr);
	d.setDate(d.getDate() + days);
	return d.toISOString().split("T")[0] ?? "";
}

/**
 * Vietnamese relative-period label for grouping date-sorted lists.
 * "Ngày hôm nay" / "Hôm qua" / "Trong tuần qua" / "Tháng trước" / "Trong năm qua" / year string.
 * Use for: section headers in any date-grouped list.
 */
export function getDateSectionLabel(iso: string): string {
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	const date = new Date(iso);
	date.setHours(0, 0, 0, 0);
	const diffDays = Math.round((today.getTime() - date.getTime()) / 86_400_000);
	if (diffDays === 0) return "Ngày hôm nay";
	if (diffDays === 1) return "Hôm qua";
	if (diffDays <= 7) return "Trong tuần qua";
	if (diffDays <= 30) return "Tháng trước";
	if (diffDays <= 365) return "Trong năm qua";
	return String(date.getFullYear());
}
