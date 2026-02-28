import { ScreenWrapper } from "@/components/layout";
import { ROUTES } from "@/constants";
import { useThemeColors } from "@/hooks";
import type { ThemeColors } from "@/theme";
import { FONT_SIZE, LINE_HEIGHT, RADIUS, SPACING } from "@/theme";
import { s, vs } from "@/utils";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Image, StyleSheet, Text, View, type DimensionValue } from "react-native";
import Animated, {
	Easing,
	FadeInDown,
	ZoomIn,
	useAnimatedStyle,
	useSharedValue,
	withDelay,
	withRepeat,
	withSequence,
	withTiming,
} from "react-native-reanimated";

// ─── Constants ────────────────────────────────────────────────────────────────

const NAVIGATE_DELAY = 6500;
const LOGO_SIZE = s(100);
const RIPPLE_BASE = s(100);
const SPARKLE_SIZE = s(9);
const SHIMMER_RANGE = s(150);
const SHIMMER_WIDTH = s(72);

const SUBTITLE = "Mọi thứ trở nên ổn áo, hãy ở đây một chút,\ncùng âm nhạc và sự lắng nghe.";
const TYPEWRITER_DELAY = 700; // start after title finishes fading in
const TYPEWRITER_SPEED = 55; // ms per character

/** Musical notes scattered around the screen */
const NOTE_CONFIG = [
	{ note: "♪", left: "8%", top: "22%", delay: 0, size: 32 },
	{ note: "♫", left: "78%", top: "18%", delay: 1600, size: 24 },
	{ note: "♩", left: "4%", top: "58%", delay: 900, size: 24 },
	{ note: "♬", left: "82%", top: "52%", delay: 2400, size: 32 },
	{ note: "♪", left: "16%", top: "72%", delay: 500, size: 24 },
	{ note: "♫", left: "74%", top: "70%", delay: 1200, size: 32 },
] as const;

/** 8 sparkle positions at varying angles and distances from logo center */
const SPARKLE_CONFIG = [
	{ angle: -75, distance: s(84), delay: 350 },
	{ angle: -15, distance: s(92), delay: 850 },
	{ angle: 45, distance: s(80), delay: 150 },
	{ angle: 105, distance: s(88), delay: 650 },
	{ angle: 165, distance: s(83), delay: 1100 },
	{ angle: 225, distance: s(91), delay: 500 },
	{ angle: 285, distance: s(86), delay: 1250 },
	{ angle: 330, distance: s(77), delay: 200 },
] as const;

// ─── Sub-components ───────────────────────────────────────────────────────────

