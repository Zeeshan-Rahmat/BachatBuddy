import { LegendPieChartType } from '@/src/types/appTypes';
import React from 'react';
import { Text, View } from 'react-native';
import { PieChart, pieDataItem } from 'react-native-gifted-charts';

interface CustomPieChartProps {
    data: pieDataItem[];
    radius?: number;
    legendLabelData?: LegendPieChartType[];
}

export default function CustomPieChart({ data, radius, legendLabelData }: CustomPieChartProps) {
    return (
        <View className="flex-row items-center">
            <View className="flex-1">
                {
                    legendLabelData &&
                    legendLabelData.map((item) => {
                        return <LegendItem key={item.color} color={item.color} label={item.label} value={item.value} />
                    })
                }
            </View>
            <PieChart data={data} radius={radius} donut />
        </View>
    )
}

interface LegendItemProps {
    color: string;
    label: string;
    value: string;
}

function LegendItem({ color, label, value }: LegendItemProps) {
    return (
        <View className="flex-row items-start mb-3">
            <View className={`w-3 h-3 rounded-full ${color} mt-1 mr-2`} />
            <View>
                <Text className="text-dark-50 text-xs">{label}</Text>
                <Text className="text-dark-200 font-bold text-sm">{value}</Text>
            </View>
        </View>
    )
}