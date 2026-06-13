import React from 'react'
import { View } from 'react-native'

const MenuItemsWrapper = ({ children }: { children: React.ReactNode }) => {
    return (
        <View className="bg-white rounded-card overflow-hidden p-3">
            {children}
        </View>
    )
}

export default MenuItemsWrapper