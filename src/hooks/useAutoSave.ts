// FR-06: Generic auto-save hook with debounce

import { useCallback, useEffect, useRef, useState } from "react";

import type { SaveStatus, UseAutoSaveOptions, UseAutoSaveResult } from "@/types/form.types";

export function useAutoSave({ saveFn, delay = 7000 }: UseAutoSaveOptions): UseAutoSaveResult {
	const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
	// useRef — not useState — so resetting the timer doesn't cause re-renders
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const saveFnRef = useRef(saveFn);

	// Keep saveFnRef current without adding it to triggerSave's deps
	useEffect(() => {
		saveFnRef.current = saveFn;
	}, [saveFn]);

	const runSave = useCallback(async () => {
		setSaveStatus("saving");
		try {
			await saveFnRef.current();
			setSaveStatus("saved");
		} catch {
			setSaveStatus("error");
		}
	}, []);

	const triggerSave = useCallback(() => {
		if (timerRef.current !== null) {
			clearTimeout(timerRef.current);
		}
		timerRef.current = setTimeout(() => {
			timerRef.current = null;
			void runSave();
		}, delay);
	}, [delay, runSave]);

	const triggerImmediately = useCallback(async () => {
		if (timerRef.current !== null) {
			clearTimeout(timerRef.current);
			timerRef.current = null;
		}
		await runSave();
	}, [runSave]);

	// Cancel pending timer on unmount
	useEffect(() => {
		return () => {
			if (timerRef.current !== null) {
				clearTimeout(timerRef.current);
			}
		};
	}, []);

	return { saveStatus, triggerSave, triggerImmediately };
}
