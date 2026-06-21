import { COLORS } from '@/src/constants/theme';
import React from 'react';
import { ColorValue, Text, View } from 'react-native';

interface InfoFieldProps {
    label: string;
    value: string;
    valueColor?: ColorValue;
}

const InfoField = ({ label, value, valueColor = COLORS.dark300 }: InfoFieldProps) => {
    return (
        <View className='flex-row justify-between'>
            <Text className='text-dark-50 text-lg font-semibold'>{label}</Text>
            <Text className='text-lg font-semibold' style={{ color: valueColor }}>{value}</Text>
        </View>
    )
}

export default InfoField