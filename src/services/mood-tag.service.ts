import { apiService as api } from "@/lib/api";
import type { ApiResponse } from "@/types";
import type { CatalogMoodTag } from "@/types/mood-tag.types";
import { withErrorHandling } from "@/utils/error";

export const moodTagService = {
	getAll: withErrorHandling(() =>
		api.get<ApiResponse<{ moodTags: CatalogMoodTag[]; lifeTags: CatalogMoodTag[] }>>("/mood-tags"),
	),
};
