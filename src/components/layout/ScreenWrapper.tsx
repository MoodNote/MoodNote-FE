import { useThemeColors } from "@/hooks";
import { SPACING } from "@/theme";
import { LinearGradient } from "expo-linear-gradient";
import { type ReactNode } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View, type ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Blob } from "./Blob";

// ── ScreenWrapper ─────────────────────────────────────────────────────────────

interface ScreenWrapperProps {
	children: ReactNode;
	keyboard?: boolean;
	style?: ViewStyle;
	padded?: boolean;
}

export function ScreenWrapper({
	children,
	keyboard = false,
	style,
	padded = true,
}: ScreenWrapperProps) {
	const colors = useThemeColors();

	const inner = <View style={[styles.inner, padded && styles.padded, style]}>{children}</View>;

	return (
		<LinearGradient
			colors={[colors.background.secondary, colors.background.primary]}
			style={styles.gradient}>
			{/* Ambient glow blobs — positioned absolutely behind all content */}
			<View style={StyleSheet.absoluteFillObject} pointerEvents="none">
				<Blob color={colors.brand.secondary} radius={180} top={-80} right={-160} />
				<Blob color={colors.brand.secondary} radius={140} top={280} left={-150} />
				<Blob color={colors.brand.secondary} radius={130} bottom={-60} right={-50} />
			</View>

			<SafeAreaView style={styles.safeArea}>
				{keyboard ? (
					<KeyboardAvoidingView
						behavior={Platform.OS === "ios" ? "padding" : "height"}
						style={styles.keyboard}>
						{inner}
					</KeyboardAvoidingView>
				) : (
					inner
				)}
			</SafeAreaView>
		</LinearGradient>
	);
}

const styles = StyleSheet.create({
	gradient: {
		flex: 1,
	},
	safeArea: {
		flex: 1,
		backgroundColor: "transparent",
	},
	keyboard: {
		flex: 1,
	},
	inner: {
		flex: 1,
	},
	padded: {
		paddingHorizontal: SPACING[24],
	},
});
