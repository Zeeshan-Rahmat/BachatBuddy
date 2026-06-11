import { ICONS } from '@/src/constants/icons';
import React from 'react';
import { type ImageSourcePropType, Text, View } from 'react-native';
import IconWrapper from '../common/IconWrapper';
import IconWithBackground from './IconWithBackground';

interface StatCardProps {
    icon: ImageSourcePropType;
    trend: string;
    trendUp: boolean;
    value: string;
    label: string;
}

const StatCard = ({ icon, trend, trendUp, value, label }: StatCardProps) => {
    return (
        <View className="bg-white rounded-button p-4 flex-1 min-w-[44%]"
            style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 8, elevation: 3 }}>
            <View className="flex-row items-center justify-between mb-4">
                <IconWithBackground icon={icon} />
                <View className={`flex-row items-center gap-1 px-2 py-1 rounded-full ${trendUp ? 'bg-success/10' : 'bg-danger/10'}`}>
                    <TrendText label={trendUp ? '▲' : '▼'} trendUp={trendUp} />
                    <TrendText label={trend} trendUp={trendUp} />
                </View>
            </View>
            <Text className="text-4xl font-bold text-black mb-1">{value}</Text>
            <View className="flex-row items-center justify-between">
                <Text className="text-dark-100 text-base">{label}</Text>
                <IconWrapper name={ICONS.DASHBOARD.topRightArrow} size={10} />
            </View>
        </View>
    )
}

function TrendText({ label, trendUp }: { label: string, trendUp: boolean }) {
    return (
        <Text className={`text-xs font-bold ${trendUp ? 'text-success' : 'text-danger'}`}>
            {label}
        </Text>
    )
}

export default StatCard