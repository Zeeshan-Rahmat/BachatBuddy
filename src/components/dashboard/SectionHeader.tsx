import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

interface SectionHeaderProps {
    title: string

}

const SectionHeader = ({ title }: SectionHeaderProps) => {
    return (
        <View className="flex-row items-center justify-between mt-6 mb-3">
            <Text className="text-dark-300 text-lg font-bold tracking-wide">{title}</Text>
            <TouchableOpacity><Text className="text-slate-400 text-sm">View All</Text></TouchableOpacity>
        </View>
    )
}

export default SectionHeader