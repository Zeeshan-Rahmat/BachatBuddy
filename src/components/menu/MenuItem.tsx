import { ICONS } from '@/src/constants/icons';
import React from 'react';
import { Text, TouchableOpacity, type ImageSourcePropType } from 'react-native';
import IconWrapper from '../common/IconWrapper';


interface MenuItemProps {
    icon: ImageSourcePropType;
    label: string;
    onPress: () => void;
    isActive?: boolean;
    activeIcon?: ImageSourcePropType;
    isDanger?: boolean;
    ownerOnly?: boolean;
}

const MenuItem = ({ icon, activeIcon, label, onPress, isActive, isDanger }: MenuItemProps) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            className={`flex-row gap-3 items-center rounded-button p-3 ${isActive ? 'bg-primary-400' : 'bg-white'
                }`}
        >
            {/* Icon circle */}
            {isActive ? <IconWrapper name={activeIcon == undefined ? ICONS.AUTH.dashboard : activeIcon} /> : <IconWrapper name={icon} />}

            {/* Label */}
            <Text
                className={`text-base font-medium ${isDanger
                    ? 'text-danger'
                    : isActive
                        ? 'text-white'
                        : 'text-dark-100'
                    }`}
            >
                {label}
            </Text>
        </TouchableOpacity>
    )
}

export default MenuItem