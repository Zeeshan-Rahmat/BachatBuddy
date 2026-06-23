import { View } from 'react-native';

interface PaddingWrapperProps {
    children: React.ReactNode
    addPaddingBottom?: boolean;
    hasLowPaddingTop?: boolean;
}

export default function PaddingWrapper({ children, addPaddingBottom = true, hasLowPaddingTop = false }: PaddingWrapperProps) {
    return (
        <View className={`flex-1 ${addPaddingBottom ? "p-5" : "p-5 pb-0"} ${hasLowPaddingTop ? "pt-2" : ""}`}>
            {children}
        </View>
    );
}