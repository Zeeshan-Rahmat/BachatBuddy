import { COLORS } from '@/src/constants/theme';
import React from 'react';
import { ColorValue, Text, TouchableOpacity, View } from 'react-native';

interface SectionHeaderProps {
    title: string;
    insteadOfViewMore?: string;
    marginTop?: number;
    marginBottom?: number;
    hasViewMore?: boolean; // Default true
    fontSize?: number; // Default "text-lg"
    textColor?: ColorValue; // Default dark300

    onPress?: () => void;
}

const SectionHeader = ({
    title,
    insteadOfViewMore = "View More",
    marginTop = 24,
    marginBottom = 12,
    hasViewMore = true,
    fontSize = 16,
    textColor = COLORS.dark300,
    onPress
}: SectionHeaderProps) => {
    return (
        <View className="flex-row items-center justify-between mb-3" style={{ marginTop: marginTop, marginBottom: marginBottom }}>
            <Text className="font-bold tracking-wide" style={{ fontSize: fontSize, color: textColor }}>
                {title}
            </Text>
            {hasViewMore &&
                <TouchableOpacity onPress={onPress}>
                    <Text className="text-navy-400 text-sm font-semibold">{insteadOfViewMore}</Text>
                </TouchableOpacity>}
        </View>
    )
}

export default SectionHeader