import { ScreenWrapper } from "@/components/layout";
import { Button } from "@/components/ui";
import {
	EmotionIllustration,
	JournalIllustration,
	MusicIllustration,
} from "@/components/ui/illustrations";
import { ONBOARDING_COMPLETED_KEY, ROUTES } from "@/constants";
import { useThemeColors } from "@/hooks";
import type { ThemeColors } from "@/theme";
import { setStorageItem } from "@/utils/storage";
import { router } from "expo-router";
import {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
	type ComponentType,
	type ReactNode,
} from "react";
import { StyleSheet, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
	Easing,
	SlideInLeft,
	SlideInRight,
	interpolate,
	interpolateColor,
	useAnimatedStyle,
	useSharedValue,
	withRepeat,
	withSequence,
	withTiming,
} from "react-native-reanimated";

// ─── Constants ────────────────────────────────────────────────────────────────

const SWIPE_THRESHOLD = 50;

// ─── Slide Data ───────────────────────────────────────────────────────────────

interface Slide {
	title: string;
	Illustration: ComponentType;
}

const SLIDES: Slide[] = [
	{
		title: "Viết lại cảm xúc\nngày hôm nay",
		Illustration: JournalIllustration,
	},
	{
		title: "Thấu hiểu cảm xúc\ncủa bạn",
		Illustration: EmotionIllustration,
	},
	{
		title: "Nghe và chill\ntheo cảm xúc thật",
		Illustration: MusicIllustration,
	},
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function FloatingContainer({ children }: { children: ReactNode }) {
	const translateY = useSharedValue(0);

	useEffect(() => {
		translateY.value = withRepeat(
			withSequence(
				withTiming(-12, { duration: 2200, easing: Easing.inOut(Easing.sin) }),
				withTiming(0, { duration: 2200, easing: Easing.inOut(Easing.sin) }),
			),
			-1,
			false,
		);
	}, [translateY]);

	const animStyle = useAnimatedStyle(() => ({
		transform: [{ translateY: translateY.value }],
	}));

	return <Animated.View style={animStyle}>{children}</Animated.View>;
}

interface AnimatedDotProps {
	isActive: boolean;
	styles: ReturnType<typeof createStyles>;
	colors: ThemeColors;
}

function AnimatedDot({ isActive, styles, colors }: AnimatedDotProps) {
	const progress = useSharedValue(isActive ? 1 : 0);

	useEffect(() => {
		progress.value = withTiming(isActive ? 1 : 0, { duration: 250 });
	}, [isActive, progress]);

	const animStyle = useAnimatedStyle(() => ({
		width: interpolate(progress.value, [0, 1], [8, 20]),
		backgroundColor: interpolateColor(progress.value, [0, 1], [
			colors.border.default,
			colors.brand.primary,
		]),
	}));

	return <Animated.View style={[styles.dot, animStyle]} />;
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function OnboardingScreen() {
	const colors = useThemeColors();
	const styles = useMemo(() => createStyles(colors), [colors]);
	const [step, setStep] = useState(0);
	const slideDir = useRef<"forward" | "backward">("forward");

	const markDoneAndNavigate = useCallback(async () => {
		await setStorageItem(ONBOARDING_COMPLETED_KEY, "true");
		router.replace(ROUTES.WELCOME);
	}, []);

	const handleNext = useCallback(async () => {
		if (step < SLIDES.length - 1) {
			slideDir.current = "forward";
			setStep(step + 1);
		} else {
			await markDoneAndNavigate();
		}
	}, [step, markDoneAndNavigate]);

	const handlePrev = useCallback(() => {
		if (step > 0) {
			slideDir.current = "backward";
			setStep(step - 1);
		}
	}, [step]);

	const swipeGesture = Gesture.Pan()
		.runOnJS(true)
		.activeOffsetX([-10, 10])
		.onEnd((e) => {
			if (e.translationX < -SWIPE_THRESHOLD) {
				handleNext();
			} else if (e.translationX > SWIPE_THRESHOLD) {
				handlePrev();
			}
		});

	const slide = SLIDES[step];
	const { Illustration } = slide;
	const isLastSlide = step === SLIDES.length - 1;
	const entering = slideDir.current === "forward"
		? SlideInRight.duration(350)
		: SlideInLeft.duration(350);

	return (
		<ScreenWrapper padded={false}>
			{/* Skip */}
			<View style={styles.skipRow}>
				<Button
					title="Skip"
					variant="ghost"
					size="sm"
					onPress={markDoneAndNavigate}
					accessibilityLabel="Bỏ qua phần giới thiệu"
				/>
			</View>

			<GestureDetector gesture={swipeGesture}>
				<View style={styles.slideContent}>
					{/* Only the illustration slides — direction-aware */}
					<Animated.View key={step} entering={entering} style={styles.illustrationContainer}>
						<FloatingContainer>
							<Illustration />
						</FloatingContainer>
					</Animated.View>

					{/* Bottom content — static */}
					<View style={styles.slideBottom}>
						<Text style={styles.slideTitle}>{slide.title}</Text>

						{/* Dots */}
						<View style={styles.dots}>
							{SLIDES.map((_, i) => (
								<AnimatedDot key={i} isActive={i === step} styles={styles} colors={colors} />
							))}
						</View>

						<Button
							title={isLastSlide ? "Bắt đầu" : "Tiếp theo"}
							variant="primary"
							size="lg"
							fullWidth
							onPress={handleNext}
							accessibilityLabel={isLastSlide ? "Hoàn thành giới thiệu" : "Sang slide tiếp theo"}
						/>
					</View>
				</View>
			</GestureDetector>
		</ScreenWrapper>
	);
}

// ─── Styles ───────────────────────────────────────────────────────────────────

function createStyles(colors: ThemeColors) {
	return StyleSheet.create({
		skipRow: {
			alignSelf: "flex-end",
			paddingRight: 16,
			paddingTop: 8,
		},
		slideContent: {
			flex: 1,
		},
		illustrationContainer: {
			flex: 1,
			alignItems: "center",
			justifyContent: "center",
		},
		slideBottom: {
			width: "100%",
			alignItems: "center",
			paddingHorizontal: 24,
			paddingBottom: 40,
			gap: 24,
		},
		slideTitle: {
			color: colors.text.primary,
			fontSize: 26,
			fontWeight: "700",
			textAlign: "center",
			lineHeight: 36,
		},
		dots: {
			flexDirection: "row",
			gap: 8,
		},
		dot: {
			height: 8,
			borderRadius: 4,
			backgroundColor: colors.border.default,
		},
	});
}
