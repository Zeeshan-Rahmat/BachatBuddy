import React from 'react';
import { Text, View } from 'react-native';

interface InfoFieldProps {
    label: string;
    value: string;
}

const InfoField = ({ label, value }: InfoFieldProps) => {
    return (
        <View className='flex-row justify-between'>
            <Text className='text-dark-50 text-lg font-semibold'>{label}</Text>
            <Text className='text-dark-300 text-lg font-semibold'>{value}</Text>
        </View>
    )
}

export default InfoField