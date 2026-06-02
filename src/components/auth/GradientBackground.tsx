import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function GradientBackground({ children }: { children: React.ReactNode }) {
    return (
        <LinearGradient
            colors={['#22C55E', '#1A7A6E', '#1E3A8A']}
            locations={[0, 0.45, 1]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            className="flex-1"
        >
            <SafeAreaView className="flex-1">
                {children}
            </SafeAreaView>
        </LinearGradient>
    );
}