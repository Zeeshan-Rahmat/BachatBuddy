import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

import { COLORS } from '@/src/constants/theme';

interface ButtonProps {
    label: string;
    onPress: () => void;
    loading?: boolean;
    leftIcon?: React.ReactNode;
}

export default function Button({ label, onPress, loading, leftIcon }: ButtonProps) {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.85}
            disabled={loading}
            className="bg-primary-400 rounded-button h-14 flex-row items-center justify-center mt-2"
        >
            {loading ? (
                <ActivityIndicator color={COLORS.white} />
            ) : (
                <>
                    {leftIcon && <View className="mr-2">{leftIcon}</View>}
                    <Text className="text-white text-xl font-semibold">{label}</Text>
                </>
            )}
        </TouchableOpacity>
    );
}