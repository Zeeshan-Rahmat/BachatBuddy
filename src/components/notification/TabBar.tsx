import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';

interface TabBarProps {
    tabs: string[];
    selectedTab: string;
    setSelectedTab: React.Dispatch<React.SetStateAction<string>>;
}

const TabBar = ({ tabs, selectedTab, setSelectedTab }: TabBarProps) => {
    return (
        <View>
            <FlatList
                data={tabs}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 8 }}
                keyExtractor={(item) => item}
                renderItem={({ item }) => {
                    const isActive = selectedTab === item;
                    return (
                        <TouchableOpacity
                            onPress={() => setSelectedTab(item)}
                            activeOpacity={0.8}
                            className={`px-4 py-2 rounded-lg border ${isActive
                                ? 'bg-primary-400 border-primary-400'
                                : 'bg-white border-light-100'
                                }`}
                        >
                            <Text
                                className={`text-sm font-medium ${isActive ? 'text-white' : 'text-dark-50'
                                    }`}
                            >
                                {item}
                            </Text>
                        </TouchableOpacity>
                    );
                }}
            />
        </View>
    )
}

export default TabBar