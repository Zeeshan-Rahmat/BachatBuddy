import OrDivider from '@/src/components/auth/OrDivider';
import IconWrapper from '@/src/components/common/IconWrapper';
import { ICONS } from '@/src/constants/icons';

import GradientBackground from '@/src/components/auth/GradientBackground';
import TextButton from '@/src/components/common/TextButton';
import Title from '@/src/components/common/Title';
import Wrapper from '@/src/components/common/Wrapper';
import { ROUTES } from '@/src/constants/routes';
import * as LocalAuthentication from 'expo-local-authentication';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, TouchableOpacity } from 'react-native';

export default function FingerprintScreen() {
    const [authenticating, setAuthenticating] = useState(false);

    const handleBiometricAuth = async () => {

        if (authenticating) return;

        try {
            setAuthenticating(true);

            const hasHardware = await LocalAuthentication.hasHardwareAsync();
            const isEnrolled = await LocalAuthentication.isEnrolledAsync();

            if (!hasHardware || !isEnrolled) {
                Alert.alert(
                    'Not Available',
                    'Biometric authentication is not set up on this device.',
                );
                return;
            }

            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: 'Sign in to BachatBuddy',
                fallbackLabel: 'Use Password',
                cancelLabel: 'Cancel',
            });

            if (result.success) {
                // TODO: retrieve stored credentials from expo-secure-store and call API
                router.replace(ROUTES.DASHBOARD);
            } else {
                // Notice: result.error can be checked here if user cancelled explicitly
                Alert.alert('Failed', 'Biometric authentication failed. Please try again.');
            }
        } catch (error) {
            Alert.alert('Error', 'Something went wrong. Please try again.');
        } finally {
            setAuthenticating(false);
        }
    };


    useEffect(() => {
        const timer = setTimeout(() => {
            handleBiometricAuth();
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <GradientBackground>
            <Wrapper>

                <Title text="Sign In Using Touch ID" fontSize='text-2xl' className='mb-10' />

                <TouchableOpacity
                    onPress={handleBiometricAuth}
                    disabled={authenticating}
                    className="items-center mb-8"
                    activeOpacity={0.7}
                >
                    <IconWrapper name={ICONS.AUTH.largeFingerprint} size={100} />
                </TouchableOpacity>

                <OrDivider />

                <TextButton text="Sign In with Username" align='self-center' textstyle='underline' onPress={() => router.push(ROUTES.AUTH.SIGN_IN)} />

            </Wrapper>
        </GradientBackground>
    );
}