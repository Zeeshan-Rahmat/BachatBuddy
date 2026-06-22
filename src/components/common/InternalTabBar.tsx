import React from 'react';
import { ColorValue, Text, TouchableOpacity, View } from 'react-native';

interface InternalTabBarProps {
    tabs: string[];
    activeTab: string;
    bgColor?: ColorValue;
    setActiveTab: React.Dispatch<React.SetStateAction<string>>
}

const InternalTabBar = ({ tabs, activeTab, bgColor = "white", setActiveTab }: InternalTabBarProps) => {
    return (
        <View className="flex-row border-b border-light-100" style={{ backgroundColor: bgColor }}>
            {tabs.map(tab => (
                <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)}
                    className="flex-1 items-center py-4">
                    <Text className={`text-sm font-semibold ${activeTab === tab ? 'text-primary-400' : 'text-dark-50'}`}>
                        {tab}
                    </Text>
                    {activeTab === tab && (
                        <View className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary-400 rounded-full" />
                    )}
                </TouchableOpacity>
            ))}
        </View>
    )
}

export default InternalTabBar