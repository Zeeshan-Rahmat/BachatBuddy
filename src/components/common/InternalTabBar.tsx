import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface InternalTabBarProps {
    tabs: string[];
    activeTab: string;
    setActiveTab: React.Dispatch<React.SetStateAction<string>>
}

const InternalTabBar = ({ tabs, setActiveTab, activeTab }: InternalTabBarProps) => {
    return (
        <View className="flex-row border-b border-light-100 bg-white">
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