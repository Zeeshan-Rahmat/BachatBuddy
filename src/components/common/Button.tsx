import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

import { COLORS } from '@/src/constants/theme';

interface ButtonProps {
    label: string;
    onPress?: () => void;
    loading?: boolean;
    leftIcon?: React.ReactNode;
    width?: "w-fit" | "flex-1" | "w-full"; // Default "w-full"
    bgColor?: "green" | "gray" | "red" | "blue"; // Default "green"
}

export default function Button({ label, onPress, loading, leftIcon, width = "w-full", bgColor = "green" }: ButtonProps) {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.85}
            disabled={loading}
            className={`
                rounded-button h-14 flex-row items-center justify-center mt-2 px-6
                ${width == "w-fit" ? `${width} self-center` : width}
                ${bgColor == "green" ? `bg-primary-400`
                    : bgColor == "gray" ? "bg-dark-50/20"
                        : bgColor == "blue" ? "bg-navy-400" : "bg-danger"}
                `}
        >
            {loading ? (
                <ActivityIndicator color={COLORS.white} />
            ) : (
                <>
                    {leftIcon && <View className="mr-4">{leftIcon}</View>}
                    <Text
                        className={`text-xl font-semibold ${bgColor == "gray" ? `text-black ` : "text-white "}`}
                    >
                        {label}
                    </Text>
                </>
            )}
        </TouchableOpacity>
    );
}