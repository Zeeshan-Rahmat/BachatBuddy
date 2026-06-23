import React from 'react'
import { Text, View } from 'react-native'

export default function PlaceHolderReport({ title }: { title: string }) {
    return (
        <View className="flex-1 items-center justify-center px-8 pt-20">
            <Text style={{ fontSize: 48 }}>📊</Text>
            <Text className="text-slate-700 font-bold text-lg mt-4">{title}</Text>
            <Text className="text-slate-400 text-sm text-center mt-2">
                Coming soon — data will appear here once connected to the backend.
            </Text>
        </View>
    )
}