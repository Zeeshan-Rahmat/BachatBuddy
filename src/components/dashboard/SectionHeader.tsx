import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface SectionHeaderProps {
    title: string;
    marginTop?: number;
    hasViewMore?: boolean; // Default true
}

const SectionHeader = ({ title, marginTop = 24, hasViewMore = true }: SectionHeaderProps) => {
    return (
        <View className="flex-row items-center justify-between mb-3" style={{ marginTop: marginTop }}>
            <Text className="text-dark-300 text-lg font-bold tracking-wide">{title}</Text>
            {hasViewMore && <TouchableOpacity><Text className="text-slate-400 text-sm">View All</Text></TouchableOpacity>}
        </View>
    )
}

export default SectionHeader