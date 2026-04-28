import { z } from "zod";

// ─── Reusable field schemas ──────────────────────────────────────────────────

// FR-08: max 10 tag UUIDs per entry
const tagIdsSchema = z
	.array(z.string().uuid("ID tag không hợp lệ"))
	.max(10, "Tối đa 10 thẻ")
	.default([]);

const titleSchema = z.string().max(100, "Tiêu đề tối đa 100 ký tự").optional();

// ─── API-level create schema (includes content as string for reference) ──────

// FR-06: plain text content min 10, max 5000 chars (used for API-boundary reference only)
const contentSchema = z
	.string()
	.min(10, "Nhật ký phải có ít nhất 10 ký tự")
	.max(5000, "Nhật ký không được vượt quá 5000 ký tự");

export const createEntrySchema = z.object({
	title: titleSchema,
	content: contentSchema,
	tagIds: tagIdsSchema,
});

export type CreateEntryApiValues = z.infer<typeof createEntrySchema>;

// ─── Form schemas — content managed externally by RichTextEditor ─────────────

// FR-06, FR-08: form only tracks title + tagIds; content lives in deltaRef
export const createEntryFormSchema = z.object({
	title: titleSchema,
	tagIds: tagIdsSchema,
});

export type CreateEntryFormValues = z.infer<typeof createEntryFormSchema>;

// ─── Edit entry form (FR-09) ─────────────────────────────────────────────────

export const editEntryFormSchema = createEntryFormSchema;
export type EditEntryFormValues = CreateEntryFormValues;

export const editEntrySchema = createEntryFormSchema;
