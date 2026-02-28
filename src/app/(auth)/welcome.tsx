import { Button } from "@/components/ui";
import { ScreenWrapper } from "@/components/layout";
import { ROUTES } from "@/constants";
import { useThemeColors } from "@/hooks";
import { SPACING } from "@/theme";
import type { ThemeColors } from "@/theme";
import { s } from "@/utils";
import { router } from "expo-router";
import { useCallback, useMemo } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn, FadeInDown, FadeInUp, ZoomIn } from "react-native-reanimated";

export default function WelcomeScreen() {
	const colors = useThemeColors();
	const styles = useMemo(() => createStyles(colors), [colors]);

	const handleRegister = useCallback(() => {
		router.push(ROUTES.REGISTER);
	}, []);

	const handleLogin = useCallback(() => {
		router.push(ROUTES.LOGIN);
	}, []);

	return (
		<ScreenWrapper>
			<View style={styles.container}>
				{/* Logo */}
				<View style={styles.logoSection}>
					<Animated.View entering={ZoomIn.duration(500)}>
						<Image
							source={require("../../../assets/images/splash-icon.png")}
							style={styles.logo}
							resizeMode="contain"
						/>
					</Animated.View>
					<Animated.View entering={FadeInDown.duration(400).delay(150)}>
						<Text style={styles.logoText}>MoodNote</Text>
					</Animated.View>
				</View>

				{/* Tagline */}
				<Animated.View entering={FadeInDown.duration(400).delay(300)} style={styles.taglineSection}>
					<Text style={styles.tagline}>Trò chuyện</Text>
					<Text style={styles.tagline}>với chính mình</Text>
				</Animated.View>

				{/* Actions */}
				<Animated.View entering={FadeInUp.duration(400).delay(450)} style={styles.actions}>
					<Button
						title="Đăng kí"
						variant="primary"
						size="lg"
						fullWidth
						onPress={handleRegister}
						accessibilityLabel="Tạo tài khoản mới"
					/>
					<Button
						title="Đăng nhập"
						variant="ghost"
						size="lg"
						fullWidth
						onPress={handleLogin}
						accessibilityLabel="Đăng nhập vào tài khoản"
					/>
				</Animated.View>
			</View>
		</ScreenWrapper>
	);
}

function createStyles(colors: ThemeColors) {
	return StyleSheet.create({
		container: {
			flex: 1,
			alignItems: "center",
			justifyContent: "space-between",
			paddingVertical: SPACING[48],
		},
		logoSection: {
			alignItems: "center",
			gap: SPACING[12],
		},
		logo: {
			width: s(80),
			height: s(80),
		},
		logoText: {
			color: colors.text.primary,
			fontSize: 24,
			fontWeight: "700",
			letterSpacing: 1,
		},
		taglineSection: {
			alignItems: "center",
			gap: SPACING[4],
		},
		tagline: {
			color: colors.text.primary,
			fontSize: 32,
			fontWeight: "700",
			textAlign: "center",
		},
		actions: {
			width: "100%",
			gap: SPACING[20],
			alignItems: "center",
		},
	});
}
