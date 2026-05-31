import { View } from 'react-native';

export default function Wrapper({ children }: { children: React.ReactNode }) {
    return (
        <View className="bg-white rounded-2xl mx-5 px-6 py-8 shadow-lg">
            {children}
        </View>
    );
}