import { COLORS } from '@/src/constants/theme';
import { useState } from 'react';
import {
    Text,
    TextInput,
    TouchableOpacity,
    View,
    type TextInputProps
} from 'react-native';

interface InputTextProps extends TextInputProps {
    icon: React.ReactNode;
    rightIcon?: React.ReactNode;
    activeIcon?: React.ReactNode;
    activeRightIcon?: React.ReactNode;
    onRightIconPress?: () => void;
    error?: string;
}

export default function InputText({
    icon,
    rightIcon,
    activeIcon,
    activeRightIcon,
    onRightIconPress,
    error,
    ...props
}: InputTextProps) {

    const [isFocused, setIsFocused] = useState(false)

    return (
        <View className="mb-4">
            <View
                className={
                    `flex-row items-center rounded-inputBox border border-light-100 px-3 h-14 ${error ? 'border-red-400' : ''
                    }
                    ${isFocused ? 'border-primary-400' : ''}`}
            >
                <View className="mr-3">{isFocused ? activeIcon : icon}</View>
                <TextInput
                    className="flex-1 text-black text-base outline-none"
                    placeholderTextColor={COLORS.placeholder}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    autoCapitalize="none"
                    {...props}
                />
                {rightIcon && (
                    <TouchableOpacity onPress={onRightIconPress} className="ml-2 p-1">
                        {isFocused ? activeRightIcon : rightIcon}
                    </TouchableOpacity>
                )}
            </View>
            {error && (
                <Text className="text-red-500 text-xs mt-1 ml-1">{error}</Text>
            )}
        </View>
    );
}