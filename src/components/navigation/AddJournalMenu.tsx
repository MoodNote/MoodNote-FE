import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
	Easing,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";

import { useThemeColors } from "@/hooks";
import { FONT_SIZE, LINE_HEIGHT, RADIUS, SPACING } from "@/theme";
import type { ThemeColors } from "@/theme";
import { s, vs } from "@/utils";

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

// Must match TabBar constants so the popup sits just above the FAB
const FAB_SIZE = s(58);
const BAR_HEIGHT = vs(64);
const NOTCH_W = FAB_SIZE;          // same width as FAB for organic connection
const NOTCH_H = vs(18);            // taller for a more visible stem
// Bottom edge of the popup (notch tip) aligns with the FAB top edge
const POPUP_BOTTOM = BAR_HEIGHT + FAB_SIZE / 2 + vs(8);

interface AddJournalMenuProps {
	visible: boolean;
	onDismiss: () => void;
}

interface MenuOptionProps {
	iconName: IoniconName;
	label: string;
	onPress: () => void;
	colors: ThemeColors;
}

function MenuOption({ iconName, label, onPress, colors }: MenuOptionProps) {
	const styles = useMemo(() => createOptionStyles(colors), [colors]);
	return (
		<Pressable
			style={({ pressed }) => [styles.option, pressed && styles.optionPressed]}
			onPress={onPress}
			accessibilityRole="button"
			accessibilityLabel={label}>
			<Text style={styles.label}>{label}</Text>
			<View style={styles.iconWrap}>
				<Ionicons name={iconName} size={s(20)} color={colors.brand.onPrimary} />
			</View>
		</Pressable>
	);
}

function createOptionStyles(colors: ThemeColors) {
	return StyleSheet.create({
		option: {
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-between",
			paddingVertical: SPACING[14],
			paddingHorizontal: SPACING[20],
		},
		optionPressed: {
			backgroundColor: colors.brand.primaryPressed,
		},
		iconWrap: {
			width: s(40),
			height: s(40),
			borderRadius: RADIUS.md,
			backgroundColor: colors.brand.primaryPressed,
			alignItems: "center",
			justifyContent: "center",
		},
		label: {
			fontSize: FONT_SIZE[15],
			lineHeight: LINE_HEIGHT.normal,
			color: colors.brand.onPrimary,
			fontWeight: "500",
		},
	});
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
					colors={colors}
				/>
				<View style={styles.divider} />
				<MenuOption
					iconName="mic-outline"
					label="Nhật ký bằng giọng nói"
					onPress={onDismiss}
					colors={colors}
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
