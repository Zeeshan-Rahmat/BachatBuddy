import { Stack } from 'expo-router';

export default function AuthLayout() {
    return (
        <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
            <Stack.Screen name="sign-in" />
            <Stack.Screen name="sign-up" />
            <Stack.Screen name="manage-fingerprint" />
            <Stack.Screen name="fingerprint" />
            <Stack.Screen name="forgot-password" />
            <Stack.Screen name="verify-otp" />
            <Stack.Screen name="email-verified" />
            <Stack.Screen name="new-password" />
            <Stack.Screen name="password-updated" />
            <Stack.Screen name="sign-up-otp" />
            <Stack.Screen name="sign-up-verified" />
        </Stack>
    );
}