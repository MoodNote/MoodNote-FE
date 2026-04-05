// FR-10: Poll GET /entries/:id while analysisStatus is PENDING or PROCESSING.
// Stops when COMPLETED or FAILED (or on unmount). Updates local DB on status change.

import { useEffect } from "react";

import { ANALYSIS_POLLING_STATUSES, ANALYSIS_POLL_INTERVAL_MS } from "@/constants";
import { updateAnalysisStatus } from "@/db";
import { entryService } from "@/services";
import type { AnalysisStatus, Entry } from "@/types/entry.types";

interface UseAnalysisPollingOptions {
	serverId: string | null;
	localId: string;
	currentStatus: AnalysisStatus;
	isOnline: boolean;
	onUpdate: (entry: Entry) => void;
}

export function useAnalysisPolling({
	serverId,
	localId,
	currentStatus,
	isOnline,
	onUpdate,
}: UseAnalysisPollingOptions): void {
	useEffect(() => {
		if (!serverId || !isOnline || !ANALYSIS_POLLING_STATUSES.includes(currentStatus)) {
			return;
		}

		const intervalId = setInterval(() => {
			void (async () => {
				const result = await entryService.getById(serverId);
				if (!result.success) return;

				const serverEntry = result.data.entry;

				if (!ANALYSIS_POLLING_STATUSES.includes(serverEntry.analysisStatus)) {
					// Status resolved — persist to local DB and notify caller
					await updateAnalysisStatus(
						localId,
						serverEntry.analysisStatus,
						serverEntry.emotionAnalysis,
					);
					onUpdate({
						...serverEntry,
						id: localId,
					});
					clearInterval(intervalId);
				}
			})();
		}, ANALYSIS_POLL_INTERVAL_MS);

		return () => clearInterval(intervalId);
	}, [serverId, localId, currentStatus, isOnline, onUpdate]);
}
