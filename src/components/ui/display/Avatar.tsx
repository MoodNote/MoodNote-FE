import { useCallback, useMemo, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { useThemeColors } from "@/hooks";
import type { ThemeColors } from "@/theme";
import { FONT_SIZE, SIZE } from "@/theme";
import type { AvatarProps } from "@/types";
import { s } from "@/utils";

const SIZE_MAP = { sm: SIZE.xs, md: SIZE.md, lg: SIZE["2xl"] } as const;
const FONT_MAP = { sm: FONT_SIZE[12], md: s(16), lg: FONT_SIZE[22] } as const;

export function Avatar({ uri, name, size = "md", onPress }: AvatarProps) {
	const colors = useThemeColors();
	const [imageError, setImageError] = useState(false);
	const dimension = SIZE_MAP[size];
	const fontSize = FONT_MAP[size];
	const styles = useMemo(
		() => createStyles(colors, dimension, fontSize),
		[colors, dimension, fontSize],
	);

	const initials = useMemo(() => {
		if (name == null || name.trim() === "") return "?";
		const parts = name.trim().split(/\s+/);
		if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
		return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
	}, [name]);

	const handleError = useCallback(() => setImageError(true), []);

	const showImage = uri != null && !imageError;

	const inner = showImage ? (
		<Image
			source={{ uri }}
			style={styles.image}
			onError={handleError}
			accessibilityLabel={name ?? "Avatar"}
		/>
	) : (
		<View style={styles.fallback}>
			<Text style={styles.initials}>{initials}</Text>
		</View>
	);

	if (onPress != null) {
		return (
			<Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={name ?? "Avatar"}>
				{inner}
			</Pressable>
		);
	}

	return inner;
}

function createStyles(colors: ThemeColors, dimension: number, fontSize: number) {
	return StyleSheet.create({
		image: {
			width: dimension,
			height: dimension,
			borderRadius: dimension / 2,
		},
		fallback: {
			width: dimension,
			height: dimension,
			borderRadius: dimension / 2,
			backgroundColor: colors.brand.surface,
			alignItems: "center",
			justifyContent: "center",
		},
		initials: {
			fontSize,
			fontWeight: "600",
			color: colors.brand.primary,
		},
	});
}
