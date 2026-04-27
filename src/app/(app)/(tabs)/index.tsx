// FR-01, FR-06: Home screen — greeting, streak stats, recent entries, recent playlist

import { useCallback, useMemo } from "react";
import { RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";

import { ScreenWrapper } from "@/components";
import { HomeSkeleton, RecentEntryItem, RecentPlaylistCard, StreakCard } from "@/components/home";
import { Avatar, SectionHeader } from "@/components/ui";
import { ROUTES } from "@/constants";
import { useHomeData, useThemeColors } from "@/hooks";
import type { ThemeColors } from "@/theme";
import { FONT_SIZE, LINE_HEIGHT, RADIUS, SPACING } from "@/theme";
import { s, vs } from "@/utils";
import { router } from "expo-router";

export default function HomeScreen() {
	const colors = useThemeColors();
	const styles = useMemo(() => createStyles(colors), [colors]);
	const { data, isLoading, isRefreshing, refresh } = useHomeData();

	const handleViewAllEntries = useCallback(() => {
		router.push(ROUTES.TAB_JOURNAL);
	}, []);

	if (isLoading) {
		return <HomeSkeleton />;
	}

	const { name, streaks, recentEntries, recentPlaylists } = data ?? {
		name: "",
		streaks: null,
		recentEntries: [],
		recentPlaylists: [],
	};

	return (
		<ScreenWrapper padded={false}>
			<ScrollView
				style={styles.scroll}
				contentContainerStyle={styles.content}
				showsVerticalScrollIndicator={false}
				refreshControl={
					<RefreshControl
						refreshing={isRefreshing}
						onRefresh={refresh}
						tintColor={colors.brand.primary}
					/>
				}>
				{/* Header */}
				<View style={styles.header}>
					<Text style={styles.appTitle}>MoodNote</Text>
				</View>
				{/* Greeting */}
				<View style={styles.greetingRow}>
					<View style={styles.avatarPlaceholder}>
						<Avatar name={name} size="md" />
					</View>
					<View style={styles.greetingText}>
						<Text style={styles.greeting}>Hi, {name.length > 0 ? name : "bạn"}!</Text>
						<Text style={styles.greetingSub}>Ngày hôm nay của bạn có ổn không?</Text>
					</View>
				</View>
				{/* Streak widgets */}
				{streaks != null && (
					<View style={styles.streakRow}>
						<StreakCard iconType="smile" count={streaks.positiveStreak} label="Cười mỗi ngày" />
						<StreakCard
							iconType="fire"
							count={streaks.writingStreak}
							label="Giữ chuỗi bạn nha"
							isHighlighted
							iconBgColor={colors.brand.primary}
						/>
						{streaks.negativeStreak >= 0 && (
							<StreakCard
								iconType="cry"
								count={streaks.negativeStreak}
								label="Buồn rồi, qua nhanh thôi"
								iconBgColor={colors.mood.sadness}
							/>
						)}
					</View>
				)}
				{/* Recent entries */}
				<View style={styles.section}>
					<SectionHeader
						title="Nhật ký gần đây"
						action={{ label: "Xem thêm", onPress: handleViewAllEntries }}
					/>
					{recentEntries.length === 0 ? (
						<View style={styles.emptyBox}>
							<Text style={styles.emptyText}>Chưa có nhật ký nào. Hãy viết ngay!</Text>
						</View>
					) : (
						recentEntries.map((entry) => (
							<RecentEntryItem
								key={entry.id}
								entry={entry}
								onPress={() => router.push(ROUTES.JOURNAL_DETAIL(entry.id))}
							/>
						))
					)}
				</View>
				{/* Recent playlists */}
				{recentPlaylists.length > 0 && (
					<View style={styles.section}>
						<SectionHeader title="Playlist gần đây" />
						{recentPlaylists.map((playlist) => (
							<RecentPlaylistCard key={playlist.id} playlist={playlist} />
						))}
					</View>
				)}
			</ScrollView>
		</ScreenWrapper>
	);
}

function createStyles(colors: ThemeColors) {
	return StyleSheet.create({
		scroll: {
			flex: 1,
		},
		content: {
			paddingHorizontal: SPACING[16],
			paddingBottom: vs(60),
		},
		header: {
			alignItems: "center",
			paddingTop: SPACING[12],
			paddingBottom: SPACING[16],
		},
		appTitle: {
			fontSize: FONT_SIZE[22],
			fontWeight: "700",
			color: colors.brand.primary,
		},
		greetingRow: {
			flexDirection: "row",
			alignItems: "center",
			gap: s(12),
			marginBottom: SPACING[20],
		},
		avatarPlaceholder: {
			width: s(52),
			height: s(52),
			borderRadius: s(26),
			backgroundColor: colors.background.elevated,
			alignItems: "center",
			justifyContent: "center",
		},
		avatarEmoji: {
			fontSize: s(28),
		},
		greetingText: {
			flex: 1,
			gap: vs(2),
		},
		greeting: {
			fontSize: FONT_SIZE[18],
			fontWeight: "700",
			fontStyle: "italic",
			color: colors.brand.primary,
			lineHeight: LINE_HEIGHT.relaxed,
		},
		greetingSub: {
			fontSize: FONT_SIZE[13],
			color: colors.text.secondary,
			lineHeight: LINE_HEIGHT.normal,
		},
		streakRow: {
			flexDirection: "row",
			alignItems: "flex-end",
			paddingTop: s(28),
			gap: s(8),
			marginBottom: SPACING[24],
		},
		section: {
			marginBottom: SPACING[24],
		},
		emptyBox: {
			backgroundColor: colors.background.card,
			borderRadius: RADIUS.md,
			padding: SPACING[16],
			alignItems: "center",
		},
		emptyText: {
			fontSize: FONT_SIZE[13],
			color: colors.text.muted,
			lineHeight: LINE_HEIGHT.normal,
		},
	});
}
