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
    onRightIconPress?: () => void;
    error?: string;
}

export default function InputText({
    icon,
    rightIcon,
    onRightIconPress,
    error,
    ...props
}: InputTextProps) {
    return (
        <View className="mb-3">
            <View
                className={`flex-row items-center rounded-[5px] border border-light-100 px-3 h-14 ${error ? 'border-red-400' : 'border-gray-200'
                    }`}
            >
                <View className="mr-3">{icon}</View>
                <TextInput
                    className="flex-1 text-gray-800 text-base"
                    placeholderTextColor="#9CA3AF"
                    autoCapitalize="none"
                    {...props}
                />
                {rightIcon && (
                    <TouchableOpacity onPress={onRightIconPress} className="ml-2 p-1">
                        {rightIcon}
                    </TouchableOpacity>
                )}
            </View>
            {error && (
                <Text className="text-red-500 text-xs mt-1 ml-1">{error}</Text>
            )}
        </View>
    );
}