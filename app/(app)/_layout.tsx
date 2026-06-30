// app/(app)/_layout.tsx
import { Stack } from 'expo-router';

export default function AppLayout() {
    return (
        <Stack screenOptions={{ headerShown: false, animation: 'none' }}>
            <Stack.Screen name="dashboard/index" />
            <Stack.Screen name="stock/index" />
            <Stack.Screen name="sale" />
            <Stack.Screen name="reports/index" />
            <Stack.Screen name="parties/index" />
        </Stack>
    );
}
