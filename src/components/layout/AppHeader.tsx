// src/components/layout/AppHeader.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Shared header used across all main app screens.
// Design: green→navy gradient, hamburger left, title, bell + avatar right.
// ─────────────────────────────────────────────────────────────────────────────

import { ICONS } from '@/src/constants/icons';
import { COLORS } from '@/src/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import IconWrapper from '../common/IconWrapper';
// import { useAuthStore } from '../../store/authStore';

interface AppHeaderProps {
    onMenuPress?: () => void;
}

export function AppHeader({ onMenuPress }: AppHeaderProps) {
    //   const { user } = useAuthStore();

    const user = {
        avatar_url: null,
        username: "Zeeshan Ullah"
    }
    const insets = useSafeAreaInsets();

    return (
        <LinearGradient
            colors={[COLORS.darkGreen, COLORS.darkNavy]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ paddingTop: insets.top }}
        >
            <View className="flex-row items-center px-4 py-3 h-16">

                {/* Hamburger menu */}
                <TouchableOpacity
                    onPress={onMenuPress}
                    className="mr-3 p-1"
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <IconWrapper name={ICONS.TOP_BAR.menu} />
                </TouchableOpacity>

                {/* App title */}
                <Text className="flex-1 text-white text-xl font-bold tracking-wide">
                    BachatBuddy
                </Text>

                {/* Bell */}
                <TouchableOpacity
                    onPress={() => router.push('/(modal)/notifications')}
                    className="mr-3 p-1"
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <IconWrapper name={ICONS.TOP_BAR.notificationOutline} />
                </TouchableOpacity>

                {/* Avatar */}
                <TouchableOpacity
                    onPress={() => router.push('/(modal)/profile')}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                    {user?.avatar_url ? (
                        <Image
                            source={{ uri: user.avatar_url }}
                            className="w-9 h-9 rounded-full border-2 border-white"
                        />
                    ) : (
                        <View className="w-9 h-9 rounded-full bg-white/30 border-2 border-white items-center justify-center">
                            <Text className="text-white font-bold text-sm">
                                {user?.username?.charAt(0).toUpperCase() ?? 'U'}
                            </Text>
                        </View>
                    )}
                </TouchableOpacity>

            </View>
        </LinearGradient>
    );
}