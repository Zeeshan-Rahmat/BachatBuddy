import { COLORS } from '@/src/constants/theme';
import { ChartScaleType } from '@/src/types/appTypes';
import React from 'react';
import { View } from 'react-native';
import { LineChart, lineDataItem } from 'react-native-gifted-charts';

interface CustomLineChartProps {
    firstLineData?: lineDataItem[];
    secondLineData?: lineDataItem[];

    chartScale?: ChartScaleType;
}

export default function CustomLineChart({ firstLineData, secondLineData, chartScale }: CustomLineChartProps) {
    return (

        <View className="rounded-button items-center justify-center overflow-hidden">
            <LineChart
                data={firstLineData}
                data2={secondLineData}

                width={300}
                height={220}
                spacing={48}
                initialSpacing={24}
                endSpacing={20}

                thickness={3}
                dataPointsRadius={4}

                color={COLORS.primaryGreen}
                dataPointsColor={COLORS.darkGreen}

                color2={COLORS.navy300}
                dataPointsColor2={COLORS.primaryNavy}

                hideRules={false}
                focusedDataPointColor="#1e3a1e"

                maxValue={chartScale?.maxValue}
                noOfSections={chartScale?.noOfSections}

                yAxisColor="transparent" // Clean baseline configuration
                yAxisTextStyle={{ color: '#475569', fontSize: 12, fontWeight: '500' }}
                yAxisLabelContainerStyle={{ width: 45 }}

                xAxisColor="#cbd5e1" // Soft separator baseline slate color
                xAxisLabelTextStyle={{
                    color: '#1e3a8a', // Deep indigo font accents
                    fontSize: 11,
                    fontWeight: '500',
                    textAlign: 'center'
                }}

                rulesColor="#e2e8f0" // Fine light-grey container matrix guidelines
                rulesType="solid"
                hideYAxisText={false}
            />
        </View>
    )
}