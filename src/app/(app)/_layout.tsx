import { Stack } from "expo-router";

import { ProtectedRoute } from "@/components/navigation";
import { NetworkBanner } from "@/components/ui/feedback";
import { View } from "react-native";

export default function AppLayout() {
	return (
		<ProtectedRoute>
			<View style={{ flex: 1 }}>
				<Stack screenOptions={{ headerShown: false }}>
					<Stack.Screen name="(tabs)" />
					<Stack.Screen
						name="journal"
						options={{ animation: "slide_from_bottom" }}
					/>
				</Stack>
				<NetworkBanner />
			</View>
		</ProtectedRoute>
	);
}
