import React from 'react';
import { ScrollView, View } from 'react-native';
import { AppHeader } from './AppHeader';
import { BottomNav } from './BottomNav';

interface ScreenWrapperProps {
    children: React.ReactNode;
    scrollable?: boolean;      // default true
    onMenuPress?: () => void;
}

export default function ScreenWrapper({
    children,
    scrollable = true,
    onMenuPress,
}: ScreenWrapperProps) {
    return (
        <View className="flex-1 bg-light-300">

            <AppHeader onMenuPress={onMenuPress} />


            {scrollable ? (
                <ScrollView
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                >
                    {children}
                </ScrollView>
            ) : (
                <View className="flex-1">{children}</View>
            )}


            <BottomNav />
        </View>
    );
}