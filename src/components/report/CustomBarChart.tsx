import { ChartScaleType } from '@/src/types/appTypes';
import React from 'react';
import { Text, View } from 'react-native';
import { BarChart, barDataItem } from 'react-native-gifted-charts';

interface BarChartTooltipType {
    value: number;
    label?: string

}

interface CustomBarChartProps {
    data?: barDataItem[];
    chartScale?: ChartScaleType;
}

export default function CustomBarChart({ data, chartScale }: CustomBarChartProps) {
    return (
        <BarChart
            data={data}
            maxValue={chartScale?.maxValue}
            noOfSections={chartScale?.noOfSections}
            renderTooltip={(item: BarChartTooltipType) => {
                return (
                    <View className='mb-2 bg-navy-400 px-1.5 py-1 rounded'>
                        <Text className='text-white'>{item.value}</Text>
                    </View>
                );
            }} />
    )
}