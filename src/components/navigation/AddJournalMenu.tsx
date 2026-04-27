import { useEffect, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
	Easing,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";

import { useThemeColors } from "@/hooks";
import { RADIUS, SPACING } from "@/theme";
import type { ThemeColors } from "@/theme";
import { s, vs } from "@/utils";
import { NOTCH_H, NOTCH_W, POPUP_BOTTOM } from "@/constants";
import { MenuOption } from "./MenuOption";

interface AddJournalMenuProps {
	visible: boolean;
	onDismiss: () => void;
}

export function AddJournalMenu({ visible, onDismiss }: AddJournalMenuProps) {
	const colors = useThemeColors();
	const styles = useMemo(() => createStyles(colors), [colors]);

	const opacity = useSharedValue(0);
	const translateY = useSharedValue(vs(8));

	useEffect(() => {
		if (visible) {
			opacity.value = withTiming(1, { duration: 180 });
			translateY.value = withTiming(0, { duration: 220, easing: Easing.out(Easing.cubic) });
		} else {
			opacity.value = withTiming(0, { duration: 160 });
			translateY.value = withTiming(vs(8), {
				duration: 180,
				easing: Easing.in(Easing.cubic),
			});
		}
	}, [visible, opacity, translateY]);

	const animStyle = useAnimatedStyle(() => ({
		opacity: opacity.value,
		transform: [{ translateY: translateY.value }],
	}));

	return (
		<Animated.View
			style={[styles.container, animStyle]}
			pointerEvents={visible ? "box-none" : "none"}>
			<View style={styles.card}>
				<MenuOption
					iconName="create-outline"
					label="Viết nhật ký"
					onPress={onDismiss}
				/>
				<View style={styles.divider} />
				<MenuOption
					iconName="mic-outline"
					label="Nhật ký bằng giọng nói"
					onPress={onDismiss}
				/>
			</View>
			{/* Notch/stem — flat top flushes with card bottom, pill bottom points toward FAB.
			    Card's rounded bottom-left/right corners form natural concave "ear" curves
			    on either side of the notch junction. */}
			<View style={styles.notch} />
		</Animated.View>
	);
}

function createStyles(colors: ThemeColors) {
	return StyleSheet.create({
		container: {
			position: "absolute",
			bottom: POPUP_BOTTOM,
			left: 0,
			right: 0,
			alignItems: "center",
		},
		card: {
			backgroundColor: colors.brand.primary,
			borderRadius: RADIUS.xl,
			minWidth: s(240),
			overflow: "hidden",
			shadowColor: colors.shadow,
			shadowOffset: { width: 0, height: vs(4) },
			shadowOpacity: 0.25,
			shadowRadius: s(12),
			elevation: 16,
		},
		notch: {
			width: NOTCH_W,
			height: NOTCH_H,
			backgroundColor: colors.brand.primary,
			// Flat top — connects flush with card bottom so card's rounded corners
			// form natural concave "ear" curves on either side
			borderTopLeftRadius: 0,
			borderTopRightRadius: 0,
			// Pill bottom — smooth rounded tip pointing toward FAB
			borderBottomLeftRadius: NOTCH_H / 2,
			borderBottomRightRadius: NOTCH_H / 2,
		},
		divider: {
			height: 1,
			backgroundColor: colors.brand.primaryPressed,
			marginHorizontal: SPACING[20],
		},
	});
}
