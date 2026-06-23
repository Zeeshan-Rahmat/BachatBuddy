import { LegendLineChartType } from '@/src/types/appTypes';
import React from 'react';
import { Text, View } from 'react-native';

interface LegendItemProps {
    label: string;
    color: string;
    dotColor: string;
}

const LegendItem = ({ label, color, dotColor }: LegendItemProps) => {
    return (
        <View className="flex-row items-center mx-4 my-2">

            <View className="w-10 h-3 justify-center items-center relative mr-2.5">

                <View style={{ backgroundColor: color }} className="w-full h-1.5 rounded-full absolute" />

                <View
                    style={{ backgroundColor: dotColor, borderColor: 'white' }}
                    className="w-3.5 h-3.5 rounded-full border z-10"
                />
            </View>

            <Text className="text-base font-bold text-slate-500 tracking-tight">
                {label}
            </Text>
        </View>
    );
};

interface ChartLegendProps {
    legendData: LegendLineChartType[];
}

export default function ChartLegend({ legendData }: ChartLegendProps) {
    return (
        <View className="flex-row items-center justify-center py-3 px-2 mt-2">

            {
                legendData &&
                legendData.map((item) => {
                    return (
                        <LegendItem
                            key={item.label}
                            label={item.label}
                            color={item.color}
                            dotColor={item.dotColor}
                        />
                    )
                })
            }

        </View>
    );
}