import { Text, View } from 'react-native';

export default function OrDivider() {
    return (
        <View className="flex-row items-center mt-3 mb-7">
            <View className="flex-1 h-px bg-gray-200" />
            <Text className="mx-4 text-gray-400 text-sm">or</Text>
            <View className="flex-1 h-px bg-gray-200" />
        </View>
    );
}