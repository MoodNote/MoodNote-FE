// NFR-04: Thin consumer hook for SyncContext

import { SyncContext } from "@/contexts/SyncContext";
import type { SyncContextValue } from "@/types/contexts.types";
import { useContext } from "react";

export type UseSyncResult = SyncContextValue;

export function useSync(): UseSyncResult {
	const ctx = useContext(SyncContext);
	if (!ctx) {
		throw new Error("useSyncContext must be used inside SyncProvider");
	}
	return ctx;
}
