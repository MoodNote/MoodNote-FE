import { AuthProvider } from "@/contexts/AuthContext";
import { SyncProvider } from "@/contexts/SyncContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { initDatabase } from "@/db";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
	initialRouteName: "index",
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const [loaded, error] = useFonts({
		SpaceMono: require("../../assets/fonts/SpaceMono-Regular.ttf"),
		...FontAwesome.font,
	});
	const [dbReady, setDbReady] = useState(false);

	useEffect(() => {
		if (error) throw error;
	}, [error]);

	useEffect(() => {
		if (!loaded) return;
		void initDatabase()
			.then(() => setDbReady(true))
			.catch((err) => {
				console.error("DB init failed", err);
				setDbReady(true); // still render so user sees something
			})
			.finally(() => SplashScreen.hideAsync());
	}, [loaded]);

	if (!loaded || !dbReady) return null;

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<AuthProvider>
				<SyncProvider>
					<ThemeProvider>
						<Stack screenOptions={{ headerShown: false }}>
							<Stack.Screen name="index" />
							<Stack.Screen name="component-review" />
							<Stack.Screen name="(auth)" />
							<Stack.Screen name="(app)" />
						</Stack>
					</ThemeProvider>
				</SyncProvider>
			</AuthProvider>
		</GestureHandlerRootView>
	);
}
