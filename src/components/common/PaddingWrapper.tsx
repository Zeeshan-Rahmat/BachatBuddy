import { View } from 'react-native';

export default function PaddingWrapper({ children }: { children: React.ReactNode }) {
    return (
        <View className="flex-1 p-5">
            {children}
        </View>
    );
}