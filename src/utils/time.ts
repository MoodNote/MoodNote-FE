export function stepHour(current: string, direction: 1 | -1): string {
	const parsed = Number.parseInt(current, 10);
	const safeHour = Number.isNaN(parsed) ? 0 : parsed;
	const nextHour = (safeHour + direction + 24) % 24;
	return String(nextHour).padStart(2, "0");
}

export function stepMinute(current: string, minuteStep: number, direction: 1 | -1): string {
	const parsed = Number.parseInt(current, 10);
	const safeMinute = Number.isNaN(parsed) ? 0 : parsed;
	const steps = 60 / minuteStep;
	const stepIndex = Math.floor(safeMinute / minuteStep);
	const nextIndex = (stepIndex + direction + steps) % steps;
	return String(nextIndex * minuteStep).padStart(2, "0");
}
