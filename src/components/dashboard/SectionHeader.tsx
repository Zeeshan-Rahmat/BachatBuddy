import { COLORS } from '@/src/constants/theme';
import { ReportFilterType } from '@/src/types/appTypes';
import React from 'react';
import { ColorValue, Text, TouchableOpacity, View } from 'react-native';
import ReportValueSelect from '../report/ReportValueSelect';

interface SectionHeaderProps {
    title: string;
    insteadOfViewMore?: string;
    marginTop?: number;
    marginBottom?: number;
    hasViewMore?: boolean; // Default true
    fontSize?: number; // Default "text-lg"
    textColor?: ColorValue; // Default dark300

    hasFilter?: ReportFilterType;

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

    hasFilter,
    onPress
}: SectionHeaderProps) => {
    return (
        <View className="flex-row items-center justify-between mb-3" style={{ marginTop: marginTop, marginBottom: marginBottom }}>
            <Text className="font-bold tracking-wide" style={{ fontSize: fontSize, color: textColor }}>
                {title}
            </Text>

            {
                hasViewMore &&
                <TouchableOpacity onPress={onPress}>
                    <Text className="text-navy-400 text-sm font-semibold">{insteadOfViewMore}</Text>
                </TouchableOpacity>
            }

            {
                hasFilter &&
                <ReportValueSelect
                    value={hasFilter.value}
                    values={hasFilter.values}
                    onChange={hasFilter.onChange}
                />
            }
        </View>
    )
}

export default SectionHeader