function FloatingLogo({ children }: { children: ReactNode }) {
	const translateY = useSharedValue(0);

	useEffect(() => {
		translateY.value = withDelay(
			500,
			withRepeat(
				withSequence(
					withTiming(-10, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
					withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
				),
				-1,
				false,
			),
		);
	}, [translateY]);

	const animStyle = useAnimatedStyle(() => ({
		transform: [{ translateY: translateY.value }],
	}));

	return <Animated.View style={animStyle}>{children}</Animated.View>;
}

function RippleRing({ delay, styles }: { delay: number; styles: ReturnType<typeof createStyles> }) {
	const scale = useSharedValue(0.5);
	const opacity = useSharedValue(0);

	useEffect(() => {
		scale.value = withDelay(
			delay,
			withRepeat(withTiming(2.8, { duration: 2400, easing: Easing.out(Easing.quad) }), -1, false),
		);
		opacity.value = withDelay(
			delay,
			withRepeat(
				withSequence(
					withTiming(0.45, { duration: 150 }),
					withTiming(0, { duration: 2250, easing: Easing.out(Easing.quad) }),
				),
				-1,
				false,
			),
		);
	}, [scale, opacity, delay]);

	const animStyle = useAnimatedStyle(() => ({
		transform: [{ scale: scale.value }],
		opacity: opacity.value,
	}));

	return <Animated.View style={[styles.ripple, animStyle]} />;
}

function SparkleParticle({
	angle,
	distance,
	delay,
	styles,
}: {
	angle: number;
	distance: number;
	delay: number;
	styles: ReturnType<typeof createStyles>;
}) {
	const scale = useSharedValue(0);
	const opacity = useSharedValue(0);

	const rad = (angle * Math.PI) / 180;
	const x = Math.cos(rad) * distance;
	const y = Math.sin(rad) * distance;

	useEffect(() => {
		const cycleDuration = 320;
		const pause = 850 + (delay % 350);
		scale.value = withDelay(
			delay,
			withRepeat(
				withSequence(
					withTiming(1, { duration: cycleDuration, easing: Easing.out(Easing.back(1.5)) }),
					withTiming(0, { duration: cycleDuration }),
					withTiming(0, { duration: pause }),
				),
				-1,
				false,
			),
		);
		opacity.value = withDelay(
			delay,
			withRepeat(
				withSequence(
					withTiming(1, { duration: cycleDuration }),
					withTiming(0, { duration: cycleDuration }),
					withTiming(0, { duration: pause }),
				),
				-1,
				false,
			),
		);
	}, [scale, opacity, delay]);

	const animStyle = useAnimatedStyle(() => ({
		transform: [{ translateX: x }, { translateY: y }, { scale: scale.value }],
		opacity: opacity.value,
	}));

	return <Animated.View style={[styles.sparkle, animStyle]} />;
}

function MusicalNote({
	note,
	left,
	top,
	delay,
	size,
	styles,
}: {
	note: string;
	left: DimensionValue;
	top: DimensionValue;
	delay: number;
	size: number;
	styles: ReturnType<typeof createStyles>;
}) {
	const translateY = useSharedValue(0);
	const opacity = useSharedValue(0);

	useEffect(() => {
		const floatDuration = 2800;
		const pause = 1400;
		translateY.value = withDelay(
			delay,
			withRepeat(
				withSequence(
					withTiming(-vs(55), { duration: floatDuration, easing: Easing.out(Easing.sin) }),
					withTiming(0, { duration: 0 }),
					withTiming(0, { duration: pause }),
				),
				-1,
				false,
			),
		);
		opacity.value = withDelay(
			delay,
			withRepeat(
				withSequence(
					withTiming(0.65, { duration: 350 }),
					withTiming(0.65, { duration: floatDuration - 950 }),
					withTiming(0, { duration: 600 }),
					withTiming(0, { duration: pause }),
				),
				-1,
				false,
			),
		);
	}, [translateY, opacity, delay]);

	const animStyle = useAnimatedStyle(() => ({
		transform: [{ translateY: translateY.value }],
		opacity: opacity.value,
	}));

	// View handles percentage positioning; Animated.Text handles animation
	return (
		<View style={{ position: "absolute", left, top }}>
			<Animated.Text style={[styles.musicalNote, { fontSize: size }, animStyle]}>
				{note}
			</Animated.Text>
		</View>
	);
}

function TitleShimmer({ styles }: { styles: ReturnType<typeof createStyles> }) {
	const translateX = useSharedValue(-SHIMMER_RANGE);

	useEffect(() => {
		translateX.value = withDelay(
			800,
			withRepeat(
				withSequence(
					withTiming(SHIMMER_RANGE, { duration: 950, easing: Easing.inOut(Easing.sin) }),
					withTiming(-SHIMMER_RANGE, { duration: 0 }),
					withTiming(-SHIMMER_RANGE, { duration: 2600 }),
				),
				-1,
				false,
			),
		);
	}, [translateX]);

	const shimmerStyle = useAnimatedStyle(() => ({
		transform: [{ translateX: translateX.value }],
	}));

	return (
		<Animated.View style={[styles.shimmerWrapper, shimmerStyle]} pointerEvents="none">
			<LinearGradient
				colors={["transparent", "rgba(255,255,255,0.42)", "transparent"]}
				start={{ x: 0, y: 0.5 }}
				end={{ x: 1, y: 0.5 }}
				style={styles.shimmerGradient}
			/>
		</Animated.View>
	);
}

function TypewriterText({ styles }: { styles: ReturnType<typeof createStyles> }) {
	const [visibleCount, setVisibleCount] = useState(0);

	useEffect(() => {
		let intervalId: ReturnType<typeof setInterval> | null = null;

		const startTimerId = setTimeout(() => {
			intervalId = setInterval(() => {
				setVisibleCount((prev) => {
					if (prev >= SUBTITLE.length) {
						clearInterval(intervalId!);
						return prev;
					}
					return prev + 1;
				});
			}, TYPEWRITER_SPEED);
		}, TYPEWRITER_DELAY);

		return () => {
			clearTimeout(startTimerId);
			if (intervalId !== null) clearInterval(intervalId);
		};
	}, []);

	return (
		<Text style={styles.subtitle}>
			{SUBTITLE.slice(0, visibleCount)}
			<Text style={styles.subtitle}>{"|"}</Text>
		</Text>
	);
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function SplashScreen() {
	const colors = useThemeColors();
	const styles = useMemo(() => createStyles(colors), [colors]);

	useEffect(() => {
		const timer = setTimeout(() => {
			router.replace(ROUTES.ONBOARDING);
		}, NAVIGATE_DELAY);
		return () => clearTimeout(timer);
	}, []);

	return (
		<ScreenWrapper padded={false}>
			{/* Musical notes layer — floats over the full screen */}
			<View style={StyleSheet.absoluteFill} pointerEvents="none">
				{NOTE_CONFIG.map((cfg, i) => (
					<MusicalNote key={i} {...cfg} styles={styles} />
				))}
			</View>

			<View style={styles.content}>
				{/* Logo area: ripple rings + sparkles + floating logo */}
				<View style={styles.logoArea}>
					<RippleRing delay={0} styles={styles} />
					<RippleRing delay={800} styles={styles} />
					<RippleRing delay={1600} styles={styles} />

					{SPARKLE_CONFIG.map((cfg, i) => (
						<SparkleParticle key={i} {...cfg} styles={styles} />
					))}

					<Animated.View entering={ZoomIn.duration(500)}>
						<FloatingLogo>
							<Image
								source={require("../../../assets/images/splash-icon.png")}
								style={styles.logo}
								resizeMode="contain"
							/>
						</FloatingLogo>
					</Animated.View>
				</View>

				{/* Title with shimmer sweep */}
				<Animated.View entering={FadeInDown.duration(400).delay(300)} style={styles.titleWrapper}>
					<Text style={styles.title}>{"MoodNote"}</Text>
					<TitleShimmer styles={styles} />
				</Animated.View>

				{/* Subtitle — typewriter effect */}
				<TypewriterText styles={styles} />
			</View>
		</ScreenWrapper>
	);
}

// ─── Styles ───────────────────────────────────────────────────────────────────

function createStyles(colors: ThemeColors) {
	return StyleSheet.create({
		content: {
			flex: 1,
			alignItems: "center",
			justifyContent: "center",
			gap: SPACING[16],
		},

		// Logo area — fixed size container; absolute children are centered via top/left 50%
		logoArea: {
			width: s(260),
			height: s(260),
			alignItems: "center",
			justifyContent: "center",
		},
		ripple: {
			position: "absolute",
			width: RIPPLE_BASE,
			height: RIPPLE_BASE,
			borderRadius: RADIUS.full,
			top: "50%",
			left: "50%",
			marginTop: -RIPPLE_BASE / 2,
			marginLeft: -RIPPLE_BASE / 2,
			backgroundColor: colors.brand.primary,
		},
		sparkle: {
			position: "absolute",
			width: SPARKLE_SIZE,
			height: SPARKLE_SIZE,
			borderRadius: RADIUS.full,
			top: "50%",
			left: "50%",
			marginTop: -SPARKLE_SIZE / 2,
			marginLeft: -SPARKLE_SIZE / 2,
			backgroundColor: colors.brand.highlight,
		},
		logo: {
			width: LOGO_SIZE,
			height: LOGO_SIZE,
		},

		// Title with overflow clip for shimmer
		titleWrapper: {
			overflow: "hidden",
			alignItems: "center",
		},
		title: {
			color: colors.text.primary,
			fontSize: 36,
			fontWeight: "700",
			letterSpacing: 1,
		},
		shimmerWrapper: {
			position: "absolute",
			top: 0,
			bottom: 0,
			width: SHIMMER_WIDTH,
		},
		shimmerGradient: {
			flex: 1,
		},

		subtitle: {
			color: colors.text.secondary,
			fontSize: FONT_SIZE[14],
			textAlign: "center",
			lineHeight: LINE_HEIGHT.relaxed,
			paddingHorizontal: SPACING[32],
		},
		musicalNote: {
			color: colors.brand.primary,
		},
	});
}
