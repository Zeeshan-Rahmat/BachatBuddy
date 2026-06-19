import React from 'react'
import { Text, View } from 'react-native'

const DetailsText = ({ label, value }: { label: string, value: string }) => {
    return (
        <View className="flex-row items-center">
            <Text className="text-dark-50 mr-1">{label}</Text>
            <Text className="font-medium text-dark-200">{value}</Text>
        </View>
    )
}

export default DetailsText