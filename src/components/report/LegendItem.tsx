import React from 'react';
import { Text, View } from 'react-native';

interface LegendItemProps {
    color: string;
    label: string;
    value: string;
}

export default function LegendItem({ color, label, value }: LegendItemProps) {
    return (
        <View className="flex-row items-center mb-3">
            <View className={`w-3 h-3 rounded-full ${color} mr-2`} />
            <View>
                <Text className="text-slate-500 text-xs">{label}</Text>
                <Text className="text-slate-800 font-bold text-sm">{value}</Text>
            </View>
        </View>
    )
}