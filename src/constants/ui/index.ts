import { FONT_SIZE, SIZE } from "@/theme";
import { s } from "@/utils/responsive";

// ── Ambient glow blobs ────────────────────────────────────────────────────────
// Simulate Gaussian blur via layered concentric circles with low opacity.
// Each layer is a sibling View — opacities add up at the center, creating a
// smooth radial falloff that approximates a soft glow.
export const BLOB_LAYERS = Array.from({ length: 24 }, (_, i) => {
	const t = i / 23; // 0 → 1
	const factor = 1 - t * 0.92; // từ 1 → ~0.08

	// opacity tăng rồi giảm (parabolic)
	const opacity = (0.03 + Math.sin(t * Math.PI) * 0.04) * 0.3;

	return {
		factor: Number(factor.toFixed(2)),
		opacity: Number(opacity.toFixed(3)),
	};
});
// Cumulative at center ≈ 0.60; at outer edge ≈ 0.03

export const AVATAR_SIZE_MAP = { sm: SIZE.xs, md: SIZE.md, lg: SIZE["2xl"] } as const;
export const AVATAR_FONT_MAP = { sm: FONT_SIZE[12], md: s(16), lg: FONT_SIZE[22] } as const;

export const SWIPE_DELETE_ACTION_WIDTH = s(72);
export const SWIPE_DELETE_AUTO_DRAG_THRESHOLD = -s(150);
