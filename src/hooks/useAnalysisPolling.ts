// FR-10: Poll GET /entries/:id while analysisStatus is PENDING or PROCESSING.
// Stops when COMPLETED or FAILED (or on unmount). Updates local DB on status change.

import { useEffect } from "react";

import { updateAnalysisStatus } from "@/db";
import { entryService } from "@/services";
import type { AnalysisStatus, Entry } from "@/types/entry.types";

const POLL_INTERVAL_MS = 3000;
const POLLING_STATUSES: AnalysisStatus[] = ["PENDING", "PROCESSING"];

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
		if (!serverId || !isOnline || !POLLING_STATUSES.includes(currentStatus)) {
			return;
		}

		const intervalId = setInterval(() => {
			void (async () => {
				const result = await entryService.getById(serverId);
				if (!result.success) return;

				const serverEntry = result.data.entry;

				if (!POLLING_STATUSES.includes(serverEntry.analysisStatus)) {
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
		}, POLL_INTERVAL_MS);

		return () => clearInterval(intervalId);
	}, [serverId, localId, currentStatus, isOnline, onUpdate]);
}
