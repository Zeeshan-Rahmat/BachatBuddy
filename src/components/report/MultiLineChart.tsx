import { ChartScaleType, LegendLineChartType } from '@/src/types/appTypes';
import React from 'react';
import { View } from 'react-native';
import { lineDataItem } from 'react-native-gifted-charts';
import ChartLegend from './ChartLegend';
import CustomLineChart from './CustomLineChart';

interface MultiLineChartProps {
    firstLineData: lineDataItem[];
    secondLineData: lineDataItem[];
    legendData: LegendLineChartType[];

    chartScale?: ChartScaleType;
}

export default function MultiLineChart({ firstLineData, secondLineData, legendData, chartScale }: MultiLineChartProps) {
    return (

        <View className="rounded-button items-center justify-center overflow-hidden">
            <CustomLineChart firstLineData={firstLineData} secondLineData={secondLineData} chartScale={chartScale} />
            <ChartLegend
                legendData={legendData}
            />
        </View>
    )
}