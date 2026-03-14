// FR-06, FR-09, NFR-04: Local-first journal list with server sync

import {
	getAllEntries,
	markEntryDeleted,
	hardDeleteEntry,
	upsertListFromServer,
	getEntryServerId,
} from "@/db";
import { entryService } from "@/services";
import type { EntryListItem, EntryPagination, UseEntriesResult } from "@/types/entry.types";
import { logError, parseError } from "@/utils";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSync } from "./useSync";

const PAGE_LIMIT = 20;

export function useEntries(): UseEntriesResult {
	const { isOnline, isSyncing } = useSync();

	// Full sorted list from local DB
	const [allEntries, setAllEntries] = useState<EntryListItem[]>([]);
	const [displayCount, setDisplayCount] = useState(PAGE_LIMIT);
	const [isLoading, setIsLoading] = useState(true);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [isLoadingMore, setIsLoadingMore] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const isOnlineRef = useRef(isOnline);
	useEffect(() => {
		isOnlineRef.current = isOnline;
	}, [isOnline]);

	const isSyncingRef = useRef(isSyncing);
	useEffect(() => {
		isSyncingRef.current = isSyncing;
	}, [isSyncing]);

	/** Reload allEntries from local DB */
	const loadFromDb = useCallback(async () => {
		const rows = await getAllEntries();
		setAllEntries(rows);
	}, []);

	/** Fetch all pages from server and upsert into local DB */
	const syncFromServer = useCallback(async () => {
		try {
			let page = 1;
			let hasMore = true;
			while (hasMore) {
				const res = await entryService.getList({ page, limit: PAGE_LIMIT });
				const { entries: fetched, pagination } = res.data.data;
				await upsertListFromServer(fetched);
				hasMore = page < pagination.totalPages;
				page++;
				if (page > 20) break; // safety cap
			}
		} catch (err) {
			logError(err, { context: "useEntries.syncFromServer" });
		}
	}, []);

	// Initial load
	useEffect(() => {
		const load = async () => {
			setIsLoading(true);
			setError(null);
			try {
				await loadFromDb();
				// Skip syncFromServer if SyncContext is already writing to DB — avoids concurrent SQLite writes
				if (isOnlineRef.current && !isSyncingRef.current) {
					await syncFromServer();
					await loadFromDb();
				}
			} catch (err) {
				const { message } = parseError(err);
				setError(message);
			} finally {
				setIsLoading(false);
			}
		};
		void load();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Reload from DB when SyncContext finishes a sync cycle
	const prevIsSyncingRef = useRef(false);
	useEffect(() => {
		if (prevIsSyncingRef.current && !isSyncing) {
			void loadFromDb();
		}
		prevIsSyncingRef.current = isSyncing;
	}, [isSyncing, loadFromDb]);

	const refresh = useCallback(async () => {
		setIsRefreshing(true);
		setError(null);
		try {
			if (isOnlineRef.current) {
				await syncFromServer();
			}
			await loadFromDb();
			setDisplayCount(PAGE_LIMIT);
		} catch (err) {
			const { message } = parseError(err);
			setError(message);
		} finally {
			setIsRefreshing(false);
		}
	}, [loadFromDb, syncFromServer]);

	const loadMore = useCallback(async () => {
		if (isLoadingMore || displayCount >= allEntries.length) return;
		setIsLoadingMore(true);
		setDisplayCount((prev) => prev + PAGE_LIMIT);
		setIsLoadingMore(false);
	}, [isLoadingMore, displayCount, allEntries.length]);

	const removeEntry = useCallback(async (id: string) => {
		// 1. Write to local DB (optimistic)
		await markEntryDeleted(id);
		setAllEntries((prev) => prev.filter((e) => e.id !== id));

		// 2. If online, attempt server delete in background
		if (isOnlineRef.current) {
			try {
				const serverId = await getEntryServerId(id);
				if (serverId) {
					await entryService.delete(serverId);
					await hardDeleteEntry(id);
				}
			} catch (err) {
				logError(err, { context: "useEntries.removeEntry server delete" });
				// Leave as pending_delete — sync engine will retry
			}
		}
	}, []);

	// Derived paginated slice
	const entries = allEntries.slice(0, displayCount);
	const pagination: EntryPagination | null =
		allEntries.length > 0
			? {
					total: allEntries.length,
					page: Math.ceil(displayCount / PAGE_LIMIT),
					limit: PAGE_LIMIT,
					totalPages: Math.ceil(allEntries.length / PAGE_LIMIT),
				}
			: null;

	return {
		entries,
		pagination,
		isLoading,
		isRefreshing,
		isLoadingMore,
		error,
		refresh,
		loadMore,
		removeEntry,
	};
}
