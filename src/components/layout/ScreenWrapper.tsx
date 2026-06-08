// src/components/layout/ScreenWrapper.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Wraps every main app screen with:
//   - AppHeader (gradient)
//   - Scrollable content area (slate-50 background)
//   - BottomNav
// Usage: wrap your screen content in <ScreenWrapper> ... </ScreenWrapper>
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { ScrollView, View } from 'react-native';
import { AppHeader } from './AppHeader';
import { BottomNav } from './BottomNav';

interface ScreenWrapperProps {
    children: React.ReactNode;
    scrollable?: boolean;      // default true
    onMenuPress?: () => void;
}

export function ScreenWrapper({
    children,
    scrollable = true,
    onMenuPress,
}: ScreenWrapperProps) {
    return (
        <View className="flex-1 bg-slate-50">
            {/* Header */}
            <AppHeader onMenuPress={onMenuPress} />

            {/* Content */}
            {scrollable ? (
                <ScrollView
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 16 }}
                >
                    {children}
                </ScrollView>
            ) : (
                <View className="flex-1">{children}</View>
            )}

            {/* Bottom Nav */}
            <BottomNav />
        </View>
    );
}