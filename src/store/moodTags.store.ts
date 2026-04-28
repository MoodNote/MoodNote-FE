import { create } from "zustand";

import { moodTagService } from "@/services/mood-tag.service";
import type { MoodTag } from "@/types/mood-tag.types";

interface MoodTagsStore {
	tags: MoodTag[];
	isLoaded: boolean;
	fetchTags: () => Promise<void>;
}

export const useMoodTagsStore = create<MoodTagsStore>((set) => ({
	tags: [],
	isLoaded: false,
	fetchTags: async () => {
		const result = await moodTagService.getAll();
		if (result.success) {
			set({ tags: result.data.tags, isLoaded: true });
		}
	},
}));
