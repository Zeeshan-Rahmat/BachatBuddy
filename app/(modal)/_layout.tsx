// app/(app)/_layout.tsx
import { Stack } from 'expo-router';

export default function ModalLayout() {
    return (
        <Stack screenOptions={{ headerShown: false, animation: 'none' }}>
            <Stack.Screen name="profile/index" />
            <Stack.Screen name="notification/index" />
            <Stack.Screen name="logout/index" />
            <Stack.Screen name="business_profile/index" />
            <Stack.Screen name="change_password/index" />
            <Stack.Screen name="export/index" />
            <Stack.Screen name="smart_login/index" />
        </Stack>
    );
}