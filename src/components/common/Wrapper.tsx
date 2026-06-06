import { View } from 'react-native';

export default function Wrapper({ children }: { children: React.ReactNode }) {
    return (
        <View className="w-full bg-white rounded-2xl px-4 py-8 shadow-lg">
            {children}
        </View>
    );
}