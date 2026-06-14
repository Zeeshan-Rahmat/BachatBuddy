// app/(app)/_layout.tsx
import { Stack } from 'expo-router';

export default function ModalLayout() {
    return (
        <Stack screenOptions={{ headerShown: false, animation: 'none' }}>
            <Stack.Screen name="profile/index" />
            <Stack.Screen name="notification/index" />
        </Stack>
    );
}