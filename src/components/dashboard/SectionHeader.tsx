import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface SectionHeaderProps {
    title: string;
    marginTop?: number;
    marginBottom?: number;
    hasViewMore?: boolean; // Default true
    fontSize?: number; // Default "text-lg"
}

const SectionHeader = ({ title, marginTop = 24, marginBottom = 12, hasViewMore = true, fontSize = 16 }: SectionHeaderProps) => {
    return (
        <View className="flex-row items-center justify-between mb-3" style={{ marginTop: marginTop, marginBottom: marginBottom }}>
            <Text className="text-dark-300 font-bold tracking-wide" style={{ fontSize: fontSize }}>
                {title}
            </Text>
            {hasViewMore && <TouchableOpacity><Text className="text-slate-400 text-sm">View All</Text></TouchableOpacity>}
        </View>
    )
}

export default SectionHeader