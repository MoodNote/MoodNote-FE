export interface MoodTag {
	id: string;
	name: string;
	color: string | null;
}

// For GET /api/mood-tags catalog response — includes type grouping
export interface CatalogMoodTag extends MoodTag {
	type: "MOOD" | "LIFE";
}
