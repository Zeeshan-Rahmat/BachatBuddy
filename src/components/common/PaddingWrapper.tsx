import { View } from 'react-native';

interface PaddingWrapperProps {
    children: React.ReactNode
    addPaddingBottom?: boolean;
}

export default function PaddingWrapper({ children, addPaddingBottom = true }: PaddingWrapperProps) {
    return (
        <View className={`flex-1 ${addPaddingBottom ? "p-5" : "p-5 pb-0"}`}>
            {children}
        </View>
    );
}