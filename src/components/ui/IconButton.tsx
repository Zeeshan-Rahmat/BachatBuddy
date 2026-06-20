import { COLORS } from '@/src/constants/theme';
import React from 'react';
import { type ColorValue, TouchableOpacity } from 'react-native';

interface IconButtonProps {
    icon: React.ReactNode;
    bgColor?: ColorValue;
    onPress?: () => void;
}

const IconButton = ({ icon, bgColor = COLORS.primary400, onPress }: IconButtonProps) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            className="mb-4 w-14 h-14 rounded-button items-center justify-center"
            style={{ backgroundColor: bgColor }}
        >
            {icon}
        </TouchableOpacity>
    )
}

export default IconButton