import { Stack } from 'expo-router';

export default function SaleLayout() {
    return (
        <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="[id]" />
            <Stack.Screen name="add-invoice" />
            <Stack.Screen name="preview-invoice" />
        </Stack>
    );
}
