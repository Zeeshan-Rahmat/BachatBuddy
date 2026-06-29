import OrDivider from '@/src/components/auth/OrDivider';
import IconWrapper from '@/src/components/common/IconWrapper';
import { ICONS } from '@/src/constants/icons';

import GradientBackground from '@/src/components/auth/GradientBackground';
import TextButton from '@/src/components/common/TextButton';
import Title from '@/src/components/common/Title';
import Wrapper from '@/src/components/common/Wrapper';
import { ROUTES } from '@/src/constants/routes';
import { useBiometricSignIn } from '@/src/hooks/auth/useAuth';
import { loadBiometricCredentials } from '@/src/lib/secureStorage';
import { router } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, TouchableOpacity } from 'react-native';

export default function FingerprintScreen() {
    const [authenticating, setAuthenticating] = useState(false);
    const { signInWithBiometric, loading, error, clearError } = useBiometricSignIn();
    const hasPrompted = useRef(false);

    const handleBiometricAuth = useCallback(async () => {

        if (authenticating || loading) return;

        try {
            const credentials = await loadBiometricCredentials();
            if (!credentials) {
                router.replace(ROUTES.AUTH.SIGN_IN);
                return;
            }

            setAuthenticating(true);
            await signInWithBiometric();
        } catch {
            Alert.alert('Error', 'Something went wrong. Please try again.');
        } finally {
            setAuthenticating(false);
        }
    }, [authenticating, loading, signInWithBiometric]);


    useEffect(() => {
        if (hasPrompted.current) return;
        hasPrompted.current = true;

        const timer = setTimeout(() => {
            handleBiometricAuth();
        }, 500);

        return () => clearTimeout(timer);
    }, [handleBiometricAuth]);

    useEffect(() => {
        if (!error) return;

        Alert.alert('Sign In Failed', error, [
            {
                text: 'OK',
                onPress: clearError,
            },
        ]);
    }, [error, clearError]);

    return (
        <GradientBackground>
            <Wrapper>

                <Title text="Sign In Using Touch ID" fontSize='text-2xl' className='mb-10' />

                <TouchableOpacity
                    onPress={handleBiometricAuth}
                    disabled={authenticating || loading}
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
