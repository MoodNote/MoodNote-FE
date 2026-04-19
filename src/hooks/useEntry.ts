// FR-06, FR-09: Single entry state, update, and delete

import { entryService } from "@/services";
import type { Entry, UpdateEntryPayload, UseEntryResult } from "@/types/entry.types";
import { useCallback, useEffect, useState } from "react";

export function useEntry(id: string): UseEntryResult {
	const [entry, setEntry] = useState<Entry | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let cancelled = false;

		const load = async () => {
			setIsLoading(true);
			setError(null);
			try {
				const result = await entryService.getById(id);
				if (!cancelled) {
					if (!result.success) setError(result.error ?? "Failed to load entry");
					else setEntry(result.data.entry);
				}
			} catch (err) {
				if (!cancelled) {
					setError(err instanceof Error ? err.message : "An unexpected error occurred.");
				}
			} finally {
				if (!cancelled) setIsLoading(false);
			}
		};

		void load();
		return () => { cancelled = true; };
	}, [id]);

	const updateEntry = useCallback(
		async (payload: UpdateEntryPayload): Promise<Entry> => {
			const result = await entryService.update(id, payload);
			if (!result.success) throw new Error(result.error ?? "Failed to update entry");
			setEntry(result.data.entry);
			return result.data.entry;
		},
		[id],
	);

	const deleteEntry = useCallback(async () => {
		const result = await entryService.delete(id);
		if (!result.success) throw new Error(result.error ?? "Failed to delete entry");
	}, [id]);

	return { entry, isLoading, error, updateEntry, deleteEntry };
}
