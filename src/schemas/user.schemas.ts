import { z } from "zod";

// FR-05: Profile update
export const updateProfileSchema = z
	.object({
		name: z
			.string()
			.min(2, "Name must be at least 2 characters")
			.max(50, "Name must not exceed 50 characters")
			.optional(),
		username: z
			.string()
			.min(3, "Username must be at least 3 characters")
			.max(30, "Username must not exceed 30 characters")
			.regex(/^[a-z0-9_]+$/, "Only lowercase letters, numbers and underscores allowed")
			.optional(),
	})
	.refine((d) => d.name !== undefined || d.username !== undefined, {
		message: "At least one field is required",
	});

export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;
