import { COLORS } from '@/src/constants/theme'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import React from 'react'
import { TouchableOpacity } from 'react-native'

const CloseButton = ({ top = 0, right = 0, onClose }: { top?: number, right?: number, onClose: () => void }) => {
    return (
        <TouchableOpacity
            onPress={onClose}
            activeOpacity={0.7}
            className="absolute bg-danger/20 p-1.5 rounded-button z-10"
            style={{ top: top, right: right }}
        >
            <MaterialCommunityIcons name="close" size={20} color={COLORS.danger} />
        </TouchableOpacity>
    )
}

export default CloseButton