import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import messaging, { setBackgroundMessageHandler } from "@react-native-firebase/messaging";

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
	initialRouteName: "index",
};

SplashScreen.preventAutoHideAsync();

// FR-21: Background message handler — must be module-level so Android headless tasks fire correctly.
// getMessaging() crashes at module-level in new arch (RN 0.81.5) due to bridge timing,
// so we use messaging() (namespaced) here. RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS suppresses
// the resulting deprecation warning for this specific call only.
(globalThis as { RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS?: boolean }).RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS = true;
setBackgroundMessageHandler(messaging(), async (_remoteMessage) => {
	// Handler registration is required for Android headless tasks — no action needed
});
(globalThis as { RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS?: boolean }).RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS = false;

export default function RootLayout() {
	const [loaded, error] = useFonts({
		SpaceMono: require("../../assets/fonts/SpaceMono-Regular.ttf"),
		...FontAwesome.font,
	});

	useEffect(() => {
		if (error) throw error;
	}, [error]);

	useEffect(() => {
		if (!loaded) return;
		void SplashScreen.hideAsync();
	}, [loaded]);

	if (!loaded) return null;

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<AuthProvider>
				<ThemeProvider>
					<Stack screenOptions={{ headerShown: false }}>
						<Stack.Screen name="index" />
						<Stack.Screen name="component-review" />
						<Stack.Screen name="(auth)" />
						<Stack.Screen name="(app)" />
					</Stack>
				</ThemeProvider>
			</AuthProvider>
		</GestureHandlerRootView>
	);
}
