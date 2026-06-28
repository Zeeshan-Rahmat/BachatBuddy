// src/components/layout/AppHeader.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Shared header used across all main app screens.
// Design: green→navy gradient, hamburger left, title, bell + avatar right.
// ─────────────────────────────────────────────────────────────────────────────

import { ICONS } from '@/src/constants/icons';
import { ROUTES } from '@/src/constants/routes';
import { COLORS } from '@/src/constants/theme';
import { useAuthStore } from '@/src/store/authStore';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View, type ImageSourcePropType } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Avatar from '../common/Avatar';
import IconWrapper from '../common/IconWrapper';

interface AppHeaderProps {
    title?: string;
    leftIcon?: "menu" | "back"; // Default "menu"
    rightIcons?: "avatarNotification" | "more" | "none"; // Default "avatarNotification"
    onMenuPress?: () => void;
    onMorePress?: () => void;
}

export function AppHeader(
    {
        title = "BachatBuddy",
        leftIcon = "menu",
        rightIcons = "avatarNotification",
        onMenuPress,
        onMorePress

    }: AppHeaderProps

) {
    const user = useAuthStore((state) => state.user);
    const insets = useSafeAreaInsets();
    const displayTitle = title === 'BachatBuddy'
        ? user?.businessName ?? title
        : title;

    return (
        <LinearGradient
            colors={[COLORS.darkGreen, COLORS.darkNavy]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ paddingTop: insets.top }}
        >
            <View className="flex-row gap-3 items-center px-4 py-3 h-16">

                {/* Hamburger menu */}
                {
                    leftIcon === "menu"
                        ? <AppBarIcons icon={ICONS.TOP_BAR.menu} onPress={onMenuPress} />
                        : <AppBarIcons icon={ICONS.COMMON.back} onPress={() => router.back()} />
                }

                {/* App title */}
                <Text className="flex-1 text-white text-xl font-bold tracking-wide">
                    {displayTitle}
                </Text>

                {/* Bell */}
                {
                    rightIcons === "avatarNotification"
                    && <AppBarIcons icon={ICONS.TOP_BAR.notificationOutline} onPress={() => router.push(ROUTES.MODAL.NOTIFICATION)} />
                }

                {/* More Icon */}
                {
                    rightIcons === "more"
                    && <AppBarIcons icon={ICONS.COMMON.more} onPress={onMorePress} />
                }

                {/* Avatar */}
                {
                    rightIcons === "avatarNotification"
                    && (
                        <Avatar
                            name={user?.name ?? user?.username ?? 'Profile'}
                            img={user?.img ?? undefined}
                            onPress={() => router.push(ROUTES.MODAL.PROFILE)}
                        />
                    )
                }

            </View>
        </LinearGradient>
    );
}

function AppBarIcons({ icon, onPress }: { icon: ImageSourcePropType, onPress: (() => void) | undefined }) {

    return (
        <TouchableOpacity
            onPress={onPress}
            className="p-1"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
            <IconWrapper name={icon} />
        </TouchableOpacity>
    )
}
