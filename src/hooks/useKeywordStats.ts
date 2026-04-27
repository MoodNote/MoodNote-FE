// FR-18: Top keywords from analyzed entries

import { useCallback, useEffect, useState } from "react";

import { STATS_ERROR_MESSAGES } from "@/constants";
import { statsService } from "@/services";
import type { GetKeywordsParams, KeywordsData } from "@/types/stats.types";
import { logError } from "@/utils";

interface UseKeywordStatsResult {
	data: KeywordsData | null;
	isLoading: boolean;
	error: string | null;
	refresh: () => Promise<void>;
}

export function useKeywordStats(params?: GetKeywordsParams): UseKeywordStatsResult {
	const [data, setData] = useState<KeywordsData | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const paramsKey = JSON.stringify(params);

	const fetchData = useCallback(async () => {
		setIsLoading(true);
		setError(null);
		const res = await statsService.getKeywordStats(params);
		if (res.success) {
			setData(res.data);
		} else {
			setError(STATS_ERROR_MESSAGES.KEYWORDS);
			logError(res.error, { context: "useKeywordStats" });
		}
		setIsLoading(false);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [paramsKey]);

	useEffect(() => {
		let cancelled = false;
		void (async () => {
			setIsLoading(true);
			setError(null);
			const res = await statsService.getKeywordStats(params);
			if (cancelled) return;
			if (res.success) {
				setData(res.data);
			} else {
				setError(STATS_ERROR_MESSAGES.KEYWORDS);
				logError(res.error, { context: "useKeywordStats" });
			}
			setIsLoading(false);
		})();
		return () => {
			cancelled = true;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [paramsKey]);

	return { data, isLoading, error, refresh: fetchData };
}
