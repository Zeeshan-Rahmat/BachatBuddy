import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

import { COLORS } from '@/src/constants/theme';

interface ButtonProps {
    label: string;
    onPress?: () => void;
    loading?: boolean;
    isDisabled?: boolean;
    leftIcon?: React.ReactNode;
    width?: "w-fit" | "flex-1" | "w-full"; // Default "w-full"
    bgColor?: "green" | "gray" | "red" | "blue"; // Default "green"
}

export default function Button({
    label,
    onPress,
    loading,
    isDisabled,
    leftIcon,
    width = "w-full",
    bgColor = "green"
}: ButtonProps) {

    const bgVariants = {
        green: "bg-primary-400",
        gray: "bg-dark-50/20",
        blue: "bg-navy-400",
        red: "bg-danger"
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.85}
            disabled={loading || isDisabled}
            className={`
                rounded-button h-14 flex-row items-center justify-center mt-2 px-6
                ${width == "w-fit" ? `${width} self-center` : width}
                ${isDisabled ? "bg-dark-50" : bgVariants[bgColor]}
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