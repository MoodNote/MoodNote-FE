import { create } from "zustand";

import { moodTagService } from "@/services/mood-tag.service";
import type { CatalogMoodTag } from "@/types/mood-tag.types";

interface MoodTagsStore {
	moodTags: CatalogMoodTag[];
	lifeTags: CatalogMoodTag[];
	isLoaded: boolean;
	fetchTags: () => Promise<void>;
}

export const useMoodTagsStore = create<MoodTagsStore>((set) => ({
	moodTags: [],
	lifeTags: [],
	isLoaded: false,
	fetchTags: async () => {
		const result = await moodTagService.getAll();
		if (result.success) {
			set({ moodTags: result.data.moodTags, lifeTags: result.data.lifeTags, isLoaded: true });
		}
	},
}));
