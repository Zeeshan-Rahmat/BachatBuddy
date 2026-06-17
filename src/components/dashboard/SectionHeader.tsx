import { COLORS } from '@/src/constants/theme';
import React from 'react';
import { ColorValue, Text, TouchableOpacity, View } from 'react-native';

interface SectionHeaderProps {
    title: string;
    marginTop?: number;
    marginBottom?: number;
    hasViewMore?: boolean; // Default true
    fontSize?: number; // Default "text-lg"
    textColor?: ColorValue; // Default dark300
}

const SectionHeader = ({ title, marginTop = 24, marginBottom = 12, hasViewMore = true, fontSize = 16, textColor = COLORS.dark300 }: SectionHeaderProps) => {
    return (
        <View className="flex-row items-center justify-between mb-3" style={{ marginTop: marginTop, marginBottom: marginBottom }}>
            <Text className="font-bold tracking-wide" style={{ fontSize: fontSize, color: textColor }}>
                {title}
            </Text>
            {hasViewMore && <TouchableOpacity><Text className="text-slate-400 text-sm">View All</Text></TouchableOpacity>}
        </View>
    )
}

export default SectionHeader