import { useDrawer } from '@hooks/useDrawer';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { AppHeader } from './AppHeader';
import { BottomNav } from './BottomNav';
import { DrawerMenu } from './DrawerMenu';

interface ScreenWrapperProps {
    children: React.ReactNode;
    scrollable?: boolean;      // default true
    title?: string; // default 'BachatBuddy'
    isMenuIncluded?: boolean;      // default true
    isBottomNavIncluded?: boolean;      // default true
    leftIcon?: "menu" | "back"; // Default "menu"
    rightIcons?: "avatarNotification" | "more" | "none"; // Default "avatarNotification"
    onMorePress?: () => void;
}

export default function ScreenWrapper({
    children,
    scrollable = true,
    title = "BachatBuddy",
    isMenuIncluded = true,
    isBottomNavIncluded = true,
    leftIcon = "menu",
    rightIcons = "avatarNotification",
    onMorePress,

}: ScreenWrapperProps) {

    const { isOpen, openDrawer, closeDrawer } = useDrawer();

    return (
        <View className="flex-1 bg-light-300">

            <AppHeader title={title} leftIcon={leftIcon} rightIcons={rightIcons} onMenuPress={openDrawer} onMorePress={onMorePress} />


            {scrollable ? (
                <ScrollView
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                    nestedScrollEnabled
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{ flexGrow: 1 }}
                >
                    {children}
                </ScrollView>
            ) : (
                <View className="flex-1">{children}</View>
            )}


            {isBottomNavIncluded && <BottomNav />}

            {isMenuIncluded && <DrawerMenu isOpen={isOpen} onClose={closeDrawer} />}
        </View>
    );
}
