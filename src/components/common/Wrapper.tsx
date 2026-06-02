import { View } from 'react-native';

export default function Wrapper({ children }: { children: React.ReactNode }) {
    return (
        <View className="bg-white rounded-card mx-5 px-4 py-8 shadow-lg">
            {children}
        </View>
    );
}