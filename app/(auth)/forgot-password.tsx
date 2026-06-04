import GradientBackground from '@/src/components/auth/GradientBackground';
import InputText from '@/src/components/common/InputText';
import TextButton from '@/src/components/common/TextButton';
import Button from '@components/common/Button';
import IconWrapper from '@components/common/IconWrapper';
import Wrapper from '@components/common/Wrapper';

import { ICONS } from '@/src/constants/icons';

import AuthWrapper from '@/src/components/auth/AuthWrapper';
import Title from '@/src/components/common/Title';
import { ROUTES } from '@/src/constants/routes';
import { router } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';

export default function ForgotPasswordScreen() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSendOTP = async () => {
        if (!email.trim()) {
            setError('Please enter your email address');
            return;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Please enter a valid email address');
            return;
        }
        setError('');
        setLoading(true);

        // TODO: call your API → POST /api/auth/forgot-password { email }
        setTimeout(() => {
            setLoading(false);
            // Pass email to OTP screen for masked display
            router.push({
                pathname: ROUTES.AUTH.VERIFY_OTP,
                params: { email, flow: 'reset' },
            });
        }, 1000);
    };

    return (
        <GradientBackground>
            <AuthWrapper>
                <Wrapper>

                    <Title text="Verify Email Address" className='mb-4' />

                    <Text className="text-placeholder text-base text-center mb-8 leading-5 px-2">
                        Enter your email address and we will send you an OTP to reset your password
                    </Text>

                    <InputText
                        icon={<IconWrapper name={ICONS.email} />}
                        activeIcon={<IconWrapper name={ICONS.activeEmail} />}
                        placeholder="Email Address"
                        value={email}
                        onChangeText={(text) => { setEmail(text); setError(''); }}
                        keyboardType="email-address"
                        error={error}
                    />

                    <Button
                        label="Send OTP"
                        onPress={handleSendOTP}
                        loading={loading}
                    />

                    <View className="flex-row justify-center mt-5">
                        <Text className="text-gray-700 text-base">
                            Remembered your password?{' '}
                        </Text>
                        <TextButton text="Sign In" textstyle='underline' onPress={() => router.back()} />
                    </View>

                </Wrapper>
            </AuthWrapper>
        </GradientBackground>
    );
}