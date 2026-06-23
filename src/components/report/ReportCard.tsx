import { COLORS } from '@/src/constants/theme';
import { ReportFilterType } from '@/src/types/appTypes';
import React from 'react';
import { View } from 'react-native';
import SectionHeader from '../dashboard/SectionHeader';

interface ReportCardProps {
    title: string;

    hasFilter?: ReportFilterType;


    children: React.ReactNode;
}

export default function ReportCard({
    title,

    hasFilter,

    children

}: ReportCardProps) {
    return (
        <View className="mb-8">
            <SectionHeader
                title={title}
                marginTop={0}
                textColor={COLORS.dark100}
                hasViewMore={false}

                hasFilter={hasFilter}

            />
            <View className="bg-white rounded-button p-3">
                {children}
            </View>
        </View>
    )
}