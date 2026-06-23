import { COLORS } from '@/src/constants/theme';
import React from 'react';
import { LineChart, lineDataItem } from 'react-native-gifted-charts';

interface CustomLineChartProps {
    firstLine?: lineDataItem[];
    secondLine?: lineDataItem[];
}

export default function CustomLineChart({ firstLine, secondLine }: CustomLineChartProps) {
    return (
        <LineChart
            data={firstLine}
            data2={secondLine}

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

            maxValue={90000}
            noOfSections={9} // Evenly splits lines from 10k to 90k intervals
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
    )
